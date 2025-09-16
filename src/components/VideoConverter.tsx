import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Video, Download, Upload } from 'lucide-react';

interface ConversionSettings {
  quality: string;
  resolution: string;
  fps: string;
}

export default function VideoConverter() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState<string>('');
  const [settings, setSettings] = useState<ConversionSettings>({
    quality: 'high',
    resolution: 'original',
    fps: 'original'
  });
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const videoFormats = [
    { value: 'mp4', label: 'MP4' },
    { value: 'avi', label: 'AVI' },
    { value: 'mov', label: 'MOV' },
    { value: 'wmv', label: 'WMV' },
    { value: 'mkv', label: 'MKV' },
    { value: 'webm', label: 'WebM' },
  ];

  const audioFormats = [
    { value: 'mp3', label: 'MP3' },
    { value: 'wav', label: 'WAV' },
    { value: 'aac', label: 'AAC' },
    { value: 'flac', label: 'FLAC' },
    { value: 'ogg', label: 'OGG' },
  ];

  const qualityOptions = [
    { value: 'low', label: 'منخفضة (سريع)' },
    { value: 'medium', label: 'متوسطة' },
    { value: 'high', label: 'عالية' },
    { value: 'ultra', label: 'فائقة الجودة (بطيء)' },
  ];

  const resolutionOptions = [
    { value: 'original', label: 'الدقة الأصلية' },
    { value: '480p', label: '480p' },
    { value: '720p', label: '720p (HD)' },
    { value: '1080p', label: '1080p (Full HD)' },
    { value: '1440p', label: '1440p (2K)' },
    { value: '2160p', label: '2160p (4K)' },
  ];

  const fpsOptions = [
    { value: 'original', label: 'الإطارات الأصلية' },
    { value: '24', label: '24 إطار/ثانية' },
    { value: '30', label: '30 إطار/ثانية' },
    { value: '60', label: '60 إطار/ثانية' },
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type.startsWith('video/') || file.type.startsWith('audio/'))) {
      setSelectedFile(file);
      setTargetFormat('');
    } else {
      toast.error('يرجى اختيار ملف فيديو أو صوت صالح');
    }
  };

  const getAvailableFormats = () => {
    if (!selectedFile) return [];
    
    if (selectedFile.type.startsWith('video/')) {
      return [...videoFormats, ...audioFormats];
    } else if (selectedFile.type.startsWith('audio/')) {
      return audioFormats;
    }
    
    return [];
  };

  const convertVideo = async () => {
    if (!selectedFile || !targetFormat) {
      toast.error('يرجى اختيار الملف والصيغة المطلوبة');
      return;
    }

    setConverting(true);
    setProgress(0);

    // Simulate conversion progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          
          // Create a demo converted file
          const originalName = selectedFile.name;
          const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.'));
          const convertedName = `${nameWithoutExt}_converted.${targetFormat}`;
          
          // In a real app, this would be the actual converted file
          const demoContent = `تم تحويل الملف من ${originalName} إلى ${targetFormat}\nالإعدادات: جودة ${settings.quality}, دقة ${settings.resolution}, إطارات ${settings.fps}\nالوقت: ${new Date().toLocaleString('ar-SA')}`;
          const blob = new Blob([demoContent], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          
          // Create download link
          const a = document.createElement('a');
          a.href = url;
          a.download = convertedName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          
          toast.success('تم تحويل الملف بنجاح');
          setConverting(false);
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 بايت';
    const k = 1024;
    const sizes = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isAudioTarget = audioFormats.some(format => format.value === targetFormat);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            تحويل صيغة المقاطع
          </CardTitle>
          <CardDescription>
            حول مقاطع الفيديو والصوت بين جميع الصيغ المدعومة مع إعدادات متقدمة
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="video-file">اختيار الملف</Label>
            <div className="mt-2">
              <Input
                id="video-file"
                ref={fileInputRef}
                type="file"
                accept="video/*,audio/*"
                onChange={handleFileSelect}
              />
            </div>
          </div>

          {selectedFile && (
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-4">
                <Video className="h-12 w-12 text-purple-500" />
                <div>
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-gray-500">
                    {formatFileSize(selectedFile.size)} • {selectedFile.type}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="target-format">الصيغة المطلوبة</Label>
            <Select value={targetFormat} onValueChange={setTargetFormat} disabled={!selectedFile}>
              <SelectTrigger>
                <SelectValue placeholder="اختر الصيغة المطلوبة" />
              </SelectTrigger>
              <SelectContent>
                {getAvailableFormats().map((format) => (
                  <SelectItem key={format.value} value={format.value}>
                    {format.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {targetFormat && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="quality">الجودة</Label>
                <Select value={settings.quality} onValueChange={(value) => setSettings(prev => ({ ...prev, quality: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {qualityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {!isAudioTarget && (
                <>
                  <div>
                    <Label htmlFor="resolution">الدقة</Label>
                    <Select value={settings.resolution} onValueChange={(value) => setSettings(prev => ({ ...prev, resolution: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {resolutionOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="fps">معدل الإطارات</Label>
                    <Select value={settings.fps} onValueChange={(value) => setSettings(prev => ({ ...prev, fps: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fpsOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </div>
          )}

          {converting && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>جاري التحويل...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
          )}

          <Button 
            onClick={convertVideo} 
            disabled={!selectedFile || !targetFormat || converting}
            className="w-full"
          >
            {converting ? 'جاري التحويل...' : 'تحويل الملف'}
          </Button>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-medium text-purple-900 mb-2">ملاحظات مهمة:</h4>
            <ul className="text-sm text-purple-800 space-y-1">
              <li>• الجودة العالية تتطلب وقتاً أطول للتحويل</li>
              <li>• تحويل الفيديو إلى صوت سيستخرج المسار الصوتي فقط</li>
              <li>• الدقة الأعلى تنتج ملفات أكبر حجماً</li>
              <li>• يُنصح بالجودة المتوسطة للاستخدام العام</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}