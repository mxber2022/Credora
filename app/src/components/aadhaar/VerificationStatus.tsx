import React from 'react';
import { CheckCircle, Shield } from 'lucide-react';

interface VerificationStatusProps {
  isVerified: boolean;
  walletAddress?: string;
  latestProof?: any;
  anonAadhaarStatus: string;
  verificationTx?: string;
}

export const VerificationStatus: React.FC<VerificationStatusProps> = ({
  isVerified,
  walletAddress,
  latestProof,
  anonAadhaarStatus,
  verificationTx
}) => {
  return (
    <div className="relative bg-black/20 backdrop-blur-2xl border border-white/15 rounded-3xl py-16 px-12 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden ring-1 ring-white/5 mb-8">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05)_0%,transparent_50%)]"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 text-center">
        <div className="inline-flex items-center px-4 py-2 bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-full text-gray-300 text-sm font-medium mb-6">
          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
          Verification Status
        </div>
        
        <div className="flex items-center justify-center space-x-4 mb-4">
          {/* <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            isVerified 
              ? 'bg-green-500/20 border-2 border-green-500' 
              : 'bg-gray-500/20 border-2 border-gray-500'
          }`}>
            {isVerified ? (
              <CheckCircle className="w-6 h-6 text-green-400" />
            ) : (
              // <Shield className="w-6 h-6 text-gray-400" />
              <></>
            )}
          </div> */}
          <div className="text-left">
            <h3 className="text-2xl font-bold text-white mb-2">
              {isVerified ? 'Verified' : ''}
            </h3>
            <p className="text-gray-300 text-sm">
              {isVerified 
                ? 'Your Aadhaar identity has been verified and linked to your wallet'
                : 'Complete the verification process to link your Aadhaar identity'
              }
            </p>
          </div>
        </div>
        
        {/* Status Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300 text-sm">Wallet Status</span>
              <span className={`text-sm font-medium ${
                walletAddress ? 'text-green-400' : 'text-gray-400'
              }`}>
                {walletAddress ? 'Connected' : 'Not Connected'}
              </span>
            </div>
            {walletAddress && (
              <div className="text-xs text-gray-400 text-center">
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </div>
            )}
          </div>
          
          <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300 text-sm">Aadhaar Proof</span>
              <span className={`text-sm font-medium ${
                latestProof ? 'text-green-400' : 'text-gray-400'
              }`}>
                {latestProof ? 'Generated' : 'Not Generated'}
              </span>
            </div>
            <div className="text-xs text-gray-400 text-center">
              {anonAadhaarStatus === 'logged-in' ? 'Logged In' : 'Not Logged In'}
            </div>
          </div>
          
          <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300 text-sm">Verification</span>
              <span className={`text-sm font-medium ${
                isVerified ? 'text-green-400' : 'text-yellow-400'
              }`}>
                {isVerified ? 'Complete' : 'Pending'}
              </span>
            </div>
            <div className="text-xs text-gray-400 text-center">
              {verificationTx ? 'On Blockchain' : 'Not Submitted'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
