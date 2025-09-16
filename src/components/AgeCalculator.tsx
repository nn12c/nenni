import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock } from 'lucide-react';

interface AgeResult {
  gregorianAge: {
    years: number;
    months: number;
    days: number;
    totalDays: number;
    totalHours: number;
    totalMinutes: number;
  };
  hijriAge: {
    years: number;
    months: number;
    days: number;
    totalDays: number;
  };
}

interface HijriDate {
  year: number;
  month: number;
  day: number;
}

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState<string>('');
  const [birthType, setBirthType] = useState<string>('gregorian');
  const [result, setResult] = useState<AgeResult | null>(null);

  // Hijri months
  const hijriMonths = [
    'محرم', 'صفر', 'ربيع الأول', 'ربيع الآخر', 'جمادى الأولى', 'جمادى الآخرة',
    'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
  ];

  // Simple Hijri to Gregorian conversion (approximate)
  const hijriToGregorian = (hijriYear: number, hijriMonth: number, hijriDay: number) => {
    // This is a simplified conversion. In a real app, you'd use a proper library
    const hijriEpoch = new Date(622, 6, 16); // July 16, 622 CE
    const avgHijriYear = 354.367; // Average Hijri year in days
    const daysFromEpoch = (hijriYear - 1) * avgHijriYear + (hijriMonth - 1) * 29.5 + hijriDay;
    return new Date(hijriEpoch.getTime() + daysFromEpoch * 24 * 60 * 60 * 1000);
  };

  // Simple Gregorian to Hijri conversion (approximate)
  const gregorianToHijri = (gregorianDate: Date): HijriDate => {
    const hijriEpoch = new Date(622, 6, 16);
    const daysDiff = Math.floor((gregorianDate.getTime() - hijriEpoch.getTime()) / (24 * 60 * 60 * 1000));
    const hijriYear = Math.floor(daysDiff / 354.367) + 1;
    const remainingDays = daysDiff % 354.367;
    const hijriMonth = Math.floor(remainingDays / 29.5) + 1;
    const hijriDay = Math.floor(remainingDays % 29.5) + 1;
    return { year: hijriYear, month: hijriMonth, day: hijriDay };
  };

  const calculateAge = () => {
    if (!birthDate) return;

    const today = new Date();
    let birthDateObj: Date;

    if (birthType === 'gregorian') {
      birthDateObj = new Date(birthDate);
    } else {
      // Parse Hijri date (assuming format: YYYY-MM-DD)
      const [year, month, day] = birthDate.split('-').map(Number);
      birthDateObj = hijriToGregorian(year, month, day);
    }

    // Calculate Gregorian age
    const gregorianAge = calculateGregorianAge(birthDateObj, today);
    
    // Calculate Hijri age
    const birthHijri = gregorianToHijri(birthDateObj);
    const todayHijri = gregorianToHijri(today);
    const hijriAge = calculateHijriAge(birthHijri, todayHijri);

    setResult({
      gregorianAge,
      hijriAge
    });
  };

  const calculateGregorianAge = (birth: Date, current: Date) => {
    let years = current.getFullYear() - birth.getFullYear();
    let months = current.getMonth() - birth.getMonth();
    let days = current.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(current.getFullYear(), current.getMonth(), 0);
      days += lastMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    const totalDays = Math.floor((current.getTime() - birth.getTime()) / (24 * 60 * 60 * 1000));
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;

    return {
      years,
      months,
      days,
      totalDays,
      totalHours,
      totalMinutes
    };
  };

  const calculateHijriAge = (birth: HijriDate, current: HijriDate) => {
    let years = current.year - birth.year;
    let months = current.month - birth.month;
    let days = current.day - birth.day;

    if (days < 0) {
      months--;
      days += 29; // Average Hijri month
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    const totalDays = Math.floor(years * 354.367 + months * 29.5 + days);

    return {
      years,
      months,
      days,
      totalDays
    };
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            حاسبة العمر
          </CardTitle>
          <CardDescription>
            احسب عمرك بالتقويم الهجري والميلادي مع تفاصيل دقيقة
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="birth-type">نوع التاريخ</Label>
            <Select value={birthType} onValueChange={setBirthType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gregorian">ميلادي</SelectItem>
                <SelectItem value="hijri">هجري</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="birth-date">
              تاريخ الميلاد ({birthType === 'gregorian' ? 'ميلادي' : 'هجري'})
            </Label>
            <Input
              id="birth-date"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />
          </div>

          <Button onClick={calculateAge} className="w-full" disabled={!birthDate}>
            <Calendar className="h-4 w-4 ml-2" />
            احسب العمر
          </Button>
        </CardContent>
      </Card>

      {result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gregorian Age */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                العمر بالتقويم الميلادي
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {result.gregorianAge.years} سنة
                  </div>
                  <div className="text-lg text-gray-600">
                    {result.gregorianAge.months} شهر و {result.gregorianAge.days} يوم
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>إجمالي الأيام:</span>
                    <span className="font-medium">{result.gregorianAge.totalDays.toLocaleString()} يوم</span>
                  </div>
                  <div className="flex justify-between">
                    <span>إجمالي الساعات:</span>
                    <span className="font-medium">{result.gregorianAge.totalHours.toLocaleString()} ساعة</span>
                  </div>
                  <div className="flex justify-between">
                    <span>إجمالي الدقائق:</span>
                    <span className="font-medium">{result.gregorianAge.totalMinutes.toLocaleString()} دقيقة</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hijri Age */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-600" />
                العمر بالتقويم الهجري
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {result.hijriAge.years} سنة
                  </div>
                  <div className="text-lg text-gray-600">
                    {result.hijriAge.months} شهر و {result.hijriAge.days} يوم
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>إجمالي الأيام:</span>
                    <span className="font-medium">{result.hijriAge.totalDays.toLocaleString()} يوم</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              معلومات إضافية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-medium">حقائق مثيرة:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• عشت {Math.floor(result.gregorianAge.totalDays / 365.25)} سنة كاملة</li>
                  <li>• مر عليك {Math.floor(result.gregorianAge.totalDays / 7)} أسبوع</li>
                  <li>• عشت {Math.floor(result.gregorianAge.totalHours / 24 / 30.44)} شهر تقريباً</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">الفرق بين التقويمين:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• السنة الهجرية أقصر بـ 10-11 يوم</li>
                  <li>• التقويم الهجري قمري</li>
                  <li>• التقويم الميلادي شمسي</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}