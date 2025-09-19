import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { FileText, Download, Upload } from 'lucide-react';

interface ConversionOption {
  from: string[];
  to: string[];
  label: string;
}

export default function FileConverter() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState<string>('');
  const [converting, setConverting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const conversionOptions: ConversionOption[] = [
    {
      from: ['txt', 'rtf'],
      to: ['pdf', 'docx', 'html'],
      label: 'تحويل النصوص'
    },
    {
      from: ['csv', 'xlsx', 'xls'],
      to: ['json', 'xml', 'pdf'],
      label: 'تحويل جداول البيانات'
    },
    {
      from: ['docx', 'doc'],
      to: ['pdf', 'txt', 'html'],
      label: 'تحويل المستندات'
    },
    {
      from: ['json', 'xml'],
      to: ['csv', 'xlsx', 'txt'],
      label: 'تحويل البيانات'
    }
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setTargetFormat('');
    }
  };

  const getAvailableFormats = () => {
    if (!selectedFile) return [];
    
    const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase() || '';
    
    for (const option of conversionOptions) {
      if (option.from.includes(fileExtension)) {
        return option.to.map(format => ({
          value: format,
          label: format.toUpperCase()
        }));
      }
    }
    
    return [];
  };

  const convertFile = async () => {
    if (!selectedFile || !targetFormat) {
      toast.error('يرجى اختيار الملف والصيغة المطلوبة');
      return;
    }

    setConverting(true);

    // Simulate conversion process
    setTimeout(() => {
      // In a real application, this would involve actual file conversion
      // For demo purposes, we'll create a simple converted file
      const originalName = selectedFile.name;
      const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.'));
      const convertedName = `${nameWithoutExt}.${targetFormat}`;
      
      // Create a simple text file as demonstration
      const convertedContent = `تم تحويل الملف من ${originalName} إلى ${targetFormat}\nالوقت: ${new Date().toLocaleString('ar-SA')}`;
      const blob = new Blob([convertedContent], { type: 'text/plain' });
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
    }, 2000);
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
            <FileText className="h-5 w-5" />
            تحويل صيغة الملفات
          </CardTitle>
          <CardDescription>
            حول ملفاتك بين الصيغ المختلفة مثل PDF، Word، Excel، وغيرها
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="file-input">اختيار الملف</Label>
            <div className="mt-2">
              <Input
                id="file-input"
                ref={fileInputRef}
                type="file"
                accept=".txt,.rtf,.csv,.xlsx,.xls,.docx,.doc,.json,.xml"
                onChange={handleFileSelect}
              />
            </div>
          </div>

          {selectedFile && (
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-4">
                <FileText className="h-12 w-12 text-blue-500" />
                <div>
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-gray-500">
                    {formatFileSize(selectedFile.size)} • {selectedFile.type || 'ملف'}
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

          <Button 
            onClick={convertFile} 
            disabled={!selectedFile || !targetFormat || converting}
            className="w-full"
          >
            {converting ? 'جاري التحويل...' : 'تحويل الملف'}
          </Button>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">الصيغ المدعومة:</h4>
            <div className="space-y-2 text-sm">
              {conversionOptions.map((option, index) => (
                <div key={index}>
                  <span className="font-medium">{option.label}:</span>
                  <span className="text-gray-600 mr-2">
                    {option.from.join(', ')} → {option.to.join(', ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}