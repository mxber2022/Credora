import React from 'react';
import { Wallet, CheckCircle, ExternalLink } from 'lucide-react';

interface WalletLinkingProps {
  isConnected: boolean;
  walletLinked: boolean;
  isLinkingWallet: boolean;
  isWaitingConfirmation?: boolean;
  verificationTx?: string;
  linkTx?: string;
  onLinkWallet: () => void;
  onCancelLinking?: () => void;
}

export const WalletLinking: React.FC<WalletLinkingProps> = ({
  isConnected,
  walletLinked,
  isLinkingWallet,
  isWaitingConfirmation,
  verificationTx,
  linkTx,
  onLinkWallet,
  onCancelLinking
}) => {
  if (isWaitingConfirmation) {
    return (
      <div className="relative bg-black/20 backdrop-blur-2xl border border-white/15 rounded-3xl py-20 px-12 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden ring-1 ring-white/5 mt-8">
        {/* Waiting background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05)_0%,transparent_50%)]"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 text-center">
          <div className="space-y-6">
            <div className="relative">
              <div className="w-20 h-20 bg-black/40 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center mx-auto shadow-2xl ring-1 ring-white/10">
                <div className="animate-spin w-10 h-10 border-2 border-white/30 border-t-white rounded-full"></div>
              </div>
              {/* Animated ring around the spinner */}
              <div className="absolute inset-0 w-20 h-20 border-2 border-dashed border-white/20 rounded-full mx-auto animate-spin-slow"></div>
            </div>
            
            <div className="space-y-3">
              <div className="inline-flex items-center px-4 py-2 bg-blue-500/10 backdrop-blur-xl border border-blue-500/30 rounded-full text-blue-300 text-sm font-medium">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
                Waiting for Confirmation
              </div>
              <h3 className="text-2xl font-bold text-white">
                Transaction Submitted!
              </h3>
              <p className="text-sm text-gray-300 max-w-2xl mx-auto font-medium">
                Your wallet linking transaction has been submitted to the blockchain. 
                Please wait for confirmation...
              </p>
              <div className="inline-flex items-center px-4 py-2 bg-black/40 backdrop-blur-xl border border-white/20 rounded-full text-white text-sm font-medium">
                <div className="w-2 h-2 bg-white/60 rounded-full mr-2 animate-pulse"></div>
                Confirming Transaction
              </div>
              
              {/* Cancel Button */}
              {onCancelLinking && (
                <button
                  onClick={onCancelLinking}
                  className="mt-4 px-6 py-2 bg-red-500/10 backdrop-blur-xl border border-red-500/30 text-red-300 hover:bg-red-500/20 hover:text-red-200 hover:border-red-500/50 transition-all duration-300 rounded-xl font-medium text-sm"
                >
                  Cancel Process
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (walletLinked) {
    return (
      <div className="relative bg-black/20 backdrop-blur-2xl border border-white/15 rounded-3xl py-20 px-12 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden ring-1 ring-white/5 mt-8">
        {/* Success background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.05)_0%,transparent_50%)]"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 text-center">
          <div className="space-y-6">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-emerald-500/10 backdrop-blur-xl border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto shadow-2xl ring-1 ring-emerald-500/20">
              <CheckCircle className="w-10 h-10 text-emerald-400" />
            </div>
            
            {/* Success Message */}
            <div className="space-y-3">
              <div className="inline-flex items-center px-4 py-2 bg-emerald-500/10 backdrop-blur-xl border border-emerald-500/30 rounded-full text-emerald-300 text-sm font-medium">
                <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></div>
                Wallet Linked Successfully
              </div>
              <h3 className="text-2xl font-bold text-white">
                Verification Complete!
              </h3>
              <p className="text-sm text-gray-300 max-w-2xl mx-auto font-medium">
                Your wallet is now verified and linked to your Aadhaar identity. You can now access undercollateralized lending.
              </p>
            </div>
            
            {/* Transaction Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {verificationTx && (
                <div className="group relative bg-black/20 backdrop-blur-2xl border border-white/15 rounded-2xl p-4 transition-all duration-500 shadow-2xl hover:shadow-3xl hover:border-white/25 hover:scale-105 overflow-hidden ring-1 ring-white/5">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold text-sm">ZK Proof</h4>
                        <p className="text-gray-400 text-xs">Identity verification</p>
                      </div>
                    </div>
                    <a 
                      href={verificationTx}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-white hover:text-green-400 text-sm font-medium transition-colors group-hover:border-green-500/50"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>View Transaction</span>
                    </a>
                  </div>
                </div>
              )}
              
              {linkTx && (
                <div className="group relative bg-black/20 backdrop-blur-2xl border border-white/15 rounded-2xl p-4 transition-all duration-500 shadow-2xl hover:shadow-3xl hover:border-white/25 hover:scale-105 overflow-hidden ring-1 ring-white/5">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                        <Wallet className="w-4 h-4 text-blue-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold text-sm">Wallet Link</h4>
                        <p className="text-gray-400 text-xs">Address verification</p>
                      </div>
                    </div>
                    <a 
                      href={`https://zkverify-testnet.subscan.io/extrinsic/${linkTx}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-white hover:text-blue-400 text-sm font-medium transition-colors group-hover:border-blue-500/50"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>View Transaction</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
            
            {/* Next Steps */}
            <div className="bg-black/20 backdrop-blur-2xl border border-white/15 rounded-2xl p-6 max-w-2xl mx-auto">
              <h4 className="text-lg font-semibold text-white mb-3">What's Next?</h4>
              <p className="text-sm text-gray-300 mb-4">
                Your identity is verified! Now you can prove your income to access lending.
              </p>
              <div className="flex items-center justify-center space-x-4">
                <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-3 py-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300 text-sm font-medium">Identity Verified</span>
                </div>
                <div className="text-gray-400">→</div>
                <div className="flex items-center space-x-2 bg-blue-500/10 border border-blue-500/30 rounded-lg px-3 py-2">
                  <Wallet className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-300 text-sm font-medium">Prove Income</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-black/20 backdrop-blur-2xl border border-white/15 rounded-3xl py-20 px-12 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden ring-1 ring-white/5 mt-8">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.05)_0%,transparent_50%)]"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 text-center">
        <div className="inline-flex items-center px-4 py-2 bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-full text-gray-300 text-sm font-medium mb-6">
          <div className="w-2 h-2 bg-purple-500 rounded-full mr-2 animate-pulse"></div>
          Wallet Linking
        </div>
        <h3 className="text-2xl font-bold text-gray-100 mb-6">
          Link Your Wallet
        </h3>
        <p className="text-sm text-gray-300 max-w-2xl mx-auto font-medium mb-8">
          Connect your wallet to complete verification
        </p>
        
        {isLinkingWallet ? (
          <div className="space-y-6">
            <div className="relative">
              <div className="w-20 h-20 bg-black/40 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center mx-auto shadow-2xl ring-1 ring-white/10">
                <div className="animate-spin w-10 h-10 border-2 border-white/30 border-t-white rounded-full"></div>
              </div>
              {/* Animated ring around the spinner */}
              <div className="absolute inset-0 w-20 h-20 border-2 border-dashed border-white/20 rounded-full mx-auto animate-spin-slow"></div>
            </div>
            <div className="text-center space-y-3">
              <h4 className="text-lg font-semibold text-white">Linking Wallet...</h4>
              <p className="text-gray-300 text-sm">Please confirm the transaction in your wallet</p>
              <div className="inline-flex items-center px-4 py-2 bg-black/40 backdrop-blur-xl border border-white/20 rounded-full text-white text-sm font-medium">
                <div className="w-2 h-2 bg-white/60 rounded-full mr-2 animate-pulse"></div>
                Processing Transaction
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={onLinkWallet}
            disabled={!isConnected}
            className="px-12 py-6 bg-black/20 backdrop-blur-2xl border border-white/15 text-gray-200 hover:bg-black/30 hover:text-white hover:border-white/25 hover:scale-105 transition-all duration-500 shadow-2xl hover:shadow-3xl group ring-1 ring-white/5 hover:ring-white/10 rounded-3xl font-bold text-base tracking-wide disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <span className="flex items-center">
              {!isConnected ? 'CONNECT WALLET FIRST' : 'LINK WALLET'}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};
