
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Shield, Users, Lock, FileCheck, AlertTriangle, Cpu, Database, Globe } from 'lucide-react';

const SystemOverview = () => {
  const stats = [
    { label: 'Total Accounts', value: '100', icon: Users, color: 'text-blue-400' },
    { label: 'Compliance Rate', value: '100%', icon: Shield, color: 'text-green-400' },
    { label: 'Proofs Generated', value: '47', icon: FileCheck, color: 'text-purple-400' },
    { label: 'Privacy Level', value: 'Maximum', icon: Lock, color: 'text-yellow-400' },
  ];

  const techStack = [
    {
      name: 'Spartan Protocol',
      description: 'Microsoft\'s trustless zkSNARK system',
      status: 'Ready',
      icon: Cpu,
      color: 'bg-blue-500'
    },
    {
      name: 'Circom Circuits',
      description: 'Constraint verification for balance limits',
      status: 'Configured',
      icon: Database,
      color: 'bg-purple-500'
    },
    {
      name: 'Rust Backend',
      description: 'High-performance proof generation',
      status: 'Integration Ready',
      icon: Globe,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-200">{stat.label}</p>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* System Architecture */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Shield className="w-5 h-5 mr-2 text-yellow-400" />
            Zero-Knowledge Proof Architecture
          </CardTitle>
          <CardDescription className="text-blue-200">
            Our system ensures complete privacy while maintaining regulatory compliance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {techStack.map((tech, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-start space-x-3">
                  <div className={`${tech.color} p-2 rounded-lg`}>
                    <tech.icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold">{tech.name}</h3>
                    <p className="text-sm text-blue-200 mb-2">{tech.description}</p>
                    <Badge variant="outline" className="bg-green-500/20 text-green-300 border-green-400">
                      {tech.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Compliance Flow */}
          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <h3 className="text-white font-semibold mb-4">Compliance Verification Flow</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                <div className="flex-1">
                  <h4 className="text-white">Account Data Hashing</h4>
                  <p className="text-sm text-blue-200">Account balances are hashed using Poseidon for privacy</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                <div className="flex-1">
                  <h4 className="text-white">Circuit Constraint Verification</h4>
                  <p className="text-sm text-blue-200">Circom circuit ensures all balances are below $100,000</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                <div className="flex-1">
                  <h4 className="text-white">Spartan Proof Generation</h4>
                  <p className="text-sm text-blue-200">Zero-knowledge proof created without revealing individual balances</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white text-sm font-bold">4</div>
                <div className="flex-1">
                  <h4 className="text-white">Government Verification</h4>
                  <p className="text-sm text-blue-200">Proof can be independently verified without accessing raw data</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Regulatory Compliance */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-orange-400" />
            Regulatory Requirements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <div>
                <h4 className="text-green-300 font-semibold">Maximum Account Balance</h4>
                <p className="text-sm text-green-200">No user account may exceed $100,000</p>
              </div>
              <Badge className="bg-green-500 text-white">Compliant</Badge>
            </div>
            <div className="flex items-center justify-between p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <div>
                <h4 className="text-blue-300 font-semibold">Privacy Protection</h4>
                <p className="text-sm text-blue-200">Individual balances must remain confidential</p>
              </div>
              <Badge className="bg-blue-500 text-white">Protected</Badge>
            </div>
            <div className="flex items-center justify-between p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <div>
                <h4 className="text-purple-300 font-semibold">Auditability</h4>
                <p className="text-sm text-purple-200">Compliance must be independently verifiable</p>
              </div>
              <Badge className="bg-purple-500 text-white">Verifiable</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemOverview;
