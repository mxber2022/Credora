import React, { useState } from 'react';
import { DollarSign, TrendingUp, Shield, CheckCircle } from 'lucide-react';
import { useAccount } from 'wagmi';
import { useAppKit, useAppKitAccount } from '@reown/appkit/react';

interface LendingDashboardProps {
  userData: {
    monthlyIncome: number;
    proofGenerated: boolean;
    creditScore: number;
    documentName: string;
  };
}

export function LendingDashboard({ userData }: LendingDashboardProps) {
  const { address, isConnected } = useAccount();
  const { open } = useAppKit();
  const { address: appKitAddress } = useAppKitAccount();
  
  // Use AppKit address if available, otherwise use Wagmi address
  const connectedAddress = appKitAddress || address;
  const isWalletConnected = connectedAddress ? true : isConnected;
  const [loanAmount, setLoanAmount] = useState(2000);
  const [loanTerm, setLoanTerm] = useState(6);
  const [isApplying, setIsApplying] = useState(false);
  const [loanApproved, setLoanApproved] = useState(false);

  const maxLoanAmount = Math.min(userData.monthlyIncome * 3, 15000);
  const interestRate = userData.monthlyIncome > 6000 ? 8.5 : userData.monthlyIncome > 4000 ? 12.5 : 15.5;
  const monthlyPayment = (loanAmount * (interestRate / 100 / 12) * Math.pow(1 + interestRate / 100 / 12, loanTerm)) / 
                        (Math.pow(1 + interestRate / 100 / 12, loanTerm) - 1);

  const handleApplyLoan = () => {
    if (!isWalletConnected) {
      open();
      return;
    }
    setIsApplying(true);
    setTimeout(() => {
      setIsApplying(false);
      setLoanApproved(true);
    }, 3000);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Minimal Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center px-4 py-2 bg-black/20 border border-white/15 rounded-full text-gray-300 text-sm font-medium mb-8 shadow-2xl ring-1 ring-white/5">
          <CheckCircle className="h-4 w-4 mr-2" />
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
          Proof Verified
        </div>
        <h2 className="text-3xl font-bold text-gray-100 mb-4">
          Your PYUSD Credit Dashboard
        </h2>
        <p className="text-base text-gray-400 max-w-3xl mx-auto font-medium leading-relaxed">
          Based on your verified income proof, you're pre-approved for undercollateralized loans 
          powered by PayPal USD.
        </p>
      </div>

      {/* Simple Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-16">
        <div className="bg-black/20 backdrop-blur-2xl border border-white/15 rounded-2xl p-8 shadow-2xl hover:shadow-xl hover:border-white/25 transition-all duration-300 ring-1 ring-white/5">
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-800 rounded-xl">
              <TrendingUp className="h-6 w-6 text-gray-300" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-100">Verified Income</h3>
              <p className="text-gray-300">Monthly earnings confirmed</p>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-100 mb-2">${userData.monthlyIncome.toLocaleString()}</div>
          <div className="text-sm text-gray-400">Based on: {userData.documentName}</div>
        </div>

        <div className="bg-black/20 backdrop-blur-2xl border border-white/15 rounded-2xl p-8 shadow-2xl hover:shadow-xl hover:border-white/25 transition-all duration-300 ring-1 ring-white/5">
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-800 rounded-xl">
              <DollarSign className="h-6 w-6 text-gray-300" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-100">Credit Limit</h3>
              <p className="text-gray-300">Maximum borrowing capacity</p>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-100 mb-2">${maxLoanAmount.toLocaleString()}</div>
          <div className="text-sm text-gray-400">3x monthly income</div>
        </div>

        <div className="bg-black/20 backdrop-blur-2xl border border-white/15 rounded-2xl p-8 shadow-2xl hover:shadow-xl hover:border-white/25 transition-all duration-300 ring-1 ring-white/5">
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-800 rounded-xl">
              <Shield className="h-6 w-6 text-gray-300" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-100">Privacy Score</h3>
              <p className="text-gray-300">Zero personal data exposed</p>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-100 mb-2">100%</div>
          <div className="text-sm text-gray-400">Full privacy protection</div>
        </div>
      </div>

      {!loanApproved ? (
        <div>
          <div className="w-full">
            <div className="w-full bg-black/20 backdrop-blur-2xl border border-white/15 rounded-2xl p-8 shadow-xl ring-1 ring-white/5">
              <h3 className="text-2xl font-bold text-gray-100 mb-8 text-center">Configure Your Loan</h3>
              
              <div className="space-y-8">
                <div>
                  <label className="block text-base font-medium text-gray-200 mb-4">
                    Loan Amount (PYUSD)
                  </label>
                  <div className="relative">
                    <input
                      type="range"
                      min="500"
                      max={maxLoanAmount}
                      step="100"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #ffffff 0%, #ffffff ${((loanAmount - 500) / (maxLoanAmount - 500)) * 100}%, #1f2937 ${((loanAmount - 500) / (maxLoanAmount - 500)) * 100}%, #1f2937 100%)`
                      }}
                    />
                    <div className="flex justify-between text-sm text-gray-400 mt-2">
                      <span>$500</span>
                      <span>${maxLoanAmount.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="mt-6 p-6 bg-black/95 backdrop-blur-xl border border-gray-700/50 rounded-xl text-center shadow-lg">
                    <div className="text-4xl font-bold text-gray-100">${loanAmount.toLocaleString()}</div>
                    <div className="text-gray-300">Requested Amount</div>
                  </div>
                </div>

                <div>
                  <label className="block text-base font-medium text-gray-200 mb-4">
                    Loan Term
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[3, 6, 12].map((term) => (
                      <button
                        key={term}
                        onClick={() => setLoanTerm(term)}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                          loanTerm === term
                            ? 'border-gray-600 bg-black/95 text-gray-100'
                            : 'border-gray-800 bg-black/80 text-gray-300 hover:border-gray-700 hover:bg-black/90'
                        }`}
                      >
                        <div className="font-semibold text-lg">{term}</div>
                        <div className="text-sm text-gray-400">months</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-black/95 backdrop-blur-xl border border-gray-700/50 rounded-xl p-6 shadow-lg">
                    <h4 className="font-semibold text-gray-100 mb-4">Loan Summary</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Principal</span>
                        <span className="font-medium text-gray-100">${loanAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Interest Rate</span>
                        <span className="font-medium text-gray-100">{interestRate}% APR</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Term</span>
                        <span className="font-medium text-gray-100">{loanTerm} months</span>
                      </div>
                      <div className="border-t border-gray-700/50 pt-3 mt-4">
                        <div className="flex justify-between">
                          <span className="font-semibold text-gray-100">Monthly Payment</span>
                          <span className="font-bold text-xl text-gray-100">${monthlyPayment.toFixed(0)}</span>
                        </div>
                      </div>
                    </div>
                </div>

                <button
                  onClick={handleApplyLoan}
                  disabled={isApplying}
                  className="w-full bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 text-gray-200 hover:bg-gray-700/60 hover:text-white hover:border-gray-600/50 py-4 px-6 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isApplying ? (
                    <>
                      <div className="animate-spin w-5 h-5 border-2 border-gray-300 border-t-transparent rounded-full"></div>
                      <span>Processing Application...</span>
                    </>
                  ) : (
                    <>
                      <DollarSign className="h-5 w-5" />
                      <span>{isWalletConnected ? 'Apply for Loan' : 'Connect Wallet to Apply'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-12 w-full">
            <div className="w-full grid lg:grid-cols-3 gap-4">
              {/* Why You Qualify - Ultra Minimal */}
              <div className="bg-black/20 backdrop-blur-2xl border border-white/15 rounded-lg p-4 shadow-xl ring-1 ring-white/5">
                <h3 className="text-base font-semibold text-gray-100 mb-3">Qualified</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-gray-300">Income verified</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-gray-300">Privacy preserved</span>
                  </div>
                </div>
              </div>

              {/* Loan Terms - Ultra Minimal */}
              <div className="bg-black/20 backdrop-blur-2xl border border-white/15 rounded-lg p-4 shadow-xl ring-1 ring-white/5">
                <h3 className="text-base font-semibold text-gray-100 mb-3">Terms</h3>
                <div className="text-xs text-gray-300 space-y-1">
                  <div>• Undercollateralized loan</div>
                  <div>• Early repayment allowed</div>
                  <div>• PYUSD disbursement</div>
                </div>
              </div>

              {/* PYUSD Benefits - Ultra Minimal */}
              <div className="bg-black/20 backdrop-blur-2xl border border-white/15 rounded-lg p-4 shadow-xl ring-1 ring-white/5">
                <h3 className="text-base font-semibold text-gray-100 mb-3">PYUSD</h3>
                <div className="text-xs text-gray-300 space-y-1">
                  <div>• Digital currency</div>
                  <div>• 24/7 transfers</div>
                  <div>• Blockchain secured</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Minimal Success State */
        <div className="w-full">
          <div className="w-full bg-black/20 backdrop-blur-2xl border border-white/15 rounded-2xl p-12 text-center shadow-xl ring-1 ring-white/5">
            <div className="flex items-center justify-center w-16 h-16 bg-gray-800 rounded-2xl mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
            
            <h3 className="text-3xl font-bold text-gray-100 mb-4">
              Loan Approved! 🎉
            </h3>
            
            <p className="text-base text-gray-300 mb-8 max-w-2xl mx-auto">
              Congratulations! Your <span className="font-semibold text-gray-100">₹{loanAmount.toLocaleString()}</span> loan has been approved and will be 
              disbursed to your wallet within minutes.
            </p>
            
            <div className="bg-black/95 backdrop-blur-xl border border-gray-700/50 rounded-xl p-8 shadow-lg">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-100 mb-2">${loanAmount.toLocaleString()}</div>
                  <div className="text-gray-300 font-medium text-sm">Loan Amount</div>
                  <div className="text-xs text-gray-400 mt-1">PYUSD Digital Currency</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-100 mb-2">${monthlyPayment.toFixed(0)}</div>
                  <div className="text-gray-300 font-medium text-sm">Monthly Payment</div>
                  <div className="text-xs text-gray-400 mt-1">Auto-debited from wallet</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-100 mb-2">{interestRate}%</div>
                  <div className="text-gray-300 font-medium text-sm">Interest Rate</div>
                  <div className="text-xs text-gray-400 mt-1">APR based on income</div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-700/50">
                <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Funds disbursed instantly</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                    <span>Smart contract secured</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                    <span>Privacy maintained</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}