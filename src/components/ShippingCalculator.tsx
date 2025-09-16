import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Calculator, Package, DollarSign } from 'lucide-react';

interface ShippingResult {
  itemValue: number;
  shippingCost: number;
  customsDuty: number;
  vat: number;
  totalCost: number;
  currency: string;
}

export default function ShippingCalculator() {
  const [itemValue, setItemValue] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [currency, setCurrency] = useState<string>('USD');
  const [shippingMethod, setShippingMethod] = useState<string>('standard');
  const [result, setResult] = useState<ShippingResult | null>(null);

  const currencies = [
    { code: 'USD', name: 'دولار أمريكي', rate: 1, symbol: '$' },
    { code: 'EUR', name: 'يورو', rate: 0.85, symbol: '€' },
    { code: 'GBP', name: 'جنيه إسترليني', rate: 0.73, symbol: '£' },
    { code: 'SAR', name: 'ريال سعودي', rate: 3.75, symbol: 'ر.س' },
    { code: 'AED', name: 'درهم إماراتي', rate: 3.67, symbol: 'د.إ' },
    { code: 'JPY', name: 'ين ياباني', rate: 110, symbol: '¥' },
  ];

  const shippingMethods = [
    { value: 'standard', label: 'شحن عادي (7-14 يوم)', rate: 0.15 },
    { value: 'express', label: 'شحن سريع (3-7 أيام)', rate: 0.25 },
    { value: 'overnight', label: 'شحن فوري (1-2 يوم)', rate: 0.40 },
  ];

  const calculateShipping = () => {
    if (!itemValue || !weight) {
      return;
    }

    const value = parseFloat(itemValue);
    const weightNum = parseFloat(weight);
    const selectedCurrency = currencies.find(c => c.code === currency)!;
    const selectedMethod = shippingMethods.find(m => m.value === shippingMethod)!;

    // Convert to USD for calculation
    const valueInUSD = value / selectedCurrency.rate;

    // Calculate shipping cost based on weight and method
    const baseShippingCost = Math.max(weightNum * 5, 10) * selectedMethod.rate;
    const shippingCost = baseShippingCost * selectedCurrency.rate;

    // Saudi customs duty (5% for most items)
    const customsDutyRate = 0.05;
    const customsDuty = valueInUSD > 200 ? (valueInUSD * customsDutyRate * selectedCurrency.rate) : 0;

    // Saudi VAT (15%)
    const vatRate = 0.15;
    const vat = (value + shippingCost + customsDuty) * vatRate;

    const totalCost = value + shippingCost + customsDuty + vat;

    setResult({
      itemValue: value,
      shippingCost,
      customsDuty,
      vat,
      totalCost,
      currency: currency
    });
  };

  const formatCurrency = (amount: number, currencyCode: string) => {
    const curr = currencies.find(c => c.code === currencyCode);
    return `${amount.toFixed(2)} ${curr?.symbol || currencyCode}`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            حاسبة الشحن الدولي
          </CardTitle>
          <CardDescription>
            احسب التكلفة الإجمالية للشحن مع الضرائب السعودية (الجمارك وضريبة القيمة المضافة)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="item-value">قيمة السلعة</Label>
              <Input
                id="item-value"
                type="number"
                placeholder="0.00"
                value={itemValue}
                onChange={(e) => setItemValue(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="currency">العملة</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((curr) => (
                    <SelectItem key={curr.code} value={curr.code}>
                      {curr.name} ({curr.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="weight">الوزن (كيلوجرام)</Label>
              <Input
                id="weight"
                type="number"
                placeholder="0.0"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="shipping-method">طريقة الشحن</Label>
              <Select value={shippingMethod} onValueChange={setShippingMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {shippingMethods.map((method) => (
                    <SelectItem key={method.value} value={method.value}>
                      {method.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={calculateShipping} className="w-full">
            <Calculator className="h-4 w-4 ml-2" />
            احسب التكلفة الإجمالية
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              تفاصيل التكلفة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>قيمة السلعة:</span>
                <span className="font-medium">{formatCurrency(result.itemValue, result.currency)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span>تكلفة الشحن:</span>
                <span className="font-medium">{formatCurrency(result.shippingCost, result.currency)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span>رسوم الجمارك (5%):</span>
                <span className="font-medium">{formatCurrency(result.customsDuty, result.currency)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span>ضريبة القيمة المضافة (15%):</span>
                <span className="font-medium">{formatCurrency(result.vat, result.currency)}</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-center text-lg font-bold">
                <span>التكلفة الإجمالية:</span>
                <span className="text-green-600">{formatCurrency(result.totalCost, result.currency)}</span>
              </div>
            </div>

            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">ملاحظات مهمة:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• رسوم الجمارك تُطبق على السلع التي تزيد قيمتها عن 200 دولار</li>
                <li>• ضريبة القيمة المضافة 15% تُطبق على المجموع الكلي</li>
                <li>• قد تختلف الرسوم حسب نوع السلعة وبلد المنشأ</li>
                <li>• هذه حاسبة تقديرية وقد تختلف الرسوم الفعلية</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}