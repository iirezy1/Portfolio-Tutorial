export interface HostingProvider {
  id: string;
  name: string;
  type: "free" | "paid";
  description: string;
  baseUrl: string;
  defaultPort: number;
  supportsCustomIP: boolean;
  setupInstructions: string[];
  logo?: string;
}

export const hostingProviders: HostingProvider[] = [
  {
    id: "aternos",
    name: "Aternos",
    type: "free",
    description: "استضافة مجانية مع إمكانيات محدودة",
    baseUrl: "aternos.me",
    defaultPort: 25565,
    supportsCustomIP: true,
    setupInstructions: [
      "سجل في موقع Aternos.org",
      "أنشئ سيرفر جديد",
      "انسخ عنوان السيرفر من لوحة التحكم",
      "ألصق العنوان هنا",
    ],
  },
  {
    id: "minehut",
    name: "Minehut",
    type: "free",
    description: "استضافة مجانية مع دعم المودات",
    baseUrl: "minehut.gg",
    defaultPort: 25565,
    supportsCustomIP: true,
    setupInstructions: [
      "سجل في موقع Minehut.com",
      "أنشئ سيرفر جديد",
      "شغل السيرفر من لوحة التحكم",
      "انسخ عنوان الاتصال",
    ],
  },
  {
    id: "server_pro",
    name: "Server.pro",
    type: "free",
    description: "استضافة مجانية ومدفوعة",
    baseUrl: "server.pro",
    defaultPort: 25565,
    supportsCustomIP: true,
    setupInstructions: [
      "سجل في موقع Server.pro",
      "اختر الخطة المجانية",
      "أنشئ سيرفر مينكرافت",
      "احصل على عنوان الاتصال",
    ],
  },
  {
    id: "custom",
    name: "خادم مخصص",
    type: "paid",
    description: "أدخل عنوان سيرفرك المخصص",
    baseUrl: "custom.server",
    defaultPort: 25565,
    supportsCustomIP: true,
    setupInstructions: [
      "استأجر خادم من أي مزود استضافة",
      "ثبت مينكرافت على الخادم",
      "اضبط إعدادات الشبكة والمنافذ",
      "أدخل العنوان والمنفذ هنا",
    ],
  },
];
