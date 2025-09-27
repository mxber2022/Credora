import React from 'react';
import { CheckCircle, ExternalLink, Shield, ArrowRight, DollarSign, TrendingUp, Clock, Wallet } from 'lucide-react';
import { Button } from '../ui/Button';

interface VerifiedStateProps {
  verificationTx?: string;
  linkTx?: string;
}

export const VerifiedState: React.FC<VerifiedStateProps> = ({ verificationTx, linkTx }) => {
  return (
    <div className="min-h-screen py-8 relative bg-black">
      {/* Enhanced background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-green-500/10 to-emerald-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-500/5 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-emerald-500/10 to-green-500/5 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '4s'}}></div>
        
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-green-400/30 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-emerald-400/40 rounded-full animate-ping" style={{animationDelay: '3s'}}></div>
        <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-blue-400/30 rounded-full animate-ping" style={{animationDelay: '5s'}}></div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      <div className="relative z-10">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-full text-gray-300 text-sm font-medium mb-6">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Verification Complete
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-8 leading-tight tracking-tight">
              <span className="text-white bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent animate-fadeIn">
                Identity Verified
              </span>
            </h1>
            <p className="text-base text-gray-300 mb-16 max-w-3xl mx-auto leading-relaxed font-normal animate-fadeIn" style={{animationDelay: '0.2s'}}>
              Your Aadhaar identity has been successfully verified and linked to your wallet. 
              You can now access undercollateralized PYUSD borrowing with full compliance.
            </p>
          </div>

          {/* Main Success Card */}
          <div className="relative bg-black/20 backdrop-blur-2xl border border-white/15 rounded-3xl py-16 px-8 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden ring-1 ring-white/5 mb-8">
            {/* Success background pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.05)_0%,transparent_50%)]"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 text-center">
              
              {/* Success Description */}
              {/* <p className="text-sm text-gray-300 max-w-2xl mx-auto font-medium leading-relaxed mb-12">
                Your Aadhaar identity has been verified and linked to your wallet. You can now access undercollateralized PYUSD lending with full compliance.
              </p> */}

              {/* Lending Profile Section */}
              <div className="mb-12">
                <h3 className="text-xl font-bold text-gray-100 mb-6 text-center"></h3>
                
                {/* Key Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  {/* Total Credit Limit */}
                  <div className="group relative bg-black/20 backdrop-blur-2xl border border-white/15 rounded-2xl p-6 transition-all duration-500 shadow-2xl hover:shadow-3xl hover:border-white/25 hover:scale-105 overflow-hidden ring-1 ring-white/5">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10 text-center">
                      <div className="flex items-center justify-center mx-auto mb-4">
                        <TrendingUp className="w-6 h-6 text-blue-400" />
                      </div>
                      <div className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">$10,000</div>
                      <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">Credit Limit</p>
                    </div>
                  </div>

                  {/* Currently Borrowed */}
                  <div className="group relative bg-black/20 backdrop-blur-2xl border border-white/15 rounded-2xl p-6 transition-all duration-500 shadow-2xl hover:shadow-3xl hover:border-white/25 hover:scale-105 overflow-hidden ring-1 ring-white/5">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10 text-center">
                      <div className="flex items-center justify-center mx-auto mb-4">
                        <DollarSign className="w-6 h-6 text-orange-400" />
                      </div>
                      <div className="text-2xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">$2,500</div>
                      <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">Currently Borrowed</p>
                    </div>
                  </div>

                  {/* Available Credit */}
                  <div className="group relative bg-black/20 backdrop-blur-2xl border border-white/15 rounded-2xl p-6 transition-all duration-500 shadow-2xl hover:shadow-3xl hover:border-white/25 hover:scale-105 overflow-hidden ring-1 ring-white/5">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10 text-center">
                      <div className="flex items-center justify-center mx-auto mb-4">
                        <Wallet className="w-6 h-6 text-green-400" />
                      </div>
                      <div className="text-2xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors">$7,500</div>
                      <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">Available Credit</p>
                    </div>
                  </div>

                  {/* Credit Score */}
                  <div className="group relative bg-black/20 backdrop-blur-2xl border border-white/15 rounded-2xl p-6 transition-all duration-500 shadow-2xl hover:shadow-3xl hover:border-white/25 hover:scale-105 overflow-hidden ring-1 ring-white/5">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10 text-center">
                      <div className="flex items-center justify-center mx-auto mb-4">
                        <Shield className="w-6 h-6 text-purple-400" />
                      </div>
                      <div className="text-2xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">750</div>
                      <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">Credit Score</p>
                    </div>
                  </div>
                </div>

                {/* Credit Utilization & Interest Rate */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Credit Utilization */}
                  <div className="bg-black/20 backdrop-blur-2xl border border-white/15 rounded-2xl p-6">
                    <h4 className="text-lg font-semibold text-white mb-4">Credit Utilization</h4>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-gray-300 text-sm">25% Used</span>
                      <span className="text-green-400 text-sm font-medium">Excellent</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                      <div className="bg-gradient-to-r from-green-400 to-emerald-400 h-2 rounded-full" style={{width: '25%'}}></div>
                    </div>
                    <p className="text-gray-400 text-xs">$2,500 of $10,000 credit limit</p>
                  </div>

                  {/* Current Interest Rate */}
                  <div className="bg-black/20 backdrop-blur-2xl border border-white/15 rounded-2xl p-6">
                    <h4 className="text-lg font-semibold text-white mb-4">Current Interest Rate</h4>
                    <div className="text-3xl font-bold text-green-400 mb-2">8.5% APY</div>
                    <p className="text-gray-400 text-sm mb-3">Based on your credit score and income verification</p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span>• Variable rate</span>
                      <span>• Compounded daily</span>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-black/20 backdrop-blur-2xl border border-white/15 rounded-2xl p-6">
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-gray-400" />
                    Recent Borrowing Activity
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-black/20 backdrop-blur-2xl border border-white/15 rounded-xl p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        <span className="text-gray-300 text-sm font-medium">Borrowed ₹1,000</span>
                      </div>
                      <p className="text-gray-500 text-xs mb-2">Loan ID: #CRD-2024-001</p>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-xs">2 days ago</span>
                        <span className="text-green-400 text-xs">+₹1,000</span>
                      </div>
                    </div>
                    
                    <div className="bg-black/20 backdrop-blur-2xl border border-white/15 rounded-xl p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                        <span className="text-gray-300 text-sm font-medium">Income verification</span>
                      </div>
                      <p className="text-gray-500 text-xs mb-2">Proof ID: #PRF-2024-002</p>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-xs">5 days ago</span>
                        <span className="text-blue-400 text-xs">Verified</span>
                      </div>
                    </div>
                    
                    <div className="bg-black/20 backdrop-blur-2xl border border-white/15 rounded-xl p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                        <span className="text-gray-300 text-sm font-medium">Credit limit increased</span>
                      </div>
                      <p className="text-gray-500 text-xs mb-2">Update ID: #UPD-2024-003</p>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-xs">1 week ago</span>
                        <span className="text-purple-400 text-xs">+₹5,000</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transaction Links */}
              {(verificationTx || linkTx) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                  {verificationTx && (
                    <div className="group relative bg-black/20 backdrop-blur-2xl border border-white/15 rounded-2xl p-6 transition-all duration-500 shadow-2xl hover:shadow-3xl hover:border-white/25 hover:scale-105 overflow-hidden ring-1 ring-white/5">
                      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="relative z-10">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                            <Shield className="w-5 h-5 text-green-400" />
                          </div>
                          <div>
                            <h3 className="text-white font-semibold text-sm">Verification Proof</h3>
                            <p className="text-gray-400 text-xs">Submitted to blockchain</p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full group-hover:border-green-500/50 group-hover:text-green-400"
                          onClick={() => window.open(verificationTx, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Transaction
                        </Button>
                      </div>
                    </div>
                  )}

                  {linkTx && (
                    <div className="group relative bg-black/20 backdrop-blur-2xl border border-white/15 rounded-2xl p-6 transition-all duration-500 shadow-2xl hover:shadow-3xl hover:border-white/25 hover:scale-105 overflow-hidden ring-1 ring-white/5">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="relative z-10">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                            <CheckCircle className="w-5 h-5 text-blue-400" />
                          </div>
                          <div>
                            <h3 className="text-white font-semibold text-sm">Wallet Link</h3>
                            <p className="text-gray-400 text-xs">Linked to your wallet</p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full group-hover:border-blue-500/50 group-hover:text-blue-400"
                          onClick={() => window.open(linkTx, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Transaction
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Next Steps */}
              <div className="bg-black/20 backdrop-blur-2xl border border-white/15 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-100 mb-6">What's Next?</h3>
                <p className="text-sm text-gray-300 max-w-2xl mx-auto font-medium leading-relaxed mb-8">
                  Your verified identity unlocks access to undercollateralized PYUSD borrowing
                </p>
                <div className="flex items-center justify-center space-x-6 mb-8">
                  <div className="flex items-center space-x-3 bg-black/30 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-gray-200 text-sm font-medium">Prove income with zkPDF</span>
                  </div>
                  <ArrowRight className="w-6 h-6 text-green-400" />
                  <div className="flex items-center space-x-3 bg-black/30 backdrop-blur-xl border border-blue-500/30 rounded-xl px-4 py-3">
                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                    <span className="text-white font-bold text-sm">Access PYUSD Loans</span>
                  </div>
                </div>
                
                {/* Borrow Button */}
                <div className="text-center">
                  <button
                    onClick={() => {
                      console.log('Borrow PYUSD button clicked');
                      // Navigate to lending page or trigger borrowing flow
                      window.location.href = '/#lending';
                    }}
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-lg rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105 group"
                  >
                    <span className="mr-3">Borrow PYUSD</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                  <p className="text-gray-400 text-sm mt-3">
                    Start with income verification to access PYUSD lending
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
