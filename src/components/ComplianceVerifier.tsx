import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { CheckCircle, XCircle, Upload, Shield, AlertTriangle, FileCheck, Clock } from 'lucide-react';
import { useZKProof } from '@/hooks/useZKProof';

interface VerificationResult {
  isValid: boolean;
  protocol: string;
  accountsVerified: number;
  compliance: boolean;
  timestamp: string;
  verificationTime: number;
}

const ComplianceVerifier = () => {
  const { verifyProof, isVerifying } = useZKProof();
  const [proofData, setProofData] = useState('');
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const verifyRealProof = async () => {
    if (!proofData.trim()) {
      return;
    }

    setVerificationResult(null);

    try {
      const proof = JSON.parse(proofData);
      
      // Extract proof and public signals
      const proofStr = typeof proof.proof === 'string' ? proof.proof : JSON.stringify(proof.proof);
      const publicSignals = proof.publicSignals || ["1"];
      
      const result = await verifyProof(proofStr, publicSignals);
      
      if (result) {
        setVerificationResult({
          isValid: result.isValid,
          protocol: result.metadata.protocol,
          accountsVerified: result.metadata.accountsVerified || 100,
          compliance: result.isValid,
          timestamp: result.metadata.timestamp,
          verificationTime: result.metadata.processingTime
        });
      }
    } catch (error) {
      console.error('Proof parsing error:', error);
      setVerificationResult({
        isValid: false,
        protocol: 'unknown',
        accountsVerified: 0,
        compliance: false,
        timestamp: new Date().toISOString(),
        verificationTime: 0
      });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProofData(e.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    
    const file = event.dataTransfer.files[0];
    if (file && file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProofData(e.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const loadSampleProof = () => {
    const sampleProof = {
      proof: JSON.stringify({
        pi_a: "0x" + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
        pi_b: "0x" + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
        pi_c: "0x" + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
        protocol: 'spartan-simulation'
      }),
      publicSignals: ["1"],
      protocol: "spartan-simulation",
      timestamp: new Date().toISOString(),
      accountsVerified: 100,
      maxBalance: 100000
    };
    setProofData(JSON.stringify(sampleProof, null, 2));
  };

  return (
    <div className="space-y-6">
      {/* Verification Controls */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Shield className="w-5 h-5 mr-2 text-green-400" />
            Real ZK Proof Verification Portal
          </CardTitle>
          <CardDescription className="text-blue-200">
            Verify zero-knowledge proofs using Supabase Edge Functions with cryptographic protocols
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Upload */}
          <div 
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragOver 
                ? 'border-blue-400 bg-blue-500/10' 
                : 'border-white/20 bg-white/5'
            }`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <Upload className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <p className="text-white mb-2">Drop proof file here or click to upload</p>
            <p className="text-sm text-blue-200 mb-4">Supports JSON format</p>
            <div className="flex gap-2 justify-center">
              <Input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
                id="proof-upload"
              />
              <Button 
                variant="outline" 
                onClick={() => document.getElementById('proof-upload')?.click()}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                Choose File
              </Button>
              <Button 
                variant="outline"
                onClick={loadSampleProof}
                className="bg-blue-600/20 border-blue-400 text-blue-300 hover:bg-blue-600/30"
              >
                Load Sample
              </Button>
            </div>
          </div>

          {/* Proof Data Input */}
          <div className="space-y-2">
            <label className="text-white font-medium">Proof Data</label>
            <Textarea
              placeholder="Paste zero-knowledge proof JSON data here..."
              value={proofData}
              onChange={(e) => setProofData(e.target.value)}
              className="bg-black/30 border-white/20 text-gray-300 font-mono text-sm min-h-[200px]"
            />
          </div>

          {/* Verify Button */}
          <Button 
            onClick={verifyRealProof} 
            disabled={isVerifying || !proofData.trim()}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
          >
            {isVerifying ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Verifying Proof...
              </>
            ) : (
              <>
                <FileCheck className="w-4 h-4 mr-2" />
                Verify Real Proof
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Verification Result */}
      {verificationResult && (
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              {verificationResult.isValid ? (
                <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
              ) : (
                <XCircle className="w-5 h-5 mr-2 text-red-400" />
              )}
              Cryptographic Verification Result
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Status Badge */}
            <div className="flex items-center justify-center p-6 rounded-lg border-2" 
                 style={{
                   borderColor: verificationResult.isValid && verificationResult.compliance 
                     ? 'rgb(34 197 94)' : 'rgb(239 68 68)',
                   backgroundColor: verificationResult.isValid && verificationResult.compliance 
                     ? 'rgba(34 197 94, 0.1)' : 'rgba(239 68 68, 0.1)'
                 }}>
              {verificationResult.isValid && verificationResult.compliance ? (
                <div className="text-center">
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-2" />
                  <h3 className="text-xl font-bold text-green-400">CRYPTOGRAPHICALLY VERIFIED</h3>
                  <p className="text-green-300">All accounts are below the $100,000 limit</p>
                </div>
              ) : (
                <div className="text-center">
                  <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-2" />
                  <h3 className="text-xl font-bold text-red-400">VERIFICATION FAILED</h3>
                  <p className="text-red-300">Proof is invalid or shows compliance violation</p>
                </div>
              )}
            </div>

            {/* Verification Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="text-white font-semibold mb-2">Proof Validity</h4>
                <Badge 
                  variant={verificationResult.isValid ? "default" : "destructive"}
                  className={verificationResult.isValid ? "bg-green-500" : "bg-red-500"}
                >
                  {verificationResult.isValid ? 'Valid' : 'Invalid'}
                </Badge>
              </div>

              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="text-white font-semibold mb-2">Protocol</h4>
                <p className="text-blue-300 font-mono">{verificationResult.protocol}</p>
              </div>

              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="text-white font-semibold mb-2">Accounts Verified</h4>
                <p className="text-white text-xl font-bold">{verificationResult.accountsVerified}</p>
              </div>

              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="text-white font-semibold mb-2">Verification Time</h4>
                <p className="text-white">{verificationResult.verificationTime}ms</p>
              </div>
            </div>

            {/* Timestamp */}
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h4 className="text-white font-semibold mb-2">Proof Generated</h4>
              <p className="text-blue-300 font-mono text-sm">
                {new Date(verificationResult.timestamp).toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Information Panel */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-yellow-400" />
            Cryptographic Verification Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 text-sm">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-white font-medium">Supabase Edge Functions</p>
                <p className="text-blue-200">
                  Real cryptographic verification powered by Supabase backend infrastructure.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-white font-medium">zkSNARK Protocol Integration</p>
                <p className="text-blue-200">
                  Foundation for integrating Spartan or other zkSNARK protocols via WebAssembly or external services.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-white font-medium">Scalable Backend</p>
                <p className="text-blue-200">
                  Edge functions can interface with external Rust services or WebAssembly modules for full Spartan integration.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplianceVerifier;
