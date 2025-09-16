import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { 
  Upload, 
  Image, 
  FileText, 
  Video, 
  Calculator, 
  Calendar, 
  Receipt,
  Smartphone,
  Share,
  Plus
} from 'lucide-react';

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-600">أدوات متعددة</h1>
            <div className="space-x-reverse space-x-4">
              <Link to="/login">
                <Button variant="outline">تسجيل الدخول</Button>
              </Link>
              <Link to="/register">
                <Button>إنشاء حساب جديد</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            مجموعة شاملة من الأدوات المفيدة
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            كل ما تحتاجه من أدوات في مكان واحد - سهل الاستخدام ومجاني
          </p>
          <Link to="/dashboard">
            <Button size="lg" className="text-lg px-8 py-3">
              ابدأ الآن
            </Button>
          </Link>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Upload className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle>رفع الملفات</CardTitle>
              <CardDescription>ارفع وشارك ملفاتك بسهولة</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Image className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle>تحويل الصور</CardTitle>
              <CardDescription>حول صيغ الصور بين جميع الأنواع</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <FileText className="h-8 w-8 text-purple-600 mb-2" />
              <CardTitle>تحويل الملفات</CardTitle>
              <CardDescription>حول بين صيغ الملفات المختلفة</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Video className="h-8 w-8 text-red-600 mb-2" />
              <CardTitle>تحويل المقاطع</CardTitle>
              <CardDescription>حول صيغ الفيديو والصوت</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Calculator className="h-8 w-8 text-orange-600 mb-2" />
              <CardTitle>حاسبة الشحن الدولي</CardTitle>
              <CardDescription>احسب تكلفة الشحن مع الضرائب السعودية</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Calendar className="h-8 w-8 text-teal-600 mb-2" />
              <CardTitle>حاسبة العمر</CardTitle>
              <CardDescription>احسب عمرك بالهجري والميلادي</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Receipt className="h-8 w-8 text-indigo-600 mb-2" />
              <CardTitle>حاسبة الضريبة</CardTitle>
              <CardDescription>استخرج واحسب الضرائب</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* iPhone Installation Guide */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-6 w-6" />
              كيفية إضافة الموقع للشاشة الرئيسية في الآيفون
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                <p>افتح الموقع في متصفح Safari على الآيفون</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                <div className="flex items-center gap-2">
                  <p>اضغط على زر المشاركة</p>
                  <Share className="h-4 w-4" />
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                <div className="flex items-center gap-2">
                  <p>اختر "إضافة إلى الشاشة الرئيسية"</p>
                  <Plus className="h-4 w-4" />
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</div>
                <p>اضغط "إضافة" لتأكيد العملية</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                <p className="text-green-800">
                  <strong>تهانينا!</strong> الآن يمكنك الوصول للموقع مباشرة من الشاشة الرئيسية مثل التطبيقات الأخرى
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 أدوات متعددة. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
}