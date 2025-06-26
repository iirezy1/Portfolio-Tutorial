import { createContext, useContext, useState, ReactNode } from "react";
import { Server } from "@/types/server";

interface ServerContextType {
  servers: Server[];
  addServer: (server: Server) => void;
  updateServer: (id: string, updates: Partial<Server>) => void;
  deleteServer: (id: string) => void;
  startServer: (id: string) => void;
  stopServer: (id: string) => void;
  restartServer: (id: string) => void;
}

const ServerContext = createContext<ServerContextType | undefined>(undefined);

export const useServerContext = () => {
  const context = useContext(ServerContext);
  if (!context) {
    throw new Error("useServerContext must be used within ServerProvider");
  }
  return context;
};

interface ServerProviderProps {
  children: ReactNode;
}

export const ServerProvider = ({ children }: ServerProviderProps) => {
  const [servers, setServers] = useState<Server[]>([]);

  const generateServerAddress = (
    serverName: string,
    type: "java" | "bedrock",
  ) => {
    // إنتاج عنوان فريد بناءً على اسم السيرفر
    const subdomain = serverName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .substring(0, 10);

    const baseUrl = "rbz.host"; // يمكن تغييره للدومين الحقيقي
    const ip = `${subdomain}.${baseUrl}`;

    // بورتات مختلفة حسب النوع
    const port =
      type === "java"
        ? Math.floor(Math.random() * (30000 - 25565) + 25565)
        : Math.floor(Math.random() * (20000 - 19132) + 19132);

    return { ip, port };
  };

  const addServer = (server: Server) => {
    const serverAddress = generateServerAddress(server.name, server.type);
    const newServer = {
      ...server,
      serverAddress,
      id: Date.now().toString(),
      createdAt: new Date(),
      status: "offline" as const,
    };

    setServers((prev) => [...prev, newServer]);
  };

  const updateServer = (id: string, updates: Partial<Server>) => {
    setServers((prev) =>
      prev.map((server) =>
        server.id === id ? { ...server, ...updates } : server,
      ),
    );
  };

  const deleteServer = (id: string) => {
    setServers((prev) => prev.filter((server) => server.id !== id));
  };

  const startServer = (id: string) => {
    updateServer(id, { status: "starting" });

    // محاكاة عملية التشغيل
    setTimeout(() => {
      updateServer(id, {
        status: "online",
        lastOnline: new Date(),
        players: { online: 0, max: 20 },
      });
    }, 3000);
  };

  const stopServer = (id: string) => {
    updateServer(id, { status: "stopping" });

    // محاكاة عملية الإيقاف
    setTimeout(() => {
      updateServer(id, {
        status: "offline",
        players: { online: 0, max: 20 },
        memory: { used: 0, total: 2048 },
      });
    }, 2000);
  };

  const restartServer = (id: string) => {
    updateServer(id, { status: "stopping" });

    setTimeout(() => {
      updateServer(id, { status: "starting" });

      setTimeout(() => {
        updateServer(id, {
          status: "online",
          lastOnline: new Date(),
        });
      }, 3000);
    }, 2000);
  };

  return (
    <ServerContext.Provider
      value={{
        servers,
        addServer,
        updateServer,
        deleteServer,
        startServer,
        stopServer,
        restartServer,
      }}
    >
      {children}
    </ServerContext.Provider>
  );
};
