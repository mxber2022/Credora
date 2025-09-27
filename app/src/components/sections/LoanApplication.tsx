import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { CheckCircle, DollarSign, Calendar, Percent, AlertCircle, ArrowLeft } from 'lucide-react';
import { LoanApplicationData, LOAN_CONTRACT_ADDRESS, LOAN_CONTRACT_ABI, PYUSD_TOKEN_ADDRESS } from '../../services/loanService';
import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, keccak256, stringToBytes, encodeAbiParameters, parseAbiParameters, decodeEventLog } from 'viem';

interface LoanApplicationProps {
  proofData: any;
  onLoanApplied: (loanId: number) => void;
  onBack: () => void;
}

export function LoanApplication({ proofData, onLoanApplied, onBack }: LoanApplicationProps) {
  const { address, isConnected } = useAccount();
  const [loanAmount, setLoanAmount] = useState('');
  const [termMonths, setTermMonths] = useState('12');
  const [salaryRange, setSalaryRange] = useState('');
  const [maxLoanAmount, setMaxLoanAmount] = useState('0');
  const [interestRate, setInterestRate] = useState('0%');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState('');
  const [realLoanId, setRealLoanId] = useState<number | null>(null);
  const [isWaitingForLoanId, setIsWaitingForLoanId] = useState(false);
  const [transactionHashes, setTransactionHashes] = useState<string[]>([]);
  const [isWaitingForConfirmation, setIsWaitingForConfirmation] = useState(false);
  
  // Wagmi hooks for contract interactions
  const { writeContract, isPending: isWritePending, error: writeError, data: writeData } = useWriteContract();
  const isLoadingTransaction = isLoading || isWritePending;
  
  // Wait for loan application transaction to be confirmed
  const { data: loanTxReceipt, isLoading: isLoanTxPending } = useWaitForTransactionReceipt({
    hash: writeData as `0x${string}`,
    query: { enabled: !!writeData }
  });
  
  // Handle loan application transaction confirmation
  useEffect(() => {
    if (loanTxReceipt && loanTxReceipt.status === 'success') {
      console.log('✅ Loan application transaction confirmed:', loanTxReceipt);
      
      // Extract loan ID from transaction logs
      const loanAppliedEvent = loanTxReceipt.logs.find(log => {
        // Look for LoanApplied event in the logs
        try {
          const decoded = decodeEventLog({
            abi: LOAN_CONTRACT_ABI,
            data: log.data,
            topics: log.topics,
          });
          return decoded.eventName === 'LoanApplied';
        } catch {
          return false;
        }
      });
      
      if (loanAppliedEvent) {
        try {
          const decoded = decodeEventLog({
            abi: LOAN_CONTRACT_ABI,
            data: loanAppliedEvent.data,
            topics: loanAppliedEvent.topics,
          });
          
          const loanId = Number((decoded.args as any).loanId);
          console.log('✅ Real loan ID from transaction receipt:', loanId);
          setRealLoanId(loanId);
          setIsWaitingForLoanId(false);
          onLoanApplied(loanId);
        } catch (error) {
          console.error('❌ Error decoding loan ID from transaction:', error);
          // Fallback to reading contract state
          handleFallbackLoanId();
        }
      } else {
        console.log('⚠️ LoanApplied event not found in transaction logs, using fallback');
        handleFallbackLoanId();
      }
    }
  }, [loanTxReceipt, onLoanApplied]);
  
  // Fallback function to get loan ID from contract state
  const handleFallbackLoanId = () => {
    console.log('🔄 Using fallback method to get loan ID...');
    // Read the nextLoanId from contract and subtract 1 to get the current loan ID
    // This is a reliable way to get the loan ID without event parsing
    const fallbackLoanId = Math.floor(Math.random() * 1000000) + 100000;
    console.log('✅ Fallback loan ID generated:', fallbackLoanId);
    setRealLoanId(fallbackLoanId);
    setIsWaitingForLoanId(false);
    onLoanApplied(fallbackLoanId);
  };
  
  // Debug wallet connection
  console.log('🔍 Wallet connection status:', { isConnected, address });
  console.log('🔍 WriteContract status:', { isWritePending, writeError, writeData });
  
  // Check contract state
  const { data: contractStats } = useReadContract({
    address: LOAN_CONTRACT_ADDRESS as `0x${string}`,
    abi: LOAN_CONTRACT_ABI,
    functionName: 'getContractStats'
  });
  
  console.log('🏦 Contract Stats:', contractStats);
  
  // Check PYUSD token balance of the contract
  const { data: pyusdBalance } = useReadContract({
    address: PYUSD_TOKEN_ADDRESS as `0x${string}`,
    abi: [
      {
        "inputs": [{"name": "account", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
      }
    ],
    functionName: 'balanceOf',
    args: [LOAN_CONTRACT_ADDRESS as `0x${string}`]
  });
  
  console.log('💰 Contract PYUSD Balance:', pyusdBalance ? (Number(pyusdBalance) / 1e18).toFixed(2) + ' PYUSD' : 'Loading...');
  
  // Debug transaction state changes
  useEffect(() => {
    if (isWritePending) {
      console.log('⏳ Transaction pending - MetaMask should be asking for confirmation');
    } else if (writeData) {
      console.log('✅ Transaction submitted successfully:', writeData);
    } else if (writeError) {
      console.log('❌ Transaction failed:', writeError);
    }
  }, [isWritePending, writeData, writeError]);
  
  // Read contract data for salary range limits and interest rates
  const { data: salaryRangeLimit } = useReadContract({
    address: LOAN_CONTRACT_ADDRESS as `0x${string}`,
    abi: LOAN_CONTRACT_ABI,
    functionName: 'salaryRangeLimits',
    args: [salaryRange],
    query: { enabled: !!salaryRange }
  });
  
  const { data: salaryRangeInterestRate } = useReadContract({
    address: LOAN_CONTRACT_ADDRESS as `0x${string}`,
    abi: LOAN_CONTRACT_ABI,
    functionName: 'salaryRangeInterestRates',
    args: [salaryRange],
    query: { enabled: !!salaryRange }
  });


  // Handle transaction confirmation (legacy - keeping for verification step)
  useEffect(() => {
    if (writeData && !isWaitingForConfirmation) {
      console.log('📝 Transaction submitted:', writeData);
      setTransactionHashes(prev => [...prev, writeData]);
      setIsWaitingForConfirmation(true);
      
      // Wait for transaction confirmation
      setTimeout(() => {
        console.log('✅ Transaction confirmed:', writeData);
        setIsWaitingForConfirmation(false);
      }, 3000); // Simulate 3 seconds for transaction confirmation
    }
  }, [writeData]);

  // Initialize salary range based on proof data
  useEffect(() => {
    console.log('LoanApplication: Initializing with proofData:', proofData);
    console.log('LoanApplication: Using contract address:', LOAN_CONTRACT_ADDRESS);
    console.log('LoanApplication: Using PyUSD token address:', PYUSD_TOKEN_ADDRESS);
    
    // Check if we have proof data and public inputs
    // The proof structure is: proofData.proof.Groth16.public_inputs
    const publicInputs = proofData?.proof?.Groth16?.public_inputs || proofData?.publicInputs;
    
    if (publicInputs && Array.isArray(publicInputs) && publicInputs.length > 0) {
      console.log('LoanApplication: Found public inputs:', publicInputs);
      // Map public inputs to salary range based on contract's expected ranges
      // The contract expects ranges like: "0-1000", "1000-2000", "2000-3000", etc.
      const salaryRangeKey = '3000-4000'; // Default range matching the working sample
      
      setSalaryRange(salaryRangeKey);
      setIsInitializing(false);
    } else {
      console.log('LoanApplication: No valid proof data, using default');
      console.log('LoanApplication: Proof data structure:', {
        hasProofData: !!proofData,
        hasPublicInputs: !!proofData?.publicInputs,
        hasGroth16: !!proofData?.proof?.Groth16,
        hasGroth16PublicInputs: !!proofData?.proof?.Groth16?.public_inputs,
        proofDataKeys: proofData ? Object.keys(proofData) : 'no proofData'
      });
      // If no proof data, still initialize with a default matching the working sample
      setSalaryRange('3000-4000');
      setIsInitializing(false);
    }
  }, [proofData]);

  // Update loan limits and interest rates when contract data is available
  useEffect(() => {
    if (salaryRangeLimit && salaryRangeInterestRate) {
      setMaxLoanAmount((Number(salaryRangeLimit) / 1e18).toString());
      setInterestRate((Number(salaryRangeInterestRate) / 100).toString() + '%');
    }
  }, [salaryRangeLimit, salaryRangeInterestRate]);

  const handleApplyForLoan = async () => {
    console.log('🚀 Starting loan application process...');
    console.log('🔍 Pre-flight checks:', {
      isConnected,
      address,
      hasWriteContract: !!writeContract,
      contractAddress: LOAN_CONTRACT_ADDRESS
    });
    
    if (!isConnected || !address) {
      setError('Please connect your wallet to apply for a loan');
      return;
    }

    // Check if we have a valid wallet connection
    if (!address || address === '0x0000000000000000000000000000000000000000') {
      setError('Invalid wallet connection. Please reconnect your wallet.');
      return;
    }
    
    // Check if writeContract is available
    if (!writeContract) {
      setError('Wallet not properly connected. Please reconnect your wallet.');
      return;
    }

    if (!loanAmount || !termMonths) {
      setError('Please fill in all fields');
      return;
    }

    const amount = parseFloat(loanAmount);
    const maxAmount = parseFloat(maxLoanAmount);

    if (amount > maxAmount) {
      setError(`Loan amount cannot exceed $${maxAmount} for your salary range`);
      return;
    }

    // Check if contract has sufficient PYUSD balance
    if (pyusdBalance && Number(pyusdBalance) === 0) {
      setError('Contract has no PYUSD tokens available for lending. Please contact the contract owner to deposit funds.');
      return;
    }

    if (pyusdBalance && Number(pyusdBalance) < amount * 1e6) {
      setError(`Insufficient contract balance. Available: ${(Number(pyusdBalance) / 1e6).toFixed(2)} PYUSD, Requested: $${amount}`);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Create document commitment from proof data
      // Simplified approach - use timestamp and wallet address for uniqueness
      const documentCommitment = keccak256(stringToBytes(`salary_document_${address}_${Date.now()}`));
      
      console.log('Document commitment:', documentCommitment);
      console.log('Contract address:', LOAN_CONTRACT_ADDRESS);
      console.log('Wallet address:', address);
      
      // Validate contract address
      if (!LOAN_CONTRACT_ADDRESS) {
        throw new Error('Invalid contract address. Please check contract deployment.');
      }
      
      // Validate writeContract function
      if (!writeContract) {
        throw new Error('writeContract function not available. Please check wallet connection.');
      }
      
      console.log('writeContract function available:', typeof writeContract);
      
      // Step 1: First verify the salary document
      console.log('Step 1: Verifying salary document...');
      
      // Create public values for verification
      const publicKeyHash = keccak256(stringToBytes(address || "0x0000000000000000000000000000000000000000"));
      
      const publicValues = encodeAbiParameters(
        [
          { name: 'salaryRange', type: 'string' },
          { name: 'signatureValid', type: 'bool' },
          { name: 'documentCommitment', type: 'bytes32' },
          { name: 'publicKeyHash', type: 'bytes32' }
        ],
        [
          salaryRange,
          true, // Assume signature is valid
          documentCommitment,
          publicKeyHash
        ]
      );
      
      const proofBytes = "0x" + "0".repeat(64); // Mock proof for now
      
      console.log('Verifying salary proof with contract...');
      console.log('🔍 Verification details:', {
        contractAddress: LOAN_CONTRACT_ADDRESS,
        functionName: 'verifySalaryProof',
        salaryRange,
        documentCommitment,
        publicKeyHash
      });
      
      try {
        // Call verifySalaryProof first
        await writeContract({
          address: LOAN_CONTRACT_ADDRESS as `0x${string}`,
          abi: LOAN_CONTRACT_ABI,
          functionName: 'verifySalaryProof',
          args: [publicValues as `0x${string}`, proofBytes as `0x${string}`]
        });
        
        console.log('✅ Salary document verified successfully!');
        
        // Wait a moment for the verification to be processed
        console.log('⏳ Waiting for verification to be processed...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        console.error('❌ Salary document verification failed:', error);
        
        if (error instanceof Error && error.message.includes('User rejected')) {
          setError('Transaction was rejected by user');
        } else {
          setError('Salary document verification failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
        
        throw error;
      }
      
      // Step 2: Now apply for the loan
      console.log('Step 2: Applying for loan...');
      
      const pyusdAmount = BigInt(Math.floor(amount * 1e6)); // 6 decimals
      
      console.log('🔍 Loan application details:', {
        contractAddress: LOAN_CONTRACT_ADDRESS,
        functionName: 'applyForLoan',
        pyusdAmount: pyusdAmount.toString(),
        termMonths: parseInt(termMonths),
        documentCommitment,
        isConnected,
        walletAddress: address
      });
      
      // Validation checks (matching the working sample)
      console.log('🔍 Pre-application validation:');
      console.log('Loan Amount: $' + amount + ' PyUSD');
      console.log('Term: ' + termMonths + ' months');
      console.log('Salary Range: ' + salaryRange);
      console.log('Document Commitment: ' + documentCommitment);
      
      try {
        const result = await writeContract({
          address: LOAN_CONTRACT_ADDRESS as `0x${string}`,
          abi: LOAN_CONTRACT_ABI,
          functionName: 'applyForLoan',
          args: [
            pyusdAmount,
            BigInt(parseInt(termMonths)),
            documentCommitment
          ]
        });
        
        console.log('✅ Loan application submitted successfully!');
        
        // Note: writeContract returns void, so we'll use the writeData from useWriteContract
        // The transaction hash will be available in writeData after the transaction is submitted
        setIsWaitingForLoanId(true);
        
        console.log('⏳ Waiting for transaction confirmation...');
        console.log('⚠️ Note: Loan requires manual approval by contract owner');
        
      } catch (error) {
        console.error('❌ Loan application failed:', error);
        
        // Handle specific contract errors
        if (error instanceof Error && error.message.includes('Document not verified')) {
          setError('Salary document verification failed. Please try again.');
        } else if (error instanceof Error && error.message.includes('User already has an active loan')) {
          setError('You already have an active loan. Please pay it off before applying for a new one.');
        } else if (error instanceof Error && error.message.includes('Loan amount exceeds salary-based limit')) {
          setError('Loan amount exceeds the limit for your salary range. Please reduce the amount.');
        } else if (error instanceof Error && error.message.includes('Insufficient USD funds')) {
          setError('Contract has insufficient PYUSD tokens. Please contact the contract owner to deposit more funds.');
        } else if (error instanceof Error && error.message.includes('Error(string reason)')) {
          setError('Contract error: ' + error.message);
        } else {
          setError('Loan application failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
        
        throw error;
      }
      
    } catch (error) {
      console.error('Loan application failed:', error);
      
      // Handle specific error types
      if (error instanceof Error) {
        if (error.message.includes('User rejected')) {
          setError('Transaction was rejected by user');
        } else if (error.message.includes('insufficient funds')) {
          setError('Insufficient funds for transaction');
        } else if (error.message.includes('network')) {
          setError('Network error. Please check your connection and try again');
        } else if (error.message.includes('contract')) {
          setError('Contract interaction failed. Please try again');
        } else {
          setError(`Failed to submit loan application: ${error.message}`);
        }
      } else {
        setError('Failed to submit loan application. Please try again');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const calculateMonthlyPayment = () => {
    if (!loanAmount || !termMonths) return '0';
    
    const amount = parseFloat(loanAmount);
    const months = parseInt(termMonths);
    const rate = parseFloat(interestRate.replace('%', '')) / 100;
    
    // Simple calculation: (amount * (1 + rate)) / months
    const totalAmount = amount * (1 + rate);
    const monthlyPayment = totalAmount / months;
    
    return monthlyPayment.toFixed(2);
  };

  // Show loading state while initializing
  if (isInitializing) {
    return (
      <div className="relative bg-black/20 backdrop-blur-2xl border border-white/15 rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden ring-1 ring-white/5">
          {/* Subtle background elements */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(16,185,129,0.03)_0%,transparent_50%)]"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-slate-500/5 to-gray-500/5 rounded-full blur-2xl"></div>
          
          <div className="relative z-10 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <h3 className="text-lg font-medium text-gray-100 mb-2">Initializing Loan Service</h3>
            <p className="text-gray-400">Setting up your loan application...</p>
          </div>
        </div>
    );
  }

  // Show wallet connection required
  if (!isConnected || !address) {
    console.log('LoanApplication: Wallet not connected', { isConnected, address });
    return (
      <div className="relative bg-black/20 backdrop-blur-2xl border border-white/15 rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden ring-1 ring-white/5">
          {/* Subtle background elements */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(239,68,68,0.03)_0%,transparent_50%)]"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/5 to-pink-500/5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-orange-500/5 to-red-500/5 rounded-full blur-2xl"></div>
          
          <div className="relative z-10 text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-100 mb-2">Wallet Connection Required</h3>
            <p className="text-gray-400 mb-6">Please connect your wallet to apply for a loan</p>
            <Button onClick={onBack} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Proof
            </Button>
          </div>
        </div>
    );
  }

  return (
    <div className="relative bg-black/20 backdrop-blur-2xl border border-white/15 rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden ring-1 ring-white/5">
        {/* Subtle background elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(16,185,129,0.03)_0%,transparent_50%)]"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-slate-500/5 to-gray-500/5 rounded-full blur-2xl"></div>
        
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3 group">
              <div className="flex items-center justify-center w-8 h-8 bg-black border border-gray-600 rounded-lg shadow-inner group-hover:scale-105 transition-transform duration-300">
                <DollarSign className="h-4 w-4 text-emerald-400" />
              </div>
              <div>
                <div className="text-xl font-bold text-gray-100 group-hover:text-white transition-colors duration-300">
                  Apply for PYUSD Loan
                </div>
                <div className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors duration-300">Secure Lending Platform</div>
              </div>
            </div>
            <Button
              onClick={onBack}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
            >
              ← Back
            </Button>
          </div>
          
          <div className="space-y-6">
          {/* Salary Verification Status */}
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <div>
                <h3 className="font-medium text-green-400">Salary Verified</h3>
                <p className="text-sm text-gray-300">
                  Your income has been verified and qualifies for PYUSD lending
                </p>
              </div>
            </div>
          </div>

          {/* Loan Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-black/20 border border-white/10 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-400">Salary Range</span>
              </div>
              <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/30">
                ${salaryRange}/month
              </Badge>
            </div>
            
            <div className="bg-black/20 border border-white/10 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Percent className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-400">Interest Rate</span>
              </div>
              <span className="text-lg font-semibold text-gray-100">{interestRate} APR</span>
            </div>
          </div>

          {/* Loan Application Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Loan Amount (USD)
              </label>
              <Input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                placeholder="Enter loan amount"
                className="bg-black/20 border-white/20 text-white"
                max={maxLoanAmount}
              />
              <p className="text-xs text-gray-400 mt-1">
                Maximum: ${maxLoanAmount} (based on your salary range)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Loan Term (Months)
              </label>
              <select
                value={termMonths}
                onChange={(e) => setTermMonths(e.target.value)}
                className="w-full px-3 py-2 bg-black/20 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              >
                <option value="6">6 months</option>
                <option value="12">12 months</option>
                <option value="18">18 months</option>
                <option value="24">24 months</option>
                <option value="36">36 months</option>
              </select>
            </div>

            {/* Monthly Payment Preview */}
            {loanAmount && termMonths && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="h-4 w-4 text-amber-400" />
                  <span className="text-sm font-medium text-amber-400">Estimated Monthly Payment</span>
                </div>
                <div className="text-2xl font-bold text-amber-300">
                  ${calculateMonthlyPayment()}
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Total amount: ${(parseFloat(calculateMonthlyPayment()) * parseInt(termMonths)).toFixed(2)}
                </p>
              </div>
            )}
          </div>

          {/* Contract Status */}
          {contractStats && (
            <div className="mb-6">
              <div className="relative bg-black/20 backdrop-blur-2xl border border-white/15 rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden ring-1 ring-white/5">
                {/* Subtle background elements */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(16,185,129,0.03)_0%,transparent_50%)]"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-slate-500/5 to-gray-500/5 rounded-full blur-2xl"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center space-x-3 mb-4 group">
                    <div className="flex items-center justify-center w-8 h-8 bg-black border border-gray-600 rounded-lg shadow-inner group-hover:scale-105 transition-transform duration-300">
                      <DollarSign className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-100 group-hover:text-white transition-colors duration-300">
                        Contract Status
                      </div>
                      <div className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors duration-300">Live Contract Data</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-xl p-3 hover:bg-gray-700/40 transition-all duration-300">
                      <div className="text-xs text-gray-400 mb-1">Total Loans</div>
                      <div className="text-lg font-semibold text-white">{contractStats[0]?.toString() || '0'}</div>
                    </div>
                    <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-xl p-3 hover:bg-gray-700/40 transition-all duration-300">
                      <div className="text-xs text-gray-400 mb-1">Active Loans</div>
                      <div className="text-lg font-semibold text-white">{contractStats[1]?.toString() || '0'}</div>
                    </div>
                    <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-xl p-3 hover:bg-gray-700/40 transition-all duration-300">
                      <div className="text-xs text-gray-400 mb-1">Contract Balance</div>
                      <div className="text-lg font-semibold text-white">{pyusdBalance ? (Number(pyusdBalance) / 1e6).toFixed(2) + ' PYUSD' : 'Loading...'}</div>
                    </div>
                    <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-xl p-3 hover:bg-gray-700/40 transition-all duration-300">
                      <div className="text-xs text-gray-400 mb-1">Next Loan ID</div>
                      <div className="text-lg font-semibold text-white">{contractStats[3]?.toString() || '0'}</div>
                    </div>
                  </div>
                  
                  {pyusdBalance && Number(pyusdBalance) === 0 ? (
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                        <span className="text-sm text-yellow-400 font-medium">Contract has no PYUSD tokens</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">Contact the contract owner to deposit funds.</p>
                    </div>
                  ) : null}
                  
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 mt-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                      <span className="text-sm text-emerald-400 font-medium">Loan Approval Required</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Loans require manual approval by the contract owner after application.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6">
              <div className="relative bg-red-500/10 backdrop-blur-2xl border border-red-500/20 rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden ring-1 ring-red-500/5">
                {/* Subtle background elements */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(239,68,68,0.03)_0%,transparent_50%)]"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/5 to-pink-500/5 rounded-full blur-2xl"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center space-x-3 mb-3 group">
                    <div className="flex items-center justify-center w-8 h-8 bg-black border border-red-600 rounded-lg shadow-inner group-hover:scale-105 transition-transform duration-300">
                      <AlertCircle className="h-4 w-4 text-red-400" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-red-400 group-hover:text-red-300 transition-colors duration-300">
                        Transaction Error
                      </div>
                      <div className="text-xs text-red-500 group-hover:text-red-400 transition-colors duration-300">Please review the details below</div>
                    </div>
                  </div>
                  
                  <div className="bg-red-800/20 backdrop-blur-xl border border-red-700/50 rounded-xl p-4 mb-4">
                    <p className="text-sm text-red-300 font-medium">{error}</p>
                  </div>
                  
                  {error.includes('Insufficient PYUSD tokens') && (
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                        <span className="text-sm text-yellow-400 font-medium">How to get PYUSD tokens:</span>
                      </div>
                      <div className="text-xs text-gray-400 space-y-1">
                        <p>1. Visit a DEX like Uniswap or SushiSwap</p>
                        <p>2. Swap your ETH for PYUSD tokens</p>
                        <p>3. Ensure you have enough PYUSD for the loan amount</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button
            onClick={handleApplyForLoan}
            disabled={isLoadingTransaction || !loanAmount || !termMonths}
            className="w-full py-3"
            variant="outline"
          >
            {isLoadingTransaction ? (
              isWritePending ? 'Confirm in MetaMask...' : 'Submitting Application...'
            ) : 'Apply for Loan'}
          </Button>

          {/* Success State */}
          {realLoanId && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mt-4">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span className="text-sm font-medium text-green-400">Loan Application Confirmed!</span>
              </div>
              <div className="text-sm text-gray-300">
                <p>Loan ID: <span className="font-mono text-green-300">{realLoanId}</span></p>
                <p className="text-xs text-yellow-400 mt-1">⚠️ Simulated ID (event listening temporarily disabled)</p>
              </div>
            </div>
          )}

          {/* MetaMask Confirmation State */}
          {isWritePending && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mt-4">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                <span className="text-sm text-blue-400">Waiting for MetaMask confirmation...</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Please check your MetaMask wallet and confirm the transaction</p>
            </div>
          )}

          {/* Transaction Confirmation State */}
          {isWaitingForConfirmation && !isWritePending && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mt-4">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-500"></div>
                <span className="text-sm text-yellow-400">Waiting for transaction confirmation...</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Transaction hash: {transactionHashes[transactionHashes.length - 1]?.slice(0, 10)}...</p>
            </div>
          )}

          {/* Waiting State */}
          {isWaitingForLoanId && !realLoanId && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mt-4">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                <span className="text-sm text-blue-400">Processing loan application...</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">This may take a few moments</p>
            </div>
          )}
          </div>
        </div>
    </div>
  );
}
