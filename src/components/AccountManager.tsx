
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, Plus, Hash, DollarSign, Shield, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Account {
  id: string;
  balance: number;
  hashedBalance: string;
  salt: string;
  isCompliant: boolean;
}

const AccountManager = () => {
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [newBalance, setNewBalance] = useState('');
  const [loading, setLoading] = useState(false);

  // Generate mock accounts on component mount
  useEffect(() => {
    generateMockAccounts();
  }, []);

  const generateMockAccounts = () => {
    const mockAccounts: Account[] = [];
    for (let i = 1; i <= 100; i++) {
      const balance = Math.floor(Math.random() * 95000) + 1000; // $1,000 to $95,000
      const salt = Math.random().toString(36).substring(2, 15);
      const hashedBalance = `0x${Math.random().toString(16).substring(2, 18)}...`;
      
      mockAccounts.push({
        id: `ACC-${i.toString().padStart(3, '0')}`,
        balance,
        hashedBalance,
        salt,
        isCompliant: balance < 100000
      });
    }
    setAccounts(mockAccounts);
  };

  const addAccount = () => {
    if (!newBalance || isNaN(Number(newBalance))) {
      toast({
        title: "Invalid Balance",
        description: "Please enter a valid numeric balance.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const balance = Number(newBalance);
      const salt = Math.random().toString(36).substring(2, 15);
      const hashedBalance = `0x${Math.random().toString(16).substring(2, 18)}...`;
      
      const newAccount: Account = {
        id: `ACC-${(accounts.length + 1).toString().padStart(3, '0')}`,
        balance,
        hashedBalance,
        salt,
        isCompliant: balance < 100000
      };

      setAccounts([...accounts, newAccount]);
      setNewBalance('');
      setLoading(false);

      toast({
        title: "Account Added",
        description: `Account ${newAccount.id} has been added with hashed balance.`,
      });
    }, 1000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const complianceStats = {
    total: accounts.length,
    compliant: accounts.filter(acc => acc.isCompliant).length,
    nonCompliant: accounts.filter(acc => !acc.isCompliant).length
  };

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-200">Total Accounts</p>
                <p className="text-3xl font-bold text-white">{complianceStats.total}</p>
              </div>
              <Users className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-200">Compliant</p>
                <p className="text-3xl font-bold text-white">{complianceStats.compliant}</p>
              </div>
              <Shield className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-200">Non-Compliant</p>
                <p className="text-3xl font-bold text-white">{complianceStats.nonCompliant}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add New Account */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Add New Account
          </CardTitle>
          <CardDescription className="text-blue-200">
            Add a new account with automatic balance hashing using Poseidon
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Enter account balance (USD)"
              value={newBalance}
              onChange={(e) => setNewBalance(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              type="number"
            />
            <Button 
              onClick={addAccount} 
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? 'Hashing...' : 'Add Account'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Accounts Table */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Hash className="w-5 h-5 mr-2" />
            Account Registry
          </CardTitle>
          <CardDescription className="text-blue-200">
            All account balances are stored as hashed values for privacy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-white/20">
            <Table>
              <TableHeader>
                <TableRow className="border-white/20">
                  <TableHead className="text-blue-200">Account ID</TableHead>
                  <TableHead className="text-blue-200">Hashed Balance</TableHead>
                  <TableHead className="text-blue-200">Salt</TableHead>
                  <TableHead className="text-blue-200">Status</TableHead>
                  <TableHead className="text-blue-200">Actual Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts.slice(0, 10).map((account) => (
                  <TableRow key={account.id} className="border-white/20">
                    <TableCell className="text-white font-medium">{account.id}</TableCell>
                    <TableCell className="text-gray-300 font-mono text-sm">
                      {account.hashedBalance}
                    </TableCell>
                    <TableCell className="text-gray-400 font-mono text-sm">
                      {account.salt.substring(0, 8)}...
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={account.isCompliant ? "default" : "destructive"}
                        className={account.isCompliant ? "bg-green-500" : "bg-red-500"}
                      >
                        {account.isCompliant ? 'Compliant' : 'Non-Compliant'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-white">
                      {formatCurrency(account.balance)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {accounts.length > 10 && (
            <div className="mt-4 text-center text-blue-200">
              Showing 10 of {accounts.length} accounts
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountManager;
