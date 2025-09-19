import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!email || !password) {
      toast.error('يرجى ملء جميع الحقول');
      return;
    }

    // Simulate login (in real app, this would be an API call)
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: User) => u.email === email && u.password === password);
    
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      toast.success('تم تسجيل الدخول بنجاح');
      navigate('/dashboard');
    } else {
      toast.error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4" dir="rtl">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">تسجيل الدخول</CardTitle>
          <CardDescription>
            أدخل بياناتك للوصول إلى حسابك
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              تسجيل الدخول
            </Button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              ليس لديك حساب؟{' '}
              <Link to="/register" className="text-blue-600 hover:underline">
                إنشاء حساب جديد
              </Link>
            </p>
            <Link to="/" className="text-sm text-gray-600 hover:underline block mt-2">
              العودة للصفحة الرئيسية
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}