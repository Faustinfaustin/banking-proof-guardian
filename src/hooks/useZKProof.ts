
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AccountType } from '@/utils/accountTypes';

export interface Account {
  balance: number;
  salt: string;
  accountType?: AccountType;
}

export interface ProofResult {
  proof: string;
  publicSignals: string[];
  metadata: {
    protocol: string;
    accountsVerified: number;
    timestamp: string;
    processingTime: number;
    accountTypes?: Record<AccountType, number>;
  };
}

export interface VerificationResult {
  isValid: boolean;
  metadata: {
    protocol: string;
    accountsVerified: number;
    timestamp: string;
    processingTime: number;
    accountTypes?: Record<AccountType, number>;
  };
}

export const useZKProof = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();

  const generateProof = async (accounts: Account[], maxBalance: number = 100000): Promise<ProofResult | null> => {
    setIsGenerating(true);
    
    try {
      console.log(`Generating ZK proof for ${accounts.length} accounts with account types`);
      
      // Count accounts by type
      const accountTypes = accounts.reduce((acc, account) => {
        const type = account.accountType || 'individual';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {} as Record<AccountType, number>);
      
      const { data, error } = await supabase.functions.invoke('zkp-operations', {
        body: {
          operation: 'generate',
          accounts,
          maxBalance,
          accountTypes
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.success) {
        throw new Error(data.error || 'Proof generation failed');
      }

      toast({
        title: "Proof Generated Successfully",
        description: `Generated proof for ${data.metadata.accountsVerified} accounts with mixed account types using ${data.metadata.protocol}`,
      });

      return {
        proof: data.proof,
        publicSignals: data.publicSignals,
        metadata: {
          ...data.metadata,
          accountTypes
        }
      };

    } catch (error) {
      console.error('Proof generation error:', error);
      toast({
        title: "Proof Generation Failed",
        description: error.message,
        variant: "destructive"
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const verifyProof = async (proof: string, publicSignals: string[]): Promise<VerificationResult | null> => {
    setIsVerifying(true);
    
    try {
      console.log('Verifying ZK proof with account type support');
      
      const { data, error } = await supabase.functions.invoke('zkp-operations', {
        body: {
          operation: 'verify',
          proof,
          publicSignals
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.success) {
        throw new Error(data.error || 'Proof verification failed');
      }

      const isValid = data.verificationResult;
      
      toast({
        title: isValid ? "Proof Verified Successfully" : "Proof Verification Failed",
        description: isValid ? "The proof is valid and shows compliance with Article R221-2" : "The proof is invalid or shows non-compliance",
        variant: isValid ? "default" : "destructive"
      });

      return {
        isValid,
        metadata: data.metadata
      };

    } catch (error) {
      console.error('Proof verification error:', error);
      toast({
        title: "Verification Error",
        description: error.message,
        variant: "destructive"
      });
      return null;
    } finally {
      setIsVerifying(false);
    }
  };

  return {
    generateProof,
    verifyProof,
    isGenerating,
    isVerifying
  };
};
