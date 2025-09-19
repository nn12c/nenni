import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  Upload, 
  Image, 
  FileText, 
  Video, 
  Calculator, 
  Calendar, 
  Receipt,
  LogOut,
  User
} from 'lucide-react';

import FileUpload from '@/components/FileUpload';
import ImageConverter from '@/components/ImageConverter';
import FileConverter from '@/components/FileConverter';
import VideoConverter from '@/components/VideoConverter';
import ShippingCalculator from '@/components/ShippingCalculator';
import AgeCalculator from '@/components/AgeCalculator';
import TaxCalculator from '@/components/TaxCalculator';

interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(currentUser));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    toast.success('تم تسجيل الخروج بنجاح');
    navigate('/');
  };

  if (!user) {
    return <div>جاري التحميل...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-600">أدوات متعددة</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="text-sm text-gray-600">مرحباً، {user.name}</span>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 ml-2" />
                تسجيل الخروج
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">لوحة التحكم</h2>
          <p className="text-gray-600">اختر الأداة التي تريد استخدامها</p>
        </div>

        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-7 mb-8">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              رفع الملفات
            </TabsTrigger>
            <TabsTrigger value="image" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              تحويل الصور
            </TabsTrigger>
            <TabsTrigger value="file" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              تحويل الملفات
            </TabsTrigger>
            <TabsTrigger value="video" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              تحويل المقاطع
            </TabsTrigger>
            <TabsTrigger value="shipping" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              حاسبة الشحن
            </TabsTrigger>
            <TabsTrigger value="age" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              حاسبة العمر
            </TabsTrigger>
            <TabsTrigger value="tax" className="flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              حاسبة الضريبة
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <FileUpload />
          </TabsContent>
          
          <TabsContent value="image">
            <ImageConverter />
          </TabsContent>
          
          <TabsContent value="file">
            <FileConverter />
          </TabsContent>
          
          <TabsContent value="video">
            <VideoConverter />
          </TabsContent>
          
          <TabsContent value="shipping">
            <ShippingCalculator />
          </TabsContent>
          
          <TabsContent value="age">
            <AgeCalculator />
          </TabsContent>
          
          <TabsContent value="tax">
            <TaxCalculator />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}