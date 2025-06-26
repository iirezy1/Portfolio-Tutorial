import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/Navigation";
import { ServerCard } from "@/components/ServerCard";
import { ServerStats } from "@/types/server";
import { useServerContext } from "@/context/ServerContext";
import { Link } from "react-router-dom";
import {
  Plus,
  Server as ServerIcon,
  Users,
  Activity,
  Crown,
  Search,
  Filter,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Dashboard = () => {
  const { servers, startServer, stopServer, restartServer } =
    useServerContext();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const stats: ServerStats = {
    totalServers: servers.length,
    onlineServers: servers.filter((s) => s.status === "online").length,
    totalPlayers: servers.reduce((sum, s) => sum + s.players.online, 0),
  };

  const filteredServers = servers.filter((server) => {
    const matchesSearch = server.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || server.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleServerAction = (action: string, serverId: string) => {
    switch (action) {
      case "start":
        startServer(serverId);
        break;
      case "stop":
        stopServer(serverId);
        break;
      case "restart":
        restartServer(serverId);
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              لوحة التحكم
            </h1>
            <p className="text-slate-600">
              إدارة وتتبع جميع سيرفراتك من مكان واحد
            </p>
          </div>

          <Link to="/create-server">
            <Button className="bg-green-600 hover:bg-green-700 mt-4 md:mt-0">
              <Plus className="w-4 h-4 mr-2" />
              إنشاء سيرفر جديد
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                إجمالي السيرفرات
              </CardTitle>
              <ServerIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalServers}</div>
              <p className="text-xs text-muted-foreground">
                {stats.onlineServers} متصل الآن
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                السيرفرات المتصلة
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.onlineServers}</div>
              <p className="text-xs text-muted-foreground">
                من أصل {stats.totalServers} سيرفر
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                اللاعبون المتصلون
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPlayers}</div>
              <p className="text-xs text-muted-foreground">
                عبر جميع السيرفرات
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">البحث والفلترة</CardTitle>
            <CardDescription>
              ابحث عن سيرفراتك أو قم بفلترتها حسب الحالة
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="ابحث عن سيرفر..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="فلترة حسب الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع السيرفرات</SelectItem>
                    <SelectItem value="online">متصل</SelectItem>
                    <SelectItem value="offline">غير متصل</SelectItem>
                    <SelectItem value="starting">جاري التشغيل</SelectItem>
                    <SelectItem value="stopping">جاري الإيقاف</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Servers Grid */}
        {filteredServers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServers.map((server) => (
              <ServerCard
                key={server.id}
                server={server}
                onStart={(id) => handleServerAction("start", id)}
                onStop={(id) => handleServerAction("stop", id)}
                onRestart={(id) => handleServerAction("restart", id)}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <ServerIcon className="w-16 h-16 text-slate-300 mb-4" />
              <h3 className="text-lg font-semibold text-slate-600 mb-2">
                لا توجد سيرفرات
              </h3>
              <p className="text-slate-500 text-center mb-6">
                {searchTerm || statusFilter !== "all"
                  ? "لم يتم العثور على سيرفرات تطابق البحث"
                  : "لم تقم بإنشاء أي سيرفرات بعد"}
              </p>
              <Link to="/create-server">
                <Button className="bg-green-600 hover:bg-green-700">
                  <Crown className="w-4 h-4 mr-2" />
                  أنشئ سيرفرك الأول
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
