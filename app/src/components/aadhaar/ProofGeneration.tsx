import React from 'react';
import { Shield, CheckCircle, ExternalLink } from 'lucide-react';
import { LogInWithAnonAadhaar } from "@anon-aadhaar/react";

interface ProofGenerationProps {
  useTestAadhaar: boolean;
  setUseTestAadhaar: (state: boolean) => void;
  anonAadhaarStatus: string;
  latestProof?: any;
  verificationStatus: string;
  verificationTx?: string;
  isVerifying: boolean;
  onVerifyProof: () => void;
}

export const ProofGeneration: React.FC<ProofGenerationProps> = ({
  useTestAadhaar,
  setUseTestAadhaar,
  anonAadhaarStatus,
  latestProof,
  verificationStatus,
  verificationTx,
  isVerifying,
  onVerifyProof
}) => {
  return (
    <>
      {/* Mode Toggle */}
      <div className="flex justify-center mb-6">
        <div className="bg-black/20 backdrop-blur-2xl border border-white/15 rounded-2xl p-1.5 flex shadow-lg ring-1 ring-white/5">
          <button
            onClick={() => setUseTestAadhaar(true)}
            className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
              useTestAadhaar 
                ? 'bg-white text-black shadow-sm' 
                : 'text-gray-300 hover:text-white hover:bg-black/30'
            }`}
          >
            TEST MODE
          </button>
          <button
            onClick={() => setUseTestAadhaar(false)}
            className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
              !useTestAadhaar 
                ? 'bg-white text-black shadow-sm' 
                : 'text-gray-300 hover:text-white hover:bg-black/30'
            }`}
          >
            REAL MODE
          </button>
        </div>
      </div>

       {/* Login Section */}
       <div className="relative bg-black/20 backdrop-blur-2xl border border-white/15 rounded-3xl py-20 px-12 shadow-2xl hover:shadow-3xl transition-all duration-500 ring-1 ring-white/5">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05)_0%,transparent_50%)]"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-full text-gray-300 text-sm font-medium mb-6">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
            Identity Verification
          </div>
          <h3 className="text-2xl font-bold text-gray-100 mb-6">
            Identity Verification Required
          </h3>
          <p className="text-sm text-gray-300 max-w-2xl mx-auto font-medium mb-8">
            {useTestAadhaar 
              ? 'Generate a test proof to explore the platform features' 
              : 'Generate your real Aadhaar proof to start making compliant transfers'
            }
          </p>
          
           <div className="flex justify-center items-center mb-8">
             <div className="w-full max-w-lg relative z-50 flex justify-center">
               <LogInWithAnonAadhaar nullifierSeed={1234} />
             </div>
           </div>
          
          <div className="mt-8 p-6 bg-black/20 backdrop-blur-2xl border border-white/15 rounded-xl shadow-lg ring-1 ring-white/5">
            <div className="flex items-center justify-center space-x-3 mb-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="text-white font-semibold text-sm">
                {useTestAadhaar ? 'Test Mode Active' : 'Real Mode Active'}
              </span>
            </div>
            <p className="text-gray-300 text-sm">
              {useTestAadhaar 
                  ? 'Using test credentials for demonstration purposes. No real Aadhaar data required.' 
                  : 'Your real Aadhaar data will be processed securely with zero-knowledge proofs.'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Proof Display */}
      {anonAadhaarStatus === "logged-in" && latestProof && (
        <div className="relative bg-black/20 backdrop-blur-2xl border border-white/15 rounded-3xl py-20 px-12 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden ring-1 ring-white/5 mt-8">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(147,51,234,0.05)_0%,transparent_50%)]"></div>
          <div className="absolute top-0 left-0 w-80 h-80 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 text-center mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-full text-gray-300 text-sm font-medium mb-6">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Proof Generated
            </div>
            <h3 className="text-2xl font-bold text-gray-100 mb-6">
              Proof Generated Successfully!
            </h3>
            <p className="text-sm text-gray-300 max-w-2xl mx-auto font-medium">
              Your Aadhaar identity proof is ready for verification
            </p>
          </div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-center justify-between">
              <h5 className="text-white font-semibold text-sm">Generated Proof Details</h5>
              <div className="flex items-center space-x-2 text-xs text-white">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="font-semibold">VERIFIED</span>
              </div>
            </div>
            
            <div className="bg-black/20 backdrop-blur-2xl border border-white/15 rounded-lg p-6 max-h-80 overflow-y-auto shadow-lg ring-1 ring-white/5">
              <pre className="text-gray-300 text-xs font-mono leading-relaxed whitespace-pre-wrap break-all">
                {JSON.stringify(latestProof, null, 2)}
              </pre>
            </div>
            
            <div className="flex items-center justify-between text-xs text-gray-300">
              <span>Proof Type: Groth16</span>
              <span>Circuit: Anon Aadhaar v2.0</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Verification Status */}
      {verificationStatus && (
        <div className="relative bg-black/20 backdrop-blur-2xl border border-white/15 rounded-3xl py-12 px-12 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden ring-1 ring-white/5 mt-8">
          <div className="relative z-10 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <p className="text-white font-semibold text-sm">Verification Status</p>
            </div>
            <div className="flex items-center justify-center space-x-4">
              <p className="text-gray-300 text-sm font-medium">{verificationStatus}</p>
              {verificationTx && verificationStatus === 'Verification completed!' && (
                <a 
                  href={verificationTx}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 text-white hover:text-gray-300 text-sm font-semibold transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>View Transaction</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Verify Button */}
      {anonAadhaarStatus === "logged-in" && latestProof && !verificationTx && (
        <div className="text-center mt-8">
          <button
            onClick={onVerifyProof}
            disabled={isVerifying}
            className="px-12 py-6 bg-black/20 backdrop-blur-2xl border border-white/15 text-gray-200 hover:bg-black/30 hover:text-white hover:border-white/25 hover:scale-105 transition-all duration-500 shadow-2xl hover:shadow-3xl group ring-1 ring-white/5 hover:ring-white/10 rounded-3xl font-bold text-base tracking-wide disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <span className="flex items-center">
              {isVerifying ? 'VERIFYING ON BLOCKCHAIN...' : 'VERIFY ON BLOCKCHAIN'}
            </span>
          </button>
        </div>
      )}

    </>
  );
};
