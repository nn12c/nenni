import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Receipt, Calculator, DollarSign } from 'lucide-react';

interface TaxResult {
  originalAmount: number;
  taxAmount: number;
  totalWithTax: number;
  taxRate: number;
}

interface ExtractResult {
  totalAmount: number;
  taxAmount: number;
  amountWithoutTax: number;
  taxRate: number;
}

export default function TaxCalculator() {
  // Calculate Tax
  const [amount, setAmount] = useState<string>('');
  const [taxRate, setTaxRate] = useState<string>('15');
  const [calculateResult, setCalculateResult] = useState<TaxResult | null>(null);

  // Extract Tax
  const [totalAmount, setTotalAmount] = useState<string>('');
  const [extractTaxRate, setExtractTaxRate] = useState<string>('15');
  const [extractResult, setExtractResult] = useState<ExtractResult | null>(null);

  const taxRates = [
    { value: '5', label: '5% - ضريبة مخفضة' },
    { value: '15', label: '15% - ضريبة القيمة المضافة السعودية' },
    { value: '20', label: '20% - ضريبة أوروبية' },
    { value: '10', label: '10% - ضريبة خدمات' },
    { value: 'custom', label: 'معدل مخصص' },
  ];

  const calculateTax = () => {
    if (!amount || !taxRate) return;

    const originalAmount = parseFloat(amount);
    const rate = parseFloat(taxRate) / 100;
    const taxAmount = originalAmount * rate;
    const totalWithTax = originalAmount + taxAmount;

    setCalculateResult({
      originalAmount,
      taxAmount,
      totalWithTax,
      taxRate: parseFloat(taxRate)
    });
  };

  const extractTax = () => {
    if (!totalAmount || !extractTaxRate) return;

    const total = parseFloat(totalAmount);
    const rate = parseFloat(extractTaxRate) / 100;
    const amountWithoutTax = total / (1 + rate);
    const taxAmount = total - amountWithoutTax;

    setExtractResult({
      totalAmount: total,
      taxAmount,
      amountWithoutTax,
      taxRate: parseFloat(extractTaxRate)
    });
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toFixed(2)} ر.س`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            حاسبة الضريبة
          </CardTitle>
          <CardDescription>
            احسب الضريبة أو استخرجها من المبلغ الإجمالي
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="calculate" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="calculate">حساب الضريبة</TabsTrigger>
              <TabsTrigger value="extract">استخراج الضريبة</TabsTrigger>
            </TabsList>

            <TabsContent value="calculate" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="amount">المبلغ الأساسي (بدون ضريبة)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="tax-rate">معدل الضريبة</Label>
                  <Select value={taxRate} onValueChange={setTaxRate}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {taxRates.map((rate) => (
                        <SelectItem key={rate.value} value={rate.value}>
                          {rate.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {taxRate === 'custom' && (
                  <div>
                    <Label htmlFor="custom-rate">معدل مخصص (%)</Label>
                    <Input
                      id="custom-rate"
                      type="number"
                      placeholder="0"
                      onChange={(e) => setTaxRate(e.target.value)}
                    />
                  </div>
                )}

                <Button onClick={calculateTax} className="w-full">
                  <Calculator className="h-4 w-4 ml-2" />
                  احسب الضريبة
                </Button>

                {calculateResult && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">نتيجة الحساب</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>المبلغ الأساسي:</span>
                          <span className="font-medium">{formatCurrency(calculateResult.originalAmount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>الضريبة ({calculateResult.taxRate}%):</span>
                          <span className="font-medium text-red-600">+ {formatCurrency(calculateResult.taxAmount)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-lg font-bold">
                          <span>المجموع مع الضريبة:</span>
                          <span className="text-green-600">{formatCurrency(calculateResult.totalWithTax)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="extract" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="total-amount">المبلغ الإجمالي (مع الضريبة)</Label>
                  <Input
                    id="total-amount"
                    type="number"
                    placeholder="0.00"
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="extract-tax-rate">معدل الضريبة</Label>
                  <Select value={extractTaxRate} onValueChange={setExtractTaxRate}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {taxRates.map((rate) => (
                        <SelectItem key={rate.value} value={rate.value}>
                          {rate.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {extractTaxRate === 'custom' && (
                  <div>
                    <Label htmlFor="custom-extract-rate">معدل مخصص (%)</Label>
                    <Input
                      id="custom-extract-rate"
                      type="number"
                      placeholder="0"
                      onChange={(e) => setExtractTaxRate(e.target.value)}
                    />
                  </div>
                )}

                <Button onClick={extractTax} className="w-full">
                  <Receipt className="h-4 w-4 ml-2" />
                  استخرج الضريبة
                </Button>

                {extractResult && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">نتيجة الاستخراج</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>المبلغ الإجمالي:</span>
                          <span className="font-medium">{formatCurrency(extractResult.totalAmount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>الضريبة ({extractResult.taxRate}%):</span>
                          <span className="font-medium text-red-600">- {formatCurrency(extractResult.taxAmount)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-lg font-bold">
                          <span>المبلغ بدون ضريبة:</span>
                          <span className="text-green-600">{formatCurrency(extractResult.amountWithoutTax)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            معلومات الضرائب في السعودية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">ضريبة القيمة المضافة (VAT)</h4>
              <ul className="text-sm space-y-2 text-gray-600">
                <li>• المعدل الأساسي: 15%</li>
                <li>• يطبق على معظم السلع والخدمات</li>
                <li>• بعض السلع معفاة (التعليم، الصحة)</li>
                <li>• معدل 0% للصادرات</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3">ضريبة الدخل</h4>
              <ul className="text-sm space-y-2 text-gray-600">
                <li>• 20% على الشركات الأجنبية</li>
                <li>• 2.5% زكاة للشركات السعودية</li>
                <li>• معدلات متدرجة للأفراد</li>
                <li>• إعفاءات للاستثمارات المؤهلة</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}