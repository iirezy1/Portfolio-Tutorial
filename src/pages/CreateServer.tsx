import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/Navigation";
import { AuthDialog } from "@/components/AuthDialog";
import { CreateServerRequest } from "@/types/server";
import { useServerContext } from "@/context/ServerContext";
import { hostingProviders } from "@/config/hostingProviders";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  Server,
  Crown,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Settings,
  Gamepad2,
  Shield,
  Lock,
  UserPlus,
  Copy,
} from "lucide-react";

const CreateServer = () => {
  const navigate = useNavigate();
  const { addServer } = useServerContext();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null,
  );
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  // التحقق من تسجيل الدخول عند تحميل الصفحة
  useEffect(() => {
    // في التطبيق الحقيقي، ستتم مراجعة حالة المصادقة من localStorage أو API
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleAuthSuccess = (userData: { name: string; email: string }) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const [formData, setFormData] = useState<CreateServerRequest>({
    name: "",
    description: "",
    version: "1.21.4",
    type: "java",
    hostingType: "demo",
    hostingProvider: undefined,
    customIP: "",
    customPort: undefined,
    motd: "",
    gameMode: "survival",
    difficulty: "normal",
    maxPlayers: 20,
    memorySize: 2048,
    pvp: true,
    whitelist: false,
  });

  const [generatedServer, setGeneratedServer] = useState<{
    ip: string;
    port: number;
  } | null>(null);

  const javaVersions = [
    "1.21.4",
    "1.21.3",
    "1.21.1",
    "1.20.4",
    "1.20.2",
    "1.20.1",
    "1.19.4",
    "1.19.2",
    "1.18.2",
  ];

  const bedrockVersions = [
    "1.21.80",
    "1.21.72",
    "1.21.70",
    "1.21.62",
    "1.21.60",
    "1.21.51",
    "1.21.50",
    "1.21.44",
    "1.21.41",
    "1.21.40",
  ];

  const memoryOptions = [
    {
      value: 1024,
      label: "1 GB - مجاني",
      description: "مثالي للبداية مع 5-10 لاعبين",
    },
    { value: 2048, label: "2 GB - مجاني", description: "جيد لحتى 15 لاعب" },
    { value: 4096, label: "4 GB - مميز", description: "ممتاز لحتى 30 لاعب" },
    {
      value: 8192,
      label: "8 GB - احترافي",
      description: "للسيرفرات الكبيرة حتى 60 لاعب",
    },
    {
      value: 16384,
      label: "16 GB - مؤسسي",
      description: "للسيرفرات الضخمة +100 لاعب",
    },
  ];

  const handleInputChange = (field: keyof CreateServerRequest, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateServer = async () => {
    setIsCreating(true);

    // محاكاة إنشاء السيرفر مع إنتاج IP وport حقيقي
    setTimeout(() => {
      // تحديد عنوان السيرفر حسب نوع الاستضافة
      let serverIP = "";
      let serverPort = 25565;

      if (formData.hostingType === "real") {
        if (
          formData.hostingProvider === "custom" &&
          formData.customIP &&
          formData.customPort
        ) {
          serverIP = formData.customIP;
          serverPort = formData.customPort;
        } else {
          // للخدمات الأخرى، يطلب من المستخدم إدخال العنوان الحقيقي
          serverIP = "YOUR_SERVER_IP_HERE";
          serverPort = formData.type === "java" ? 25565 : 19132;
        }
      } else {
        // سيرفر تجريبي
        serverIP = `${formData.name
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "")
          .substring(0, 10)}.demo.rbz`;
        serverPort =
          formData.type === "java"
            ? Math.floor(Math.random() * (30000 - 25565) + 25565)
            : Math.floor(Math.random() * (20000 - 19132) + 19132);
      }

      // إنشاء السيرفر الجديد
      const newServer = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        version: formData.version,
        type: formData.type,
        hostingType: formData.hostingType,
        hostingProvider: formData.hostingProvider,
        serverAddress: { ip: serverIP, port: serverPort },
        players: { online: 0, max: formData.maxPlayers },
        memory: { used: 0, total: formData.memorySize },
        createdAt: new Date(),
        motd: formData.motd,
        gameMode: formData.gameMode,
        difficulty: formData.difficulty,
        pvp: formData.pvp,
        whitelist: formData.whitelist,
        status: "offline" as const,
      };

      // إضافة السيرفر للسياق
      addServer(newServer);

      // حفظ معلومات السيرفر المنتج للعرض
      setGeneratedServer({
        ip: serverIP,
        port: serverPort,
      });

      setIsCreating(false);

      toast({
        title: "تم إنشاء السيرفر بنجاح! 🎉",
        description: `سيرفر ${formData.name} جاهز للاستخدام`,
      });
    }, 5000);
  };

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.name.trim().length > 0;
      case 2:
        if (formData.hostingType === "real") {
          return (
            formData.hostingProvider ||
            (formData.customIP && formData.customPort)
          );
        }
        return true;
      case 3:
        return true;
      case 4:
        return true;
      default:
        return false;
    }
  };

  if (isCreating || generatedServer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50">
        <Navigation />
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto text-center">
            {isCreating ? (
              <>
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Server className="w-10 h-10 text-green-600 animate-pulse" />
                </div>
                <h1 className="text-3xl font-bold mb-4">
                  جاري إنشاء سيرفرك...
                </h1>
                <p className="text-slate-600 mb-8">
                  يرجى الانتظار بينما نقوم بإعداد سيرفرك الجديد بذاكرة{" "}
                  {formData.memorySize}MB
                </p>
                <div className="bg-white rounded-lg p-6 space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    تحضير البيئة مع ذاكرة {formData.memorySize}MB...
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                    تثبيت مينكرافت{" "}
                    {formData.type === "bedrock" ? "بيدروك" : "جافا"}{" "}
                    {formData.version}...
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                    تحضير IP وport للاتصال...
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-400">
                    <div className="w-5 h-5 border-2 border-slate-300 rounded-full" />
                    تطبيق الإعدادات...
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-3xl font-bold mb-4 text-green-600">
                  تم إنشاء السيرفر بنجاح! 🎉
                </h1>
                <p className="text-slate-600 mb-4">
                  سيرفرك جاهز الآن{" "}
                  {formData.hostingType === "real" ? "للعب" : "للعرض التوضيحي"}.
                  استخدم المعلومات التالية للاتصال من مينكرافت.
                </p>

                {formData.hostingType === "demo" && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2 text-yellow-800 font-medium mb-2">
                      ⚠️ تنبيه: هذا سيرفر تجريبي
                    </div>
                    <p className="text-yellow-700 text-sm">
                      هذا العنوان للعرض التوضيحي فقط ولن يعمل في مينكرافت
                      الحقيقي. لإنشاء سيرفر حقيقي، اختر "سيرفر حقيقي" في الخطوة
                      الثانية.
                    </p>
                  </div>
                )}

                {formData.hostingType === "real" &&
                  formData.hostingProvider !== "custom" && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                      <div className="flex items-center gap-2 text-blue-800 font-medium mb-2">
                        ℹ️ خطوة إضافية مطلوبة
                      </div>
                      <p className="text-blue-700 text-sm">
                        يجب عليك الآن الذهاب إلى{" "}
                        {
                          hostingProviders.find(
                            (p) => p.id === formData.hostingProvider,
                          )?.name
                        }
                        وإنشاء سيرفر فعلي، ثم تحديث العنوان في إعدادات السيرفر.
                      </p>
                    </div>
                  )}

                <div className="bg-white rounded-lg p-6 mb-6 text-right">
                  <h2 className="text-xl font-bold mb-4 text-center">
                    معلومات الاتصال
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-green-800 mb-2">
                        عنوان السيرفر (IP)
                      </h3>
                      <div className="bg-white p-3 rounded border font-mono text-lg text-center">
                        {generatedServer?.ip}
                      </div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-blue-800 mb-2">
                        المنفذ (Port)
                      </h3>
                      <div className="bg-white p-3 rounded border font-mono text-lg text-center">
                        {generatedServer?.port}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                    <h3 className="font-semibold text-yellow-800 mb-2">
                      طريقة الاتصال في مينكرافت الجوال:
                    </h3>
                    <ol className="text-right text-sm space-y-2 text-yellow-700">
                      <li>1. افتح مينكرافت على جهازك</li>
                      <li>2. اضغط على "اللعب" ثم "السيرفرات"</li>
                      <li>3. اضغط على "إضافة سيرفر"</li>
                      <li>4. أدخل اسم السيرفر: {formData.name}</li>
                      <li>5. أدخل عنوان السيرفر: {generatedServer?.ip}</li>
                      <li>6. أدخل المنفذ: {generatedServer?.port}</li>
                      <li>7. احفظ واتصل!</li>
                    </ol>
                  </div>
                </div>

                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={() => navigate("/dashboard")}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    انتقل للوحة التح��م
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${generatedServer?.ip}:${generatedServer?.port}`,
                      );
                      toast({
                        title: "تم النسخ!",
                        description: "تم نسخ عنوان السيرفر للحافظة",
                      });
                    }}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    نسخ عنوان السيرفر
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // إذا لم يكن المستخدم مسجل دخول، عرض شاشة التسجيل
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50">
        <Navigation />

        <div className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold mb-4">تسجيل الدخول مطلوب</h1>
            <p className="text-slate-600 mb-8">
              يجب تسجيل الدخول أولاً لتتمكن من إنشاء سيرفر مينكرافت جديد
            </p>

            <div className="bg-white rounded-lg p-6 mb-8">
              <h2 className="text-lg font-semibold mb-4">
                لماذا نحتاج تسجيل الدخول؟
              </h2>
              <div className="text-right space-y-2 text-sm text-slate-600">
                <div>• لحفظ سيرفراتك وإدارتها</div>
                <div>• لحماية سيرفراتك من الوصول غير المصرح</div>
                <div>• لتلقي إشعارات حول حالة سيرفراتك</div>
                <div>• للحصول على دعم فني مخصص</div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => setAuthDialogOpen(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                تسجيل الدخول / إنشاء حساب
              </Button>
              <Button variant="outline" onClick={() => navigate("/")}>
                العودة للرئيسية
              </Button>
            </div>
          </div>
        </div>

        <AuthDialog
          open={authDialogOpen}
          onOpenChange={setAuthDialogOpen}
          onAuthSuccess={handleAuthSuccess}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              إنشاء سيرفر جديد
            </h1>
            <p className="text-slate-600">
              اتبع الخطوات لإعداد سيرفر مينكرافت المثالي
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-4">
              {[1, 2, 3, 4].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                      step >= stepNumber
                        ? "bg-green-600 border-green-600 text-white"
                        : "border-slate-300 text-slate-500"
                    }`}
                  >
                    {stepNumber}
                  </div>
                  {stepNumber < 4 && (
                    <div
                      className={`w-20 h-1 mx-2 ${
                        step > stepNumber ? "bg-green-600" : "bg-slate-300"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {step === 1 && (
                  <>
                    <Server className="w-5 h-5" />
                    معلومات السيرفر الأساسية
                  </>
                )}
                {step === 2 && (
                  <>
                    <Shield className="w-5 h-5" />
                    نوع الاستضافة
                  </>
                )}
                {step === 3 && (
                  <>
                    <Settings className="w-5 h-5" />
                    إعدادات اللعبة
                  </>
                )}
                {step === 4 && (
                  <>
                    <Gamepad2 className="w-5 h-5" />
                    الإعدادات المتقدمة
                  </>
                )}
              </CardTitle>
              <CardDescription>
                {step === 1 && "أدخل اسم السيرفر ووصفه"}
                {step === 2 && "اختر نوع الاستضافة (تجريبي أم حقيقي)"}
                {step === 3 && "اختر نوع اللعبة والإصدار"}
                {step === 4 && "إعدادات الأمان واللاعبين"}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Step 1: Basic Info */}
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">اسم السيرفر *</Label>
                    <Input
                      id="name"
                      placeholder="مثال: عالم البقاء الملحمي"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">وصف السيرفر</Label>
                    <Textarea
                      id="description"
                      placeholder="وصف قصير عن سيرفرك..."
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      className="mt-1"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="motd">رسالة الترحيب (MOTD)</Label>
                    <Input
                      id="motd"
                      placeholder="مرحباً بكم في سيرفري!"
                      value={formData.motd}
                      onChange={(e) =>
                        handleInputChange("motd", e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Hosting Type */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <Label>نوع الاستضافة</Label>
                    <div className="mt-2 space-y-3">
                      <div
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          formData.hostingType === "demo"
                            ? "border-blue-500 bg-blue-50"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                        onClick={() => handleInputChange("hostingType", "demo")}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-semibold text-blue-600">
                              🧪 سيرفر تجريبي
                            </div>
                            <div className="text-sm text-slate-600 mt-1">
                              للتجربة والتعلم فقط - لن يعمل في مينكرافت الحقيقي
                            </div>
                            <div className="text-xs text-slate-500 mt-2">
                              ⚠️ هذا مجرد عرض توضيحي ولا يمكن الاتصال به من
                              مينكرافت
                            </div>
                          </div>
                          <div className="w-4 h-4 rounded-full border-2 border-blue-500 flex items-center justify-center">
                            {formData.hostingType === "demo" && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            )}
                          </div>
                        </div>
                      </div>

                      <div
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          formData.hostingType === "real"
                            ? "border-green-500 bg-green-50"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                        onClick={() => handleInputChange("hostingType", "real")}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-semibold text-green-600">
                              🚀 سيرفر حقيقي
                            </div>
                            <div className="text-sm text-slate-600 mt-1">
                              ربط مع خدمة استضافة حقيقية - يعمل في مينكرافت
                            </div>
                            <div className="text-xs text-green-600 mt-2">
                              ✅ يمكن الاتصال به من مينكرافت الجوال والكمبيوتر
                            </div>
                          </div>
                          <div className="w-4 h-4 rounded-full border-2 border-green-500 flex items-center justify-center">
                            {formData.hostingType === "real" && (
                              <div className="w-2 h-2 bg-green-500 rounded-full" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hosting Provider Selection */}
                  {formData.hostingType === "real" && (
                    <div>
                      <Label>مزود الاستضافة</Label>
                      <div className="mt-2 space-y-3">
                        {hostingProviders.map((provider) => (
                          <div
                            key={provider.id}
                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                              formData.hostingProvider === provider.id
                                ? "border-green-500 bg-green-50"
                                : "border-slate-200 hover:border-slate-300"
                            }`}
                            onClick={() =>
                              handleInputChange("hostingProvider", provider.id)
                            }
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold">
                                    {provider.name}
                                  </span>
                                  <Badge
                                    variant={
                                      provider.type === "free"
                                        ? "secondary"
                                        : "outline"
                                    }
                                    className="text-xs"
                                  >
                                    {provider.type === "free"
                                      ? "مجاني"
                                      : "مدفوع"}
                                  </Badge>
                                </div>
                                <div className="text-sm text-slate-600 mt-1">
                                  {provider.description}
                                </div>

                                {formData.hostingProvider === provider.id && (
                                  <div className="mt-3 p-3 bg-slate-50 rounded">
                                    <div className="text-sm font-medium mb-2">
                                      خطوات الإعداد:
                                    </div>
                                    <ol className="text-xs text-slate-600 space-y-1">
                                      {provider.setupInstructions.map(
                                        (instruction, index) => (
                                          <li key={index}>
                                            {index + 1}. {instruction}
                                          </li>
                                        ),
                                      )}
                                    </ol>
                                  </div>
                                )}
                              </div>
                              <div className="w-4 h-4 rounded-full border-2 border-green-500 flex items-center justify-center ml-3">
                                {formData.hostingProvider === provider.id && (
                                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Custom Server Input */}
                      {formData.hostingProvider === "custom" && (
                        <div className="mt-4 space-y-4">
                          <div>
                            <Label htmlFor="custom-ip">عنوان IP المخصص</Label>
                            <Input
                              id="custom-ip"
                              placeholder="example.com أو 192.168.1.100"
                              value={formData.customIP}
                              onChange={(e) =>
                                handleInputChange("customIP", e.target.value)
                              }
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="custom-port">المنفذ (Port)</Label>
                            <Input
                              id="custom-port"
                              type="number"
                              placeholder="25565"
                              value={formData.customPort || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  "customPort",
                                  parseInt(e.target.value),
                                )
                              }
                              className="mt-1"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Game Settings */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>نوع السيرفر</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value: "java" | "bedrock") => {
                          handleInputChange("type", value);
                          // تحديث الإصدار تلقائياً حسب النوع
                          const defaultVersion =
                            value === "java"
                              ? javaVersions[0]
                              : bedrockVersions[0];
                          handleInputChange("version", defaultVersion);
                        }}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="java">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">جافا</Badge>
                              PC/Mac/Linux
                            </div>
                          </SelectItem>
                          <SelectItem value="bedrock">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">بيدروك</Badge>
                              الهاتف/كونسول
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>إصدار مينكرافت</Label>
                      <Select
                        value={formData.version}
                        onValueChange={(value) =>
                          handleInputChange("version", value)
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {(formData.type === "java"
                            ? javaVersions
                            : bedrockVersions
                          ).map((version) => (
                            <SelectItem key={version} value={version}>
                              {version} {formData.type === "bedrock" && "📱"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-slate-500 mt-1">
                        {formData.type === "bedrock"
                          ? "إصدارات مخصصة للجوال والكونسول"
                          : "إصدارات الكمبيوتر الشخصي"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>نمط اللعب</Label>
                      <Select
                        value={formData.gameMode}
                        onValueChange={(value: any) =>
                          handleInputChange("gameMode", value)
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="survival">بقاء</SelectItem>
                          <SelectItem value="creative">إبداع</SelectItem>
                          <SelectItem value="adventure">مغامرة</SelectItem>
                          <SelectItem value="spectator">مشاهد</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>مستوى الصعوبة</Label>
                      <Select
                        value={formData.difficulty}
                        onValueChange={(value: any) =>
                          handleInputChange("difficulty", value)
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="peaceful">سلمي</SelectItem>
                          <SelectItem value="easy">سهل</SelectItem>
                          <SelectItem value="normal">عادي</SelectItem>
                          <SelectItem value="hard">صعب</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Advanced Settings */}
              {step === 4 && (
                <div className="space-y-6">
                  <div>
                    <Label>حجم الذاكرة (RAM)</Label>
                    <div className="mt-2 space-y-3">
                      {memoryOptions.map((option) => (
                        <div
                          key={option.value}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            formData.memorySize === option.value
                              ? "border-green-500 bg-green-50"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                          onClick={() =>
                            handleInputChange("memorySize", option.value)
                          }
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-semibold">
                                {option.label}
                              </div>
                              <div className="text-sm text-slate-600">
                                {option.description}
                              </div>
                            </div>
                            <div className="w-4 h-4 rounded-full border-2 border-green-500 flex items-center justify-center">
                              {formData.memorySize === option.value && (
                                <div className="w-2 h-2 bg-green-500 rounded-full" />
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="maxPlayers">الحد الأقصى للاعبين</Label>
                    <Input
                      id="maxPlayers"
                      type="number"
                      min="1"
                      max="200"
                      value={formData.maxPlayers}
                      onChange={(e) =>
                        handleInputChange(
                          "maxPlayers",
                          parseInt(e.target.value),
                        )
                      }
                      className="mt-1"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="pvp">المعارك بين اللاعبين (PvP)</Label>
                        <p className="text-sm text-slate-600">
                          السماح للاعبين بمحاربة بعضهم البعض
                        </p>
                      </div>
                      <Switch
                        id="pvp"
                        checked={formData.pvp}
                        onCheckedChange={(checked) =>
                          handleInputChange("pvp", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="whitelist">القائمة البيضاء</Label>
                        <p className="text-sm text-slate-600">
                          السماح فقط للاعبين المدعوين بالدخول
                        </p>
                      </div>
                      <Switch
                        id="whitelist"
                        checked={formData.whitelist}
                        onCheckedChange={(checked) =>
                          handleInputChange("whitelist", checked)
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={step === 1}
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  السابق
                </Button>

                {step < 4 ? (
                  <Button
                    onClick={nextStep}
                    disabled={!isStepValid()}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    التالي
                    <ArrowLeft className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleCreateServer}
                    disabled={!isStepValid()}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    إنشاء السيرفر
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateServer;
