export interface Server {
  id: string;
  name: string;
  description?: string;
  status: "online" | "offline" | "starting" | "stopping";
  version: string;
  type: "java" | "bedrock";
  hostingType: "demo" | "real";
  hostingProvider?: string;
  serverAddress: {
    ip: string;
    port: number;
  };
  players: {
    online: number;
    max: number;
  };
  memory: {
    used: number;
    total: number;
  };
  createdAt: Date;
  lastOnline?: Date;
  motd?: string;
  gameMode: "survival" | "creative" | "adventure" | "spectator";
  difficulty: "peaceful" | "easy" | "normal" | "hard";
  pvp: boolean;
  whitelist: boolean;
}

export interface CreateServerRequest {
  name: string;
  description?: string;
  version: string;
  type: "java" | "bedrock";
  hostingType: "demo" | "real";
  hostingProvider?: string;
  customIP?: string;
  customPort?: number;
  motd?: string;
  gameMode: "survival" | "creative" | "adventure" | "spectator";
  difficulty: "peaceful" | "easy" | "normal" | "hard";
  maxPlayers: number;
  memorySize: 1024 | 2048 | 4096 | 8192 | 16384;
  pvp: boolean;
  whitelist: boolean;
}

export interface ServerStats {
  totalServers: number;
  onlineServers: number;
  totalPlayers: number;
}
