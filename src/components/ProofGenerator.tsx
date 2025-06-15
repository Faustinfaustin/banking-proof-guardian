
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Shield, Play, Download, Clock, CheckCircle, Cpu, FileCode } from 'lucide-react';
import { useZKProof, type Account } from '@/hooks/useZKProof';
import { AccountType, getAccountTypeInfo } from '@/utils/accountTypes';

interface ProofGenerationStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  duration?: number;
}

const ProofGenerator = () => {
  const { generateProof, isGenerating } = useZKProof();
  const [progress, setProgress] = useState(0);
  const [generatedProof, setGeneratedProof] = useState('');
  const [proofMetadata, setProofMetadata] = useState<any>(null);
  const [steps, setSteps] = useState<ProofGenerationStep[]>([
    {
      id: 'hash',
      name: 'Balance Hashing',
      description: 'Hashing account balances using Poseidon',
      status: 'pending'
    },
    {
      id: 'circuit',
      name: 'Circuit Compilation',
      description: 'Compiling constraint circuit for balance verification',
      status: 'pending'
    },
    {
      id: 'witness',
      name: 'Witness Generation',
      description: 'Generating witness for constraint satisfaction',
      status: 'pending'
    },
    {
      id: 'spartan',
      name: 'ZK Proof Generation',
      description: 'Generating zero-knowledge proof using cryptographic protocol',
      status: 'pending'
    }
  ]);

  const generateRealProof = async () => {
    setProgress(0);
    setGeneratedProof('');
    setProofMetadata(null);

    // Reset all steps to pending
    setSteps(steps.map(step => ({ ...step, status: 'pending' as const })));

    // Simulate step progression
    for (let i = 0; i < steps.length; i++) {
      setSteps(prev => prev.map((step, index) => ({
        ...step,
        status: index === i ? 'running' : index < i ? 'completed' : 'pending'
      })));

      await new Promise(resolve => setTimeout(resolve, 500));
      setProgress(((i + 1) / steps.length) * 80); // 80% for steps, 20% for actual proof
    }

    // Generate mock accounts with different types for demonstration
    const accountTypes: AccountType[] = ['individual', 'association', 'large_condominium'];
    const mockAccounts: Account[] = Array.from({ length: 100 }, (_, i) => {
      const accountType = accountTypes[Math.floor(Math.random() * accountTypes.length)];
      const typeInfo = getAccountTypeInfo(accountType);
      
      // Mix of compliant and potentially non-compliant accounts
      const baseBalance = Math.floor(Math.random() * typeInfo.limit * 0.8) + 1000;
      const isViolation = Math.random() < 0.1; // 10% chance of violation
      const balance = isViolation ? typeInfo.limit + Math.floor(Math.random() * 10000) : baseBalance;
      
      return {
        balance,
        salt: Math.random().toString(36).substring(2, 15),
        accountType
      };
    });

    // Call the real edge function
    const result = await generateProof(mockAccounts);
    
    if (result) {
      setGeneratedProof(JSON.stringify({
        proof: result.proof,
        publicSignals: result.publicSignals,
        ...result.metadata
      }, null, 2));
      setProofMetadata(result.metadata);
      
      // Mark all steps as completed
      setSteps(prev => prev.map(step => ({ ...step, status: 'completed' })));
      setProgress(100);
    } else {
      // Mark current step as error
      setSteps(prev => prev.map((step, index) => ({
        ...step,
        status: index === steps.length - 1 ? 'error' : step.status
      })));
    }
  };

  const downloadProof = () => {
    const blob = new Blob([generatedProof], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zkp-compliance-proof-${new Date().getTime()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Clock className="w-4 h-4 text-blue-400 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'error':
        return <div className="w-4 h-4 rounded-full bg-red-400" />;
      default:
        return <div className="w-4 h-4 rounded-full border-2 border-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Generation Controls */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Shield className="w-5 h-5 mr-2 text-yellow-400" />
            Account Type-Specific Zero-Knowledge Proof Generation
          </CardTitle>
          <CardDescription className="text-blue-200">
            Generate cryptographic proofs with account type-specific compliance validation (Individual €22,950, Association €76,500, Large Condominium €100,000)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h3 className="text-white font-semibold">Ready to Generate Proof</h3>
              <p className="text-sm text-blue-200">
                This will create a real zero-knowledge proof for 100 mixed account types using Article R221-2 compliance rules
              </p>
            </div>
            <Button 
              onClick={generateRealProof} 
              disabled={isGenerating}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              {isGenerating ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Generate Real Proof
                </>
              )}
            </Button>
          </div>

          {isGenerating && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-200">Overall Progress</span>
                  <span className="text-white">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Generation Steps */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Cpu className="w-5 h-5 mr-2" />
            Cryptographic Pipeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex-shrink-0">
                  {getStepIcon(step.status)}
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-medium">{step.name}</h4>
                  <p className="text-sm text-blue-200">{step.description}</p>
                </div>
                <div className="flex-shrink-0">
                  <Badge 
                    variant="outline" 
                    className={
                      step.status === 'completed' ? 'bg-green-500/20 text-green-300 border-green-400' :
                      step.status === 'running' ? 'bg-blue-500/20 text-blue-300 border-blue-400' :
                      step.status === 'error' ? 'bg-red-500/20 text-red-300 border-red-400' :
                      'bg-gray-500/20 text-gray-300 border-gray-400'
                    }
                  >
                    {step.status === 'running' ? 'Processing' : 
                     step.status === 'completed' ? 'Complete' : 
                     step.status === 'error' ? 'Error' : 'Pending'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Generated Proof Display */}
      {generatedProof && (
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <div className="flex items-center">
                <FileCode className="w-5 h-5 mr-2" />
                Generated Account Type-Specific Proof
              </div>
              <Button 
                onClick={downloadProof}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </CardTitle>
            <CardDescription className="text-blue-200">
              Real zero-knowledge proof generated with account type-specific compliance validation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={generatedProof}
              readOnly
              className="bg-black/30 border-white/20 text-gray-300 font-mono text-sm min-h-[300px]"
            />
            {proofMetadata && (
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-blue-200">Protocol:</span>
                    <p className="text-white font-medium">{proofMetadata.protocol}</p>
                  </div>
                  <div>
                    <span className="text-blue-200">Accounts:</span>
                    <p className="text-white font-medium">{proofMetadata.accountsVerified} verified</p>
                  </div>
                  <div>
                    <span className="text-blue-200">Processing Time:</span>
                    <p className="text-white font-medium">{proofMetadata.processingTime}ms</p>
                  </div>
                  <div>
                    <span className="text-blue-200">Generated:</span>
                    <p className="text-white font-medium">{new Date(proofMetadata.timestamp).toLocaleTimeString()}</p>
                  </div>
                </div>
                
                {/* Account Type Distribution */}
                {proofMetadata.accountTypes && (
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h4 className="text-white font-semibold mb-3">Account Type Distribution</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {Object.entries(proofMetadata.accountTypes).map(([type, count]) => {
                        const typeInfo = getAccountTypeInfo(type as AccountType);
                        const limit = proofMetadata.accountTypeLimits?.[type];
                        return (
                          <div key={type} className="bg-white/5 rounded p-3">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-blue-300 text-sm">{typeInfo.label}</span>
                              <Badge variant="outline" className="text-xs">{count as number} accounts</Badge>
                            </div>
                            <p className="text-white text-xs">Limit: €{limit?.toLocaleString()}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProofGenerator;
