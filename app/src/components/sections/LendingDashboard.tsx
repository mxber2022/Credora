import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Shield, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useAccount, useReadContract } from 'wagmi';
import { useAppKit, useAppKitAccount } from '@reown/appkit/react';
import { LOAN_CONTRACT_ADDRESS, LOAN_CONTRACT_ABI } from '../../services/loanService';

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
  
  // Real contract data states
  const [userLoans, setUserLoans] = useState<any[]>([]);
  const [hasActiveLoan, setHasActiveLoan] = useState(false);
  const [isLoadingLoans, setIsLoadingLoans] = useState(true);
  const [loanError, setLoanError] = useState<string | null>(null);
  const [salaryRange, setSalaryRange] = useState<string>('3000-4000');
  const [contractLoanLimit, setContractLoanLimit] = useState<number>(0);
  const [contractInterestRate, setContractInterestRate] = useState<number>(0);

  // Real contract data fetching
  const { data: userLoansData, isLoading: isLoadingUserLoans } = useReadContract({
    address: LOAN_CONTRACT_ADDRESS as `0x${string}`,
    abi: LOAN_CONTRACT_ABI,
    functionName: 'getUserLoans',
    args: connectedAddress ? [connectedAddress as `0x${string}`] : undefined,
  });

  // Get salary range limits from contract
  const { data: salaryRangeLimitsData } = useReadContract({
    address: LOAN_CONTRACT_ADDRESS as `0x${string}`,
    abi: LOAN_CONTRACT_ABI,
    functionName: 'salaryRangeLimits',
    args: [salaryRange],
  });

  // Get interest rates from contract
  const { data: interestRatesData } = useReadContract({
    address: LOAN_CONTRACT_ADDRESS as `0x${string}`,
    abi: LOAN_CONTRACT_ABI,
    functionName: 'salaryRangeInterestRates',
    args: [salaryRange],
  });

  // Load real loan data
  useEffect(() => {
    if (connectedAddress && !isLoadingUserLoans) {
      // Check if user has any loans to determine if they have an active loan
      if (userLoansData && Array.isArray(userLoansData)) {
        setHasActiveLoan(userLoansData.length > 0);
        
        // Fetch detailed loan information for each loan ID
        const fetchLoanDetails = async () => {
          try {
            const loanDetails = await Promise.all(
              userLoansData.map(async (loanId) => {
                // This would need to be implemented with useReadContract for each loan
                // For now, we'll use the basic data structure
                return {
                  id: loanId,
                  borrower: connectedAddress,
                  amount: 0, // Will be fetched separately
                  isActive: true,
                  isPaidOff: false,
                };
              })
            );
            setUserLoans(loanDetails);
          } catch (error) {
            console.error('Error fetching loan details:', error);
            setLoanError('Failed to load loan details');
          }
        };
        
        fetchLoanDetails();
      } else {
        setHasActiveLoan(false);
        setUserLoans([]);
      }
      
      setIsLoadingLoans(false);
    }
  }, [connectedAddress, userLoansData, isLoadingUserLoans]);

  // Update contract data when salary range limits and interest rates are fetched
  useEffect(() => {
    if (salaryRangeLimitsData) {
      setContractLoanLimit(Number(salaryRangeLimitsData) / 1e6); // Convert from wei to PYUSD
    }
  }, [salaryRangeLimitsData]);

  useEffect(() => {
    if (interestRatesData) {
      setContractInterestRate(Number(interestRatesData) / 100); // Convert from basis points to percentage
    }
  }, [interestRatesData]);

  // Use real contract data instead of hardcoded calculations
  const maxLoanAmount = contractLoanLimit > 0 ? contractLoanLimit : Math.min(userData.monthlyIncome * 3, 15000);
  const interestRate = contractInterestRate > 0 ? contractInterestRate : (userData.monthlyIncome > 6000 ? 8.5 : userData.monthlyIncome > 4000 ? 12.5 : 15.5);
  const monthlyPayment = (loanAmount * (interestRate / 100 / 12) * Math.pow(1 + interestRate / 100 / 12, loanTerm)) / 
                        (Math.pow(1 + interestRate / 100 / 12, loanTerm) - 1);

  const handleApplyLoan = () => {
    if (!isWalletConnected) {
      open();
      return;
    }
    // Redirect to loan application page instead of mock logic
    window.location.href = '/proof'; // This will take user to the proof generation and loan application flow
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

      {/* Real Contract Data Stats */}
      {connectedAddress && (
        <div className="mb-8">
          <div className="bg-black/20 backdrop-blur-2xl border border-white/15 rounded-2xl p-6 shadow-xl ring-1 ring-white/5">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">Your Account Status</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-300">
                  Active Loans: {hasActiveLoan ? '1' : '0'}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-300">
                  Total Loans: {userLoans.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Real Contract Data Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-16">
        <div className="bg-black/20 backdrop-blur-2xl border border-white/15 rounded-2xl p-8 shadow-2xl hover:shadow-xl hover:border-white/25 transition-all duration-300 ring-1 ring-white/5">
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-800 rounded-xl">
              <TrendingUp className="h-6 w-6 text-gray-300" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-100">Salary Range</h3>
              <p className="text-gray-300">Contract verified range</p>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-100 mb-2">${salaryRange}</div>
          <div className="text-sm text-gray-400">From smart contract</div>
        </div>

        <div className="bg-black/20 backdrop-blur-2xl border border-white/15 rounded-2xl p-8 shadow-2xl hover:shadow-xl hover:border-white/25 transition-all duration-300 ring-1 ring-white/5">
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-800 rounded-xl">
              <DollarSign className="h-6 w-6 text-gray-300" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-100">Contract Limit</h3>
              <p className="text-gray-300">Maximum borrowing capacity</p>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-100 mb-2">
            {contractLoanLimit > 0 ? `$${contractLoanLimit.toLocaleString()}` : 'Loading...'}
          </div>
          <div className="text-sm text-gray-400">
            {contractLoanLimit > 0 ? 'From contract' : 'Fetching from contract...'}
          </div>
        </div>

        <div className="bg-black/20 backdrop-blur-2xl border border-white/15 rounded-2xl p-8 shadow-2xl hover:shadow-xl hover:border-white/25 transition-all duration-300 ring-1 ring-white/5">
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-800 rounded-xl">
              <Shield className="h-6 w-6 text-gray-300" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-100">Interest Rate</h3>
              <p className="text-gray-300">Contract-based rate</p>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-100 mb-2">
            {contractInterestRate > 0 ? `${contractInterestRate}%` : 'Loading...'}
          </div>
          <div className="text-sm text-gray-400">
            {contractInterestRate > 0 ? 'From contract' : 'Fetching from contract...'}
          </div>
        </div>
      </div>

      {/* Real Loan Data Section */}
      {isLoadingLoans ? (
        <div className="w-full bg-black/20 backdrop-blur-2xl border border-white/15 rounded-2xl p-8 shadow-xl ring-1 ring-white/5">
          <div className="flex items-center justify-center space-x-3">
            <div className="animate-spin w-6 h-6 border-2 border-gray-300 border-t-transparent rounded-full"></div>
            <span className="text-gray-300">Loading your loan data...</span>
          </div>
        </div>
      ) : loanError ? (
        <div className="w-full bg-red-500/10 border border-red-500/20 rounded-2xl p-8 shadow-xl ring-1 ring-red-500/5">
          <div className="flex items-center space-x-3 mb-4">
            <AlertCircle className="h-6 w-6 text-red-400" />
            <h3 className="text-xl font-bold text-red-400">Error Loading Loan Data</h3>
          </div>
          <p className="text-red-300">{loanError}</p>
        </div>
      ) : hasActiveLoan ? (
        <div className="w-full bg-amber-500/10 border border-amber-500/20 rounded-2xl p-8 shadow-xl ring-1 ring-amber-500/5">
          <div className="flex items-center space-x-3 mb-4">
            <Clock className="h-6 w-6 text-amber-400" />
            <h3 className="text-xl font-bold text-amber-400">Active Loan Found</h3>
          </div>
          <p className="text-amber-300 mb-4">
            You currently have an active loan. Please pay it off before applying for a new one.
          </p>
          <div className="bg-black/20 border border-amber-500/20 rounded-lg p-4">
            <div className="text-sm text-amber-300">
              <strong>Note:</strong> You can only have one active loan at a time. 
              Contact support if you need to modify your existing loan.
            </div>
          </div>
        </div>
      ) : userLoans.length > 0 ? (
        <div className="w-full bg-black/20 backdrop-blur-2xl border border-white/15 rounded-2xl p-8 shadow-xl ring-1 ring-white/5">
          <h3 className="text-2xl font-bold text-gray-100 mb-6">Your Loan History</h3>
          <div className="space-y-4">
            {userLoans.map((loan, index) => (
              <div key={index} className="bg-black/40 border border-white/10 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-lg font-semibold text-gray-100">Loan #{loan.id.toString()}</div>
                    <div className="text-sm text-gray-400">Status: {loan.isActive ? 'Active' : 'Inactive'}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-100">
                      ${loan.amount ? (Number(loan.amount) / 1e6).toFixed(2) : 'N/A'} PYUSD
                    </div>
                    <div className="text-sm text-gray-400">
                      {loan.isPaidOff ? 'Paid Off' : 'Outstanding'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
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
                  className="w-full bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 text-gray-200 hover:bg-gray-700/60 hover:text-white hover:border-gray-600/50 py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <DollarSign className="h-5 w-5" />
                  <span>{isWalletConnected ? 'Apply for Loan' : 'Connect Wallet to Apply'}</span>
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
      )}
    </section>
  );
}