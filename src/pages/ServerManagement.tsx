import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Navigation } from "@/components/Navigation";
import { useServerContext } from "@/context/ServerContext";
import {
  Play,
  Square,
  RotateCcw,
  Settings,
  Users,
  FileText,
  Terminal,
  Download,
  Upload,
  Trash2,
  ArrowLeft,
  Activity,
  Clock,
  HardDrive,
  Wifi,
  AlertTriangle,
  Crown,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ServerManagement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { servers, startServer, stopServer, restartServer } =
    useServerContext();

  // العثور على السيرفر المحدد
  const server = servers.find((s) => s.id === id);

  // إذا لم يتم العثور على السيرفر، توجيه للوحة التحكم
  if (!server) {
    navigate("/dashboard");
    return null;
  }

  const [consoleLog, setConsoleLog] = useState([
    "[18:30:45] [Server thread/INFO]: Starting minecraft server version 1.20.4",
    "[18:30:45] [Server thread/INFO]: Loading properties",
    "[18:30:46] [Server thread/INFO]: Default game type: SURVIVAL",
    "[18:30:46] [Server thread/INFO]: Generating keypair",
    "[18:30:47] [Server thread/INFO]: Starting Minecraft server on *:25565",
    '[18:30:47] [Server thread/INFO]: Done (2.1s)! For help, type "help"',
    "[18:32:15] [User Authenticator #1/INFO]: Player123 joined the game",
    "[18:45:32] [Server thread/INFO]: Player123 has completed the advancement [Getting Wood]",
  ]);

  const [consoleInput, setConsoleInput] = useState("");

  const [players, setPlayers] = useState([
    {
      id: "1",
      name: "Player123",
      status: "online",
      joinedAt: "18:32:15",
      location: "x: 45, y: 64, z: -123",
      health: 20,
      gameMode: "survival",
      isOp: false,
    },
    {
      id: "2",
      name: "BuilderPro",
      status: "online",
      joinedAt: "18:15:30",
      location: "x: -89, y: 71, z: 256",
      health: 15,
      gameMode: "creative",
      isOp: true,
    },
    {
      id: "3",
      name: "Miner2024",
      status: "online",
      joinedAt: "17:55:12",
      location: "x: 12, y: 34, z: 78",
      health: 18,
      gameMode: "survival",
      isOp: false,
    },
  ]);

  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [playerAction, setPlayerAction] = useState<{
    type: "message" | "teleport" | "kick" | "ban" | "op" | null;
    playerId: string | null;
  }>({ type: null, playerId: null });

  const files = [
    { name: "server.properties", size: "2.3 KB", modified: "منذ ساعتين" },
    { name: "world", size: "45.7 MB", modified: "منذ 5 دقائق" },
    { name: "plugins", size: "12.1 MB", modified: "منذ يوم" },
    { name: "logs", size: "3.8 MB", modified: "منذ دقيقة" },
    { name: "banned-players.json", size: "0.5 KB", modified: "منذ أسبوع" },
  ];

  const getStatusColor = (status: Server["status"]) => {
    switch (status) {
      case "online":
        return "text-green-600";
      case "offline":
        return "text-gray-600";
      case "starting":
        return "text-yellow-600";
      case "stopping":
        return "text-orange-600";
      default:
        return "text-gray-600";
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

  const handleConsoleCommand = () => {
    if (consoleInput.trim()) {
      setConsoleLog((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString("ar")}] [Console]: ${consoleInput}`,
      ]);
      setConsoleInput("");
    }
  };

  const memoryUsagePercent = (server.memory.used / server.memory.total) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            العودة للوحة التحكم
          </Button>

          <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
              {server.name}
              <Badge
                variant={server.status === "online" ? "default" : "secondary"}
                className={cn("text-sm", getStatusColor(server.status))}
              >
                {getStatusText(server.status)}
              </Badge>
            </h1>
            <p className="text-slate-600 mt-1">{server.description}</p>
          </div>

          {/* Server Controls */}
          <div className="flex gap-2">
            {server.status === "offline" && (
              <Button className="bg-green-600 hover:bg-green-700">
                <Play className="w-4 h-4 mr-2" />
                تشغيل
              </Button>
            )}

            {server.status === "online" && (
              <>
                <Button variant="outline">
                  <Square className="w-4 h-4 mr-2" />
                  إيقاف
                </Button>
                <Button variant="outline">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  إعادة تشغيل
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Server Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">اللاعبون</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {server.players.online}/{server.players.max}
              </div>
              <p className="text-xs text-muted-foreground">متصل الآن</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">وقت التشغيل</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3.5</div>
              <p className="text-xs text-muted-foreground">ساعات</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                استخدام الذاكرة
              </CardTitle>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(memoryUsagePercent)}%
              </div>
              <Progress value={memoryUsagePercent} className="h-2 mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {server.memory.used}MB / {server.memory.total}MB
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                حالة الاتصال
              </CardTitle>
              <Wifi className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">مستقر</div>
              <p className="text-xs text-muted-foreground">45ms ping</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="console" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="console">
              <Terminal className="w-4 h-4 mr-2" />
              وحدة التحكم
            </TabsTrigger>
            <TabsTrigger value="players">
              <Users className="w-4 h-4 mr-2" />
              اللاعبون
            </TabsTrigger>
            <TabsTrigger value="files">
              <FileText className="w-4 h-4 mr-2" />
              الملفات
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="w-4 h-4 mr-2" />
              الإعدادات
            </TabsTrigger>
            <TabsTrigger value="stats">
              <Activity className="w-4 h-4 mr-2" />
              الإحصائيات
            </TabsTrigger>
          </TabsList>

          {/* Console Tab */}
          <TabsContent value="console">
            <Card>
              <CardHeader>
                <CardTitle>وحدة التحكم</CardTitle>
                <CardDescription>
                  راقب نشاط السيرفر وأرسل الأوامر
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm h-80 overflow-y-auto mb-4">
                  {consoleLog.map((line, index) => (
                    <div key={index} className="mb-1">
                      {line}
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="أدخل أمر..."
                    value={consoleInput}
                    onChange={(e) => setConsoleInput(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleConsoleCommand()
                    }
                    className="font-mono"
                  />
                  <Button onClick={handleConsoleCommand}>إرسال</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Players Tab */}
          <TabsContent value="players">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>إدارة اللاعبين المتصلين</CardTitle>
                  <CardDescription>
                    عرض وإدارة اللاعبين المتصلين بالسيرفر حالياً (
                    {players.length} لاعب)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {players.map((player) => (
                      <div
                        key={player.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50"
                      >
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                              <Users className="w-6 h-6 text-green-600" />
                            </div>
                            {player.isOp && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                                <Crown className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">
                                {player.name}
                              </span>
                              <Badge
                                variant={player.isOp ? "default" : "secondary"}
                                className="text-xs"
                              >
                                {player.isOp ? "مشرف" : "لاعب"}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {player.gameMode === "survival"
                                  ? "بقاء"
                                  : player.gameMode === "creative"
                                    ? "إبداع"
                                    : player.gameMode}
                              </Badge>
                            </div>
                            <div className="text-sm text-slate-600 mt-1">
                              انضم في {player.joinedAt} • الصحة: {player.health}
                              /20
                            </div>
                            <div className="text-xs text-slate-500">
                              الموقع: {player.location}
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setPlayerAction({
                                type: "message",
                                playerId: player.id,
                              })
                            }
                          >
                            💬 رسالة
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setPlayerAction({
                                type: "teleport",
                                playerId: player.id,
                              })
                            }
                          >
                            📍 نقل
                          </Button>
                          {!player.isOp && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setPlayerAction({
                                  type: "op",
                                  playerId: player.id,
                                })
                              }
                              className="text-yellow-600 hover:text-yellow-700"
                            >
                              👑 ترقية
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setPlayerAction({
                                type: "kick",
                                playerId: player.id,
                              })
                            }
                            className="text-orange-600 hover:text-orange-700"
                          >
                            ⚠️ طرد
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setPlayerAction({
                                type: "ban",
                                playerId: player.id,
                              })
                            }
                            className="text-red-600 hover:text-red-700"
                          >
                            🚫 حظر
                          </Button>
                        </div>
                      </div>
                    ))}

                    {players.length === 0 && (
                      <div className="text-center py-8 text-slate-500">
                        <Users className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                        <p>لا يوجد لاعبون متصلون حالياً</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Player Actions */}
              {playerAction.type && (
                <Card>
                  <CardHeader>
                    <CardTitle>إجراء على اللاعب</CardTitle>
                    <CardDescription>
                      {playerAction.type === "message" && "إرسال رسالة خاصة"}
                      {playerAction.type === "teleport" && "نقل اللاعب"}
                      {playerAction.type === "kick" && "طرد اللاعب"}
                      {playerAction.type === "ban" && "حظر اللاعب"}
                      {playerAction.type === "op" && "منح صلاحيات المشرف"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {playerAction.type === "message" && (
                      <div className="space-y-4">
                        <div>
                          <Label>الرسالة</Label>
                          <Textarea
                            placeholder="أدخل ر��التك هنا..."
                            className="mt-1"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button className="bg-green-600 hover:bg-green-700">
                            إرسال الرسالة
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() =>
                              setPlayerAction({ type: null, playerId: null })
                            }
                          >
                            إلغاء
                          </Button>
                        </div>
                      </div>
                    )}

                    {playerAction.type === "teleport" && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label>X</Label>
                            <Input placeholder="0" className="mt-1" />
                          </div>
                          <div>
                            <Label>Y</Label>
                            <Input placeholder="64" className="mt-1" />
                          </div>
                          <div>
                            <Label>Z</Label>
                            <Input placeholder="0" className="mt-1" />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button className="bg-blue-600 hover:bg-blue-700">
                            نقل اللاعب
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() =>
                              setPlayerAction({ type: null, playerId: null })
                            }
                          >
                            إلغاء
                          </Button>
                        </div>
                      </div>
                    )}

                    {(playerAction.type === "kick" ||
                      playerAction.type === "ban") && (
                      <div className="space-y-4">
                        <div>
                          <Label>السبب</Label>
                          <Input
                            placeholder="سبب الطرد/الحظر..."
                            className="mt-1"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="destructive"
                            onClick={() => {
                              // تنفيذ الطرد/الحظر
                              setPlayers((prev) =>
                                prev.filter(
                                  (p) => p.id !== playerAction.playerId,
                                ),
                              );
                              setPlayerAction({ type: null, playerId: null });
                            }}
                          >
                            {playerAction.type === "kick"
                              ? "طرد اللاعب"
                              : "حظر اللاعب"}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() =>
                              setPlayerAction({ type: null, playerId: null })
                            }
                          >
                            إلغاء
                          </Button>
                        </div>
                      </div>
                    )}

                    {playerAction.type === "op" && (
                      <div className="space-y-4">
                        <div className="p-4 bg-yellow-50 rounded-lg">
                          <p className="text-sm text-yellow-800">
                            ⚠️ هذا الإجراء سيمنح اللاعب صلاحيات المشرف الكاملة
                            على السيرفر
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            className="bg-yellow-600 hover:bg-yellow-700"
                            onClick={() => {
                              setPlayers((prev) =>
                                prev.map((p) =>
                                  p.id === playerAction.playerId
                                    ? { ...p, isOp: true }
                                    : p,
                                ),
                              );
                              setPlayerAction({ type: null, playerId: null });
                            }}
                          >
                            منح صلاحيات المشرف
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() =>
                              setPlayerAction({ type: null, playerId: null })
                            }
                          >
                            إلغاء
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Files Tab */}
          <TabsContent value="files">
            <Card>
              <CardHeader>
                <CardTitle>إدارة الملفات</CardTitle>
                <CardDescription>تصفح وإدارة ملفات السيرفر</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-4">
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    رفع ملف
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    تحميل النسخة الاحتياطية
                  </Button>
                </div>

                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-slate-500" />
                        <div>
                          <div className="font-medium">{file.name}</div>
                          <div className="text-sm text-slate-600">
                            {file.size} • تم التعديل {file.modified}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          تحرير
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>إعدادات السيرفر</CardTitle>
                  <CardDescription>قم بتخصيص إعدادات سيرفرك</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="server-name">اسم السيرفر</Label>
                    <Input
                      id="server-name"
                      defaultValue={server.name}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="motd">رسالة الترحيب</Label>
                    <Textarea
                      id="motd"
                      defaultValue={server.motd}
                      className="mt-1"
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="max-players">الحد الأقصى للاعبين</Label>
                      <Input
                        id="max-players"
                        type="number"
                        defaultValue={server.players.max}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="difficulty">مستوى الصعوبة</Label>
                      <Input
                        id="difficulty"
                        defaultValue={server.difficulty}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>المعارك بين اللاعبين (PvP)</Label>
                        <p className="text-sm text-slate-600">
                          السماح للاعبين بمحاربة بعضهم البعض
                        </p>
                      </div>
                      <Switch defaultChecked={server.pvp} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>القائمة البيضاء</Label>
                        <p className="text-sm text-slate-600">
                          السماح فقط للاعبين المدعوين بالدخول
                        </p>
                      </div>
                      <Switch defaultChecked={server.whitelist} />
                    </div>
                  </div>

                  <Button className="bg-green-600 hover:bg-green-700">
                    حفظ الإعدادات
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-red-600">المنطقة الخطرة</CardTitle>
                  <CardDescription>
                    إجراءات لا يمكن التراجع عنها
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      <div>
                        <div className="font-semibold text-red-800">
                          حذف السيرفر
                        </div>
                        <div className="text-sm text-red-600">
                          سيتم حذف جميع البيانات نهائياً
                        </div>
                      </div>
                    </div>
                    <Button variant="destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      حذف السيرفر
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats">
            <Card>
              <CardHeader>
                <CardTitle>إحصائيات السيرفر</CardTitle>
                <CardDescription>تفاصيل الأداء والاستخدام</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">أداء السيرفر</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>استخدام المعالج:</span>
                        <span className="font-mono">45%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>استخدام الذاكرة:</span>
                        <span className="font-mono">
                          {server.memory.used}MB / {server.memory.total}MB
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>سرعة الاستجابة:</span>
                        <span className="font-mono">45ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span>وقت التشغيل:</span>
                        <span className="font-mono">3h 45m</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">إحصائيات اللعبة</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>إجمالي مرات الدخول:</span>
                        <span className="font-mono">1,234</span>
                      </div>
                      <div className="flex justify-between">
                        <span>اللاعبون الفريدون:</span>
                        <span className="font-mono">156</span>
                      </div>
                      <div className="flex justify-between">
                        <span>أوامر منفذة:</span>
                        <span className="font-mono">8,932</span>
                      </div>
                      <div className="flex justify-between">
                        <span>حجم العالم:</span>
                        <span className="font-mono">45.7 MB</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ServerManagement;
