import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Image, Download, Upload } from 'lucide-react';

interface ConvertedImage {
  id: string;
  originalName: string;
  convertedName: string;
  originalFormat: string;
  targetFormat: string;
  originalUrl: string;
  convertedUrl: string;
  size: number;
}

export default function ImageConverter() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState<string>('');
  const [quality, setQuality] = useState<number>(90);
  const [converting, setConverting] = useState(false);
  const [convertedImages, setConvertedImages] = useState<ConvertedImage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supportedFormats = [
    { value: 'jpeg', label: 'JPEG' },
    { value: 'png', label: 'PNG' },
    { value: 'webp', label: 'WebP' },
    { value: 'gif', label: 'GIF' },
    { value: 'bmp', label: 'BMP' },
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
    } else {
      toast.error('يرجى اختيار ملف صورة صالح');
    }
  };

  const convertImage = async () => {
    if (!selectedFile || !targetFormat) {
      toast.error('يرجى اختيار الصورة والصيغة المطلوبة');
      return;
    }

    setConverting(true);

    try {
      // Create canvas for conversion
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);

        // Convert to target format
        const mimeType = `image/${targetFormat}`;
        const qualityValue = targetFormat === 'jpeg' ? quality / 100 : undefined;
        
        canvas.toBlob((blob) => {
          if (blob) {
            const convertedUrl = URL.createObjectURL(blob);
            const originalFormat = selectedFile.type.split('/')[1];
            const convertedName = selectedFile.name.replace(
              new RegExp(`\\.${originalFormat}$`, 'i'),
              `.${targetFormat}`
            );

            const convertedImage: ConvertedImage = {
              id: Date.now().toString(),
              originalName: selectedFile.name,
              convertedName,
              originalFormat,
              targetFormat,
              originalUrl: URL.createObjectURL(selectedFile),
              convertedUrl,
              size: blob.size
            };

            setConvertedImages(prev => [...prev, convertedImage]);
            toast.success('تم تحويل الصورة بنجاح');
          }
          setConverting(false);
        }, mimeType, qualityValue);
      };

      img.src = URL.createObjectURL(selectedFile);
    } catch (error) {
      toast.error('حدث خطأ أثناء تحويل الصورة');
      setConverting(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 بايت';
    const k = 1024;
    const sizes = ['بايت', 'كيلوبايت', 'ميجابايت'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            تحويل صيغة الصور
          </CardTitle>
          <CardDescription>
            حول صورك بين جميع الصيغ المدعومة مع إمكانية التحكم في الجودة
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="image-file">اختيار الصورة</Label>
            <div className="mt-2">
              <Input
                id="image-file"
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
              />
            </div>
          </div>

          {selectedFile && (
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-4">
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded"
                />
                <div>
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-gray-500">
                    {formatFileSize(selectedFile.size)} • {selectedFile.type}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="target-format">الصيغة المطلوبة</Label>
              <Select value={targetFormat} onValueChange={setTargetFormat}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الصيغة" />
                </SelectTrigger>
                <SelectContent>
                  {supportedFormats.map((format) => (
                    <SelectItem key={format.value} value={format.value}>
                      {format.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {targetFormat === 'jpeg' && (
              <div>
                <Label htmlFor="quality">الجودة ({quality}%)</Label>
                <Input
                  id="quality"
                  type="range"
                  min="10"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="mt-2"
                />
              </div>
            )}
          </div>

          <Button 
            onClick={convertImage} 
            disabled={!selectedFile || !targetFormat || converting}
            className="w-full"
          >
            {converting ? 'جاري التحويل...' : 'تحويل الصورة'}
          </Button>
        </CardContent>
      </Card>

      {convertedImages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>الصور المحولة ({convertedImages.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {convertedImages.map((image) => (
                <div key={image.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img
                        src={image.convertedUrl}
                        alt="Converted"
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium">{image.convertedName}</p>
                        <p className="text-sm text-gray-500">
                          {image.originalFormat.toUpperCase()} → {image.targetFormat.toUpperCase()}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatFileSize(image.size)}
                        </p>
                      </div>
                    </div>
                    <Button asChild>
                      <a href={image.convertedUrl} download={image.convertedName}>
                        <Download className="h-4 w-4 ml-2" />
                        تحميل
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}