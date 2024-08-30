import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const HomeLoanEMICalculator = () => {
  const [loanAmount, setLoanAmount] = useState(1000000);
  const [loanAmountFormatted, setLoanAmountFormatted] = useState('');
  const [loanTenure, setLoanTenure] = useState(20);
  const [interestRate, setInterestRate] = useState(8);
  const [monthlyEMI, setMonthlyEMI] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [amortizationSchedule, setAmortizationSchedule] = useState([]);

  useEffect(() => {
    formatLoanAmount(loanAmount);
  }, [loanAmount]);

  const formatLoanAmount = (amount: number) => {
    if (amount >= 10000000) {
      const crores = (amount / 10000000).toFixed(2);
      setLoanAmountFormatted(`${crores} Cr`);
    } else if (amount >= 100000) {
      const lakhs = (amount / 100000).toFixed(2);
      setLoanAmountFormatted(`${lakhs} L`);
    } else {
      setLoanAmountFormatted(`${amount.toLocaleString('en-IN')} ₹`);
    }
  };

  const handleLoanAmountChange = (value: number) => {
    setLoanAmount(value);
    formatLoanAmount(value);
  };

  const calculateEMI = () => {
    const principal = loanAmount;
    const ratePerMonth = interestRate / (12 * 100);
    const totalMonths = loanTenure * 12;

    const emi = (principal * ratePerMonth * Math.pow(1 + ratePerMonth, totalMonths)) /
                (Math.pow(1 + ratePerMonth, totalMonths) - 1);

    setMonthlyEMI(Number(emi.toFixed(2)));

    let remainingBalance = principal;
    let totalInterest = 0;
    const schedule = [];

    for (let month = 1; month <= totalMonths; month++) {
      const interestPayment = remainingBalance * ratePerMonth;
      const principalPayment = emi - interestPayment;
      remainingBalance -= principalPayment;
      totalInterest += interestPayment;

      schedule.push({
        month,
        emi: emi.toFixed(2),
        principal: principalPayment.toFixed(2),
        interest: interestPayment.toFixed(2),
        balance: remainingBalance > 0 ? remainingBalance.toFixed(2) : 0,
      });
    }

    setAmortizationSchedule(schedule as any);
    setTotalInterest(Number(totalInterest.toFixed(2)));
    setTotalPayment(Number((totalInterest + principal).toFixed(2)));
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Home Loan EMI Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="loanAmount">Loan Amount</Label>
              <div className="relative mt-1">
                <Input
                  id="loanAmount"
                  type="number"
                  value={loanAmount}
                  onChange={(e) => handleLoanAmountChange(Number(e.target.value))}
                  className="pr-20"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-sm text-gray-500">
                  {loanAmountFormatted}
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="loanTenure">Loan Tenure (Years)</Label>
              <Select onValueChange={(value) => setLoanTenure(Number(value))}>
                <SelectTrigger id="loanTenure" className="mt-1">
                  <SelectValue placeholder={loanTenure} />
                </SelectTrigger>
                <SelectContent>
                  {[5, 10, 15, 20, 25, 30].map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="interestRate">Interest Rate (%)</Label>
              <Input
                id="interestRate"
                type="number"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="mt-1"
              />
            </div>
          </div>
          <Button
            onClick={calculateEMI}
            className="w-full bg-blue-500 text-white hover:bg-blue-600"
          >
            Calculate EMI
          </Button>
          {monthlyEMI > 0 && (
            <div className="mt-4 text-center">
              <h3 className="text-lg font-semibold">Monthly EMI:</h3>
              <p className="text-2xl font-bold">₹{Number(monthlyEMI).toLocaleString('en-IN')}</p>
              <Button
                onClick={toggleDetails}
                variant="outline"
                className="mt-2"
              >
                {showDetails ? 'Hide Details' : 'Show Details'}
              </Button>
              {showDetails && (
                <div className="mt-4 text-left">
                  <p><strong>Principal Amount:</strong> ₹{Number(loanAmount).toLocaleString('en-IN')}</p>
                  <p><strong>Total Interest:</strong> ₹{Number(totalInterest).toLocaleString('en-IN')}</p>
                  <p><strong>Total Payment:</strong> ₹{Number(totalPayment).toLocaleString('en-IN')}</p>
                  <p><strong>Interest to Principal Ratio:</strong> {(totalInterest / loanAmount * 100).toFixed(2)}%</p>
                  
                  <h4 className="text-lg font-semibold mt-4 mb-2">Amortization Schedule</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EMI</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Principal</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interest</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {amortizationSchedule.map((row: any) => (
                          <tr key={row.month}>
                            <td className="px-6 py-4 whitespace-nowrap">{row.month}</td>
                            <td className="px-6 py-4 whitespace-nowrap">₹{Number(row.emi).toLocaleString('en-IN')}</td>
                            <td className="px-6 py-4 whitespace-nowrap">₹{Number(row.principal).toLocaleString('en-IN')}</td>
                            <td className="px-6 py-4 whitespace-nowrap">₹{Number(row.interest).toLocaleString('en-IN')}</td>
                            <td className="px-6 py-4 whitespace-nowrap">₹{Number(row.balance).toLocaleString('en-IN')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HomeLoanEMICalculator;