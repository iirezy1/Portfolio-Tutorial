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
import { Link } from "react-router-dom";
import {
  Server,
  Shield,
  Zap,
  Globe,
  Users,
  Crown,
  Gamepad2,
  Cloud,
  Lock,
  Heart,
  Star,
  CheckCircle,
} from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: Server,
      title: "سيرفرات مجانية",
      description: "استضافة مجانية تماماً لسيرفرات مينكرافت مع أداء عالي",
    },
    {
      icon: Shield,
      title: "حماية قوية",
      description: "حماية من الهجمات DDoS وأمان عالي لبياناتك",
    },
    {
      icon: Zap,
      title: "تشغيل فوري",
      description: "ابدأ سيرفرك في ثوانٍ معدودة بضغطة زر واحدة",
    },
    {
      icon: Globe,
      title: "وصول عالمي",
      description: "سيرفرات موزعة حول العالم لأفضل أداء",
    },
    {
      icon: Users,
      title: "إدارة اللاعبين",
      description: "تحكم كامل في اللاعبين والصلاحيات",
    },
    {
      icon: Cloud,
      title: "نسخ احتياطية",
      description: "نسخ احتياطية تلقائية لحماية عالمك",
    },
  ];

  const stats = [
    { number: "2M+", label: "سيرفر نشط" },
    { number: "50M+", label: "لاعب" },
    { number: "99.9%", label: "وقت التشغيل" },
    { number: "24/7", label: "دعم فني" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6 text-sm px-4 py-2">
              🎮 Server Arabe Home - أفضل استضافة مينكرافت عربية
            </Badge>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent leading-tight">
              أنشئ سيرفر مينكرافت
              <br />
              مجاناً في دقائق
            </h1>

            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              أفضل منصة لاستضافة سيرفرات مينكرافت مجاناً مع أدوات احترافية
              وحماية قوية ودعم فني متواصل
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link to="/create-server">
                <Button
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-lg px-8 py-6 rounded-xl"
                >
                  <Crown className="mr-2 h-5 w-5" />
                  ابدأ سيرفرك الآن
                </Button>
              </Link>

              <Link to="/dashboard">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-6 rounded-xl"
                >
                  <Gamepad2 className="mr-2 h-5 w-5" />
                  عرض السيرفرات
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-green-600 mb-1">
                    {stat.number}
                  </div>
                  <div className="text-slate-600 text-sm md:text-base">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-slate-800">
              لماذا تختار منصتنا؟
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              نوفر أفضل تجربة لاستضافة سيرفرات مينكرافت مع مميزات لا تجدها في أي
              مكان آخر
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="border-2 hover:border-green-200 transition-colors hover:shadow-lg"
                >
                  <CardHeader>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-green-600" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-slate-600 leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto text-white">
            <h2 className="text-4xl font-bold mb-6">جاهز لبدء مغامرتك؟</h2>
            <p className="text-xl mb-8 opacity-90">
              انضم إلى آلاف اللاعبين الذين يثقون بمنصتنا لاستضافة سيرفراتهم
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/create-server">
                <Button
                  size="lg"
                  variant="secondary"
                  className="text-lg px-8 py-6 rounded-xl"
                >
                  <Star className="mr-2 h-5 w-5" />
                  أنشئ سيرفرك المجاني
                </Button>
              </Link>
            </div>

            <div className="mt-8 flex items-center justify-center gap-4 text-sm opacity-75">
              <div className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                مجاني تماماً
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                لا يحتاج بطاقة ائتمان
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                إعداد فوري
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-slate-900 text-white">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown className="w-6 h-6 text-green-400" />
            <span className="text-xl font-bold">Server Arabe Home</span>
          </div>
          <p className="text-slate-400 mb-4">
            أفضل منصة لاستضافة سيرفرات مينكرافت مجاناً
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-1 text-sm text-slate-500">
              <Heart className="w-4 h-4 text-red-400" />
              صُنع بحب للمجتمع العربي
            </div>
            <div className="text-xs text-slate-600">
              تطوير:{" "}
              <span className="font-semibold text-green-400">ريمو براون</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
