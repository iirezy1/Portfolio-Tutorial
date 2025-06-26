import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Server } from "@/types/server";
import {
  Play,
  Square,
  RotateCcw,
  Settings,
  Users,
  Clock,
  HardDrive,
  Edit3,
  Copy,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface ServerCardProps {
  server: Server;
  onStart?: (serverId: string) => void;
  onStop?: (serverId: string) => void;
  onRestart?: (serverId: string) => void;
}

export const ServerCard = ({
  server,
  onStart,
  onStop,
  onRestart,
}: ServerCardProps) => {
  const [editingIP, setEditingIP] = useState(false);
  const [customIP, setCustomIP] = useState(server.serverAddress.ip);
  const { toast } = useToast();
  const getStatusIndicator = (status: Server["status"]) => {
    switch (status) {
      case "online":
        return (
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="text-green-600 font-medium">متصل</span>
          </div>
        );
      case "offline":
        return (
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-400 rounded-full" />
            <span className="text-gray-600">غير متصل</span>
          </div>
        );
      case "starting":
        return (
          <div className="flex items-center gap-1">
            <Loader2 className="w-3 h-3 text-yellow-500 animate-spin" />
            <span className="text-yellow-600">جاري التشغيل...</span>
          </div>
        );
      case "stopping":
        return (
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse" />
            <span className="text-orange-600">جاري الإيقاف...</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-400 rounded-full" />
            <span className="text-gray-600">غير معروف</span>
          </div>
        );
    }
  };

  const getStatusText = (status: Server["status"]) => {
    switch (status) {
      case "online":
        return "متصل";
      case "offline":
        return "غير متصل";
      case "starting":
        return "جاري التشغيل";
      case "stopping":
        return "جاري الإيقاف";
      default:
        return "غير معروف";
    }
  };

  const memoryUsagePercent = (server.memory.used / server.memory.total) * 100;

  return (
    <Card className="hover:shadow-lg transition-shadow border-2 hover:border-green-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{server.name}</CardTitle>
            <div className="space-y-2">
              {getStatusIndicator(server.status)}
              <div className="flex items-center gap-2 text-sm flex-wrap">
                <Badge variant="outline" className="text-xs">
                  {server.type === "java" ? "جافا" : "بيدروك"} {server.version}
                </Badge>
                {server.type === "bedrock" && (
                  <Badge variant="secondary" className="text-xs">
                    📱 الجوال
                  </Badge>
                )}
                <Badge
                  variant={
                    server.hostingType === "real" ? "default" : "secondary"
                  }
                  className="text-xs"
                >
                  {server.hostingType === "real" ? "🚀 حقيقي" : "🧪 تجريبي"}
                </Badge>
              </div>
            </div>
          </div>
          <Link to={`/server/${server.id}`}>
            <Button variant="outline" size="sm" className="gap-1">
              <Settings className="w-4 h-4" />
              إدارة
            </Button>
          </Link>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {server.description && (
          <p className="text-sm text-slate-600">{server.description}</p>
        )}

        {/* Server Stats */}
        <div className="space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-500" />
              <span>
                {server.players.online}/{server.players.max} لاعب
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" />
              <span>
                {server.lastOnline
                  ? new Date(server.lastOnline).toLocaleDateString("ar")
                  : "لم يتم التشغيل"}
              </span>
            </div>
          </div>

          {/* Server Address */}
          <div
            className={`p-3 rounded-lg ${
              server.hostingType === "demo"
                ? "bg-yellow-50 border border-yellow-200"
                : "bg-slate-50"
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-600 font-medium">
                عنوان السيرفر:
                {server.hostingType === "demo" && (
                  <span className="text-yellow-600 text-xs ml-1">(تجريبي)</span>
                )}
              </span>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${server.serverAddress.ip}:${server.serverAddress.port}`,
                    );
                    toast({
                      title: "تم النسخ!",
                      description: "تم نسخ عنوان السيرفر",
                    });
                  }}
                >
                  <Copy className="w-3 h-3" />
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Edit3 className="w-3 h-3" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>تخصيص عنوان السيرفر</DialogTitle>
                      <DialogDescription>
                        يمكنك تخصيص عنوان فرعي لسيرفرك (مثل: myserver.rbz.host)
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">
                          العنوان المخصص
                        </label>
                        <div className="flex items-center mt-1">
                          <Input
                            value={customIP.replace(".rbz.host", "")}
                            onChange={(e) =>
                              setCustomIP(`${e.target.value}.rbz.host`)
                            }
                            placeholder="myserver"
                            className="rounded-r-none"
                          />
                          <div className="bg-slate-100 px-3 py-2 border border-l-0 rounded-l-none text-sm text-slate-600">
                            .rbz.host
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => {
                            // في التطبيق الحقيقي، سيتم حفظ التغيير
                            toast({
                              title: "تم التحديث!",
                              description: "تم تحديث عنوان السيرفر",
                            });
                          }}
                          className="flex-1"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          حفظ
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <code className="bg-white px-3 py-2 rounded border font-mono text-sm block">
              {server.serverAddress.ip}:{server.serverAddress.port}
            </code>
          </div>
        </div>

        {/* Memory Usage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-slate-500" />
              <span>استخدام الذاكرة</span>
            </div>
            <span className="text-slate-600">
              {server.memory.used}MB / {server.memory.total}MB
            </span>
          </div>
          <Progress value={memoryUsagePercent} className="h-2" />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          {server.status === "offline" && (
            <Button
              size="sm"
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={() => onStart?.(server.id)}
            >
              <Play className="w-4 h-4 mr-1" />
              تشغيل
            </Button>
          )}

          {server.status === "online" && (
            <>
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => onStop?.(server.id)}
              >
                <Square className="w-4 h-4 mr-1" />
                إيقاف
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onRestart?.(server.id)}
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </>
          )}

          {(server.status === "starting" || server.status === "stopping") && (
            <Button size="sm" disabled className="flex-1">
              {server.status === "starting"
                ? "جاري التشغيل..."
                : "جاري الإيقاف..."}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
