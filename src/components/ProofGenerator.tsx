
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Shield, Play, Download, Clock, CheckCircle, Cpu, FileCode } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProofGenerationStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  duration?: number;
}

const ProofGenerator = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedProof, setGeneratedProof] = useState('');
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
      description: 'Compiling Circom constraint circuit',
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
      name: 'Spartan Proof',
      description: 'Generating zero-knowledge proof using Spartan protocol',
      status: 'pending'
    }
  ]);

  const generateProof = async () => {
    setIsGenerating(true);
    setProgress(0);
    setGeneratedProof('');

    // Reset all steps to pending
    setSteps(steps.map(step => ({ ...step, status: 'pending' as const })));

    for (let i = 0; i < steps.length; i++) {
      // Mark current step as running
      setSteps(prev => prev.map((step, index) => ({
        ...step,
        status: index === i ? 'running' : index < i ? 'completed' : 'pending'
      })));

      // Simulate processing time
      const duration = Math.random() * 2000 + 1000; // 1-3 seconds
      await new Promise(resolve => setTimeout(resolve, duration));

      // Update progress
      setProgress(((i + 1) / steps.length) * 100);

      // Mark step as completed
      setSteps(prev => prev.map((step, index) => ({
        ...step,
        status: index <= i ? 'completed' : 'pending',
        duration: index === i ? duration : step.duration
      })));
    }

    // Generate mock proof
    const mockProof = {
      proof: "0x" + Array(128).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
      publicSignals: ["1"], // 1 means all accounts are compliant
      protocol: "spartan",
      timestamp: new Date().toISOString(),
      accountsVerified: 100,
      maxBalance: 100000
    };

    setGeneratedProof(JSON.stringify(mockProof, null, 2));
    setIsGenerating(false);

    toast({
      title: "Proof Generated Successfully",
      description: "Zero-knowledge proof has been generated and is ready for verification.",
    });
  };

  const downloadProof = () => {
    const blob = new Blob([generatedProof], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zkp-compliance-proof-${new Date().getTime()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Proof Downloaded",
      description: "Zero-knowledge proof file has been downloaded.",
    });
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Clock className="w-4 h-4 text-blue-400 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
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
            Zero-Knowledge Proof Generation
          </CardTitle>
          <CardDescription className="text-blue-200">
            Generate a cryptographic proof that all accounts are below the $100,000 limit without revealing individual balances
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h3 className="text-white font-semibold">Ready to Generate Proof</h3>
              <p className="text-sm text-blue-200">
                This will create a zero-knowledge proof using the Spartan protocol for all 100 accounts
              </p>
            </div>
            <Button 
              onClick={generateProof} 
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
                  Generate Proof
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
            Generation Pipeline
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
                      'bg-gray-500/20 text-gray-300 border-gray-400'
                    }
                  >
                    {step.status === 'running' ? 'Processing' : 
                     step.status === 'completed' ? 'Complete' : 'Pending'}
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
                Generated Proof
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
              Zero-knowledge proof ready for verification by regulatory authorities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={generatedProof}
              readOnly
              className="bg-black/30 border-white/20 text-gray-300 font-mono text-sm min-h-[300px]"
            />
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-blue-200">Protocol:</span>
                <p className="text-white font-medium">Spartan zkSNARK</p>
              </div>
              <div>
                <span className="text-blue-200">Accounts:</span>
                <p className="text-white font-medium">100 verified</p>
              </div>
              <div>
                <span className="text-blue-200">Compliance:</span>
                <p className="text-green-400 font-medium">✓ All compliant</p>
              </div>
              <div>
                <span className="text-blue-200">Generated:</span>
                <p className="text-white font-medium">{new Date().toLocaleTimeString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProofGenerator;
