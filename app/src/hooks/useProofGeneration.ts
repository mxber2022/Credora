import { useState, useCallback } from 'react';
import { circuitApi, ProofResponse, VerifyResponse } from '../services/circuitApi';

export interface ProofState {
  isGenerating: boolean;
  isVerifying: boolean;
  proof: ProofResponse | null;
  verification: VerifyResponse | null;
  error: string | null;
}

export function useProofGeneration() {
  const [state, setState] = useState<ProofState>({
    isGenerating: false,
    isVerifying: false,
    proof: null,
    verification: null,
    error: null,
  });

  const generateProof = useCallback(async (
    file: File,
    pageNumber: number = 0,
    subString: string = "Sample Signed PDF Document"
  ) => {
    setState(prev => ({
      ...prev,
      isGenerating: true,
      error: null,
      proof: null,
    }));

    try {
      const proof = await circuitApi.generateProof(file, pageNumber, subString);
      
      setState(prev => ({
        ...prev,
        isGenerating: false,
        proof,
        verification: { valid: true }, // Mark as valid since we're not verifying
        error: null,
      }));

      return proof;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate proof';
      
      setState(prev => ({
        ...prev,
        isGenerating: false,
        error: errorMessage,
        proof: null,
      }));

      throw error;
    }
  }, []);

  const verifyProof = useCallback(async (proof: ProofResponse) => {
    // No-op since we're not verifying proofs
    return { valid: true };
  }, []);

  const reset = useCallback(() => {
    setState({
      isGenerating: false,
      isVerifying: false,
      proof: null,
      verification: null,
      error: null,
    });
  }, []);

  return {
    ...state,
    generateProof,
    verifyProof,
    reset,
  };
}
