// Loan application service for integrating with SalaryBasedLoanContract
// 
// ✅ CONTRACT ADDRESSES (Horizon Testnet):
// - Loan Contract: 0x4e6AE06ed9812C007Ec45C6b152389924C405b64
// - PyUSD Token: 0x1A463De40d1a508574a0Bd668Fbd063a5f161933
//
// ⚠️  REMAINING ISSUES:
// 1. This service uses ethers.js but the app now uses wagmi hooks
// 2. There's a data structure mismatch between SP1 proof data and contract expectations
// 3. The contract expects (string, bool, bytes32, bytes32) but SP1 provides [number, number]
//
// ✅ CURRENT STATUS: The LoanApplication component uses wagmi hooks directly
// This service is kept for reference but should not be used in production

export interface LoanApplicationData {
  amount: number;
  termMonths: number;
  salaryRange: string;
  documentCommitment: string;
}

export interface LoanDetails {
  loanId: number;
  amount: string;
  interestRate: string;
  termMonths: number;
  monthlyPayment: string;
  totalAmount: string;
  salaryRange: string;
}

// ⚠️ DEPRECATED: This class is not used anymore
// The LoanApplication component uses wagmi hooks directly
export class LoanService {
  private contract: any; // ethers.Contract - removed ethers import
  private provider: any; // ethers.Provider - removed ethers import  
  private signer: any;   // ethers.Signer - removed ethers import

  constructor(contractAddress: string, abi: any, provider: any, signer: any) {
    // this.contract = new ethers.Contract(contractAddress, abi, signer); // Removed ethers
    this.provider = provider;
    this.signer = signer;
  }

  /**
   * ⚠️ DEPRECATED: This method is not used anymore
   * Verify salary proof with the smart contract
   */
  async verifySalaryProof(publicValues: string, proofBytes: string): Promise<{
    salaryRange: string;
    signatureValid: boolean;
    documentCommitment: string;
    publicKeyHash: string;
  }> {
    try {
      const tx = await this.contract.verifySalaryProof(publicValues, proofBytes);
      const receipt = await tx.wait();
      
      // Parse events to get verification results
      const event = receipt.logs.find((log: any) => 
        log.topics[0] === this.contract.interface.getEvent('SalaryDocumentVerified').topicHash
      );
      
      if (event) {
        const decoded = this.contract.interface.parseLog(event);
        return {
          salaryRange: decoded.args.salaryRange,
          signatureValid: true,
          documentCommitment: decoded.args.documentCommitment,
          publicKeyHash: '0x' // Extract from event if needed
        };
      }
      
      throw new Error('Verification event not found');
    } catch (error) {
      console.error('Salary proof verification failed:', error);
      throw error;
    }
  }

  /**
   * Apply for a loan based on verified salary
   */
  async applyForLoan(application: LoanApplicationData): Promise<number> {
    try {
      const amountWei = "0"; // ethers.parseEther(application.amount.toString()); // Removed ethers
      const documentCommitment = application.documentCommitment;
      
      const tx = await this.contract.applyForLoan(
        amountWei,
        application.termMonths,
        documentCommitment
      );
      
      const receipt = await tx.wait();
      
      // Get loan ID from event
      const event = receipt.logs.find((log: any) => 
        log.topics[0] === this.contract.interface.getEvent('LoanApplied').topicHash
      );
      
      if (event) {
        const decoded = this.contract.interface.parseLog(event);
        return Number(decoded.args.loanId);
      }
      
      throw new Error('Loan application event not found');
    } catch (error) {
      console.error('Loan application failed:', error);
      throw error;
    }
  }

  /**
   * Get loan details
   */
  async getLoanDetails(loanId: number): Promise<LoanDetails> {
    try {
      const loan = await this.contract.getLoanDetails(loanId);
      
      return {
        loanId: Number(loan.loanId),
        amount: "0", // ethers.formatEther(loan.amount), // Removed ethers
        interestRate: "0%", // (Number(loan.interestRate) / 100).toString() + '%', // Removed ethers
        termMonths: Number(loan.termMonths),
        monthlyPayment: "0", // ethers.formatEther(loan.monthlyPayment), // Removed ethers
        totalAmount: "0", // ethers.formatEther(loan.totalAmount), // Removed ethers
        salaryRange: loan.salaryRange
      };
    } catch (error) {
      console.error('Failed to get loan details:', error);
      throw error;
    }
  }

  /**
   * Get user's loan history
   */
  async getUserLoans(userAddress: string): Promise<number[]> {
    try {
      const loanIds = await this.contract.getUserLoans(userAddress);
      return loanIds.map(id => Number(id));
    } catch (error) {
      console.error('Failed to get user loans:', error);
      throw error;
    }
  }

  /**
   * Check if document is verified
   */
  async isDocumentVerified(documentCommitment: string): Promise<boolean> {
    try {
      return await this.contract.isDocumentVerified(documentCommitment);
    } catch (error) {
      console.error('Failed to check document verification:', error);
      return false;
    }
  }

  /**
   * Get salary range limits for a specific range
   */
  async getSalaryRangeLimit(salaryRange: string): Promise<string> {
    try {
      const limit = await this.contract.salaryRangeLimits(salaryRange);
      return "0"; // ethers.formatEther(limit); // Removed ethers
    } catch (error) {
      console.error('Failed to get salary range limit:', error);
      return '0';
    }
  }

  /**
   * Get interest rate for a specific salary range
   */
  async getInterestRate(salaryRange: string): Promise<string> {
    try {
      const rate = await this.contract.salaryRangeInterestRates(salaryRange);
      return (Number(rate) / 100).toString() + '%';
    } catch (error) {
      console.error('Failed to get interest rate:', error);
      return '0%';
    }
  }

  /**
   * Get contract statistics
   */
  async getContractStats(): Promise<{
    totalLoansIssued: number;
    totalActiveLoans: number;
    contractBalance: string;
    nextLoanId: number;
  }> {
    try {
      const stats = await this.contract.getContractStats();
      return {
        totalLoansIssued: Number(stats._totalLoansIssued),
        totalActiveLoans: Number(stats._totalActiveLoans),
        contractBalance: "0", // ethers.formatEther(stats._contractBalance), // Removed ethers
        nextLoanId: Number(stats._nextLoanId)
      };
    } catch (error) {
      console.error('Failed to get contract stats:', error);
      throw error;
    }
  }
}

// Contract ABI for SalaryBasedLoanContract
export const LOAN_CONTRACT_ABI = [
  {
    "inputs": [
      {"name": "_publicValues", "type": "bytes", "internalType": "bytes calldata"},
      {"name": "_proofBytes", "type": "bytes", "internalType": "bytes calldata"}
    ],
    "name": "verifySalaryProof",
    "outputs": [
      {"name": "", "type": "string", "internalType": "string memory"},
      {"name": "", "type": "bool", "internalType": "bool"},
      {"name": "", "type": "bytes32", "internalType": "bytes32"},
      {"name": "", "type": "bytes32", "internalType": "bytes32"}
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "amount", "type": "uint256", "internalType": "uint256"},
      {"name": "termMonths", "type": "uint256", "internalType": "uint256"},
      {"name": "documentCommitment", "type": "bytes32", "internalType": "bytes32"}
    ],
    "name": "applyForLoan",
    "outputs": [
      {"name": "", "type": "uint256", "internalType": "uint256"}
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "loanId", "type": "uint256", "internalType": "uint256"}
    ],
    "name": "getLoanDetails",
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "tuple(uint256 loanId, address borrower, uint256 amount, uint256 interestRate, uint256 termMonths, uint256 monthlyPayment, uint256 totalAmount, uint256 remainingBalance, uint256 startTime, uint256 lastPaymentTime, bool isActive, bool isPaidOff, string salaryRange, bytes32 documentCommitment)",
        "components": [
          {"name": "loanId", "type": "uint256", "internalType": "uint256"},
          {"name": "borrower", "type": "address", "internalType": "address"},
          {"name": "amount", "type": "uint256", "internalType": "uint256"},
          {"name": "interestRate", "type": "uint256", "internalType": "uint256"},
          {"name": "termMonths", "type": "uint256", "internalType": "uint256"},
          {"name": "monthlyPayment", "type": "uint256", "internalType": "uint256"},
          {"name": "totalAmount", "type": "uint256", "internalType": "uint256"},
          {"name": "remainingBalance", "type": "uint256", "internalType": "uint256"},
          {"name": "startTime", "type": "uint256", "internalType": "uint256"},
          {"name": "lastPaymentTime", "type": "uint256", "internalType": "uint256"},
          {"name": "isActive", "type": "bool", "internalType": "bool"},
          {"name": "isPaidOff", "type": "bool", "internalType": "bool"},
          {"name": "salaryRange", "type": "string", "internalType": "string"},
          {"name": "documentCommitment", "type": "bytes32", "internalType": "bytes32"}
        ]
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "user", "type": "address", "internalType": "address"}
    ],
    "name": "getUserLoans",
    "outputs": [
      {"name": "", "type": "uint256[]", "internalType": "uint256[]"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "documentCommitment", "type": "bytes32", "internalType": "bytes32"}
    ],
    "name": "isDocumentVerified",
    "outputs": [
      {"name": "", "type": "bool", "internalType": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "salaryRange", "type": "string", "internalType": "string memory"}
    ],
    "name": "salaryRangeLimits",
    "outputs": [
      {"name": "", "type": "uint256", "internalType": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "salaryRange", "type": "string", "internalType": "string memory"}
    ],
    "name": "salaryRangeInterestRates",
    "outputs": [
      {"name": "", "type": "uint256", "internalType": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getContractStats",
    "outputs": [
      {"name": "", "type": "uint256", "internalType": "uint256"},
      {"name": "", "type": "uint256", "internalType": "uint256"},
      {"name": "", "type": "uint256", "internalType": "uint256"},
      {"name": "", "type": "uint256", "internalType": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "loanId", "type": "uint256", "internalType": "uint256"},
      {"indexed": true, "name": "borrower", "type": "address", "internalType": "address"},
      {"indexed": false, "name": "amount", "type": "uint256", "internalType": "uint256"},
      {"indexed": false, "name": "salaryRange", "type": "string", "internalType": "string"},
      {"indexed": false, "name": "interestRate", "type": "uint256", "internalType": "uint256"}
    ],
    "name": "LoanApplied",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "documentCommitment", "type": "bytes32", "internalType": "bytes32"},
      {"indexed": false, "name": "salaryRange", "type": "string", "internalType": "string"},
      {"indexed": true, "name": "borrower", "type": "address", "internalType": "address"}
    ],
    "name": "SalaryDocumentVerified",
    "type": "event"
  }
] as const;

// Network-specific contract addresses
export const NETWORK_CONFIG = {
  horizon: {
    LOAN_CONTRACT_ADDRESS: "0x4e6AE06ed9812C007Ec45C6b152389924C405b64",
    PYUSD_TOKEN_ADDRESS: "0x1A463De40d1a508574a0Bd668Fbd063a5f161933",
    CHAIN_ID: 845320009,
    RPC_URL: "https://horizon-testnet.rpc.succinct.xyz"
  },
  celoSepolia: {
    LOAN_CONTRACT_ADDRESS: "0xA0F8E21B7DeafB489563B5428e42d26745c9EA52",
    PYUSD_TOKEN_ADDRESS: "0x8fd308C3F8596b5d4b563dc530DD84eBE69da656",
    CHAIN_ID: 11142220,
    RPC_URL: "https://forno.celo-sepolia.celo-testnet.org"
  },
  ethereumSepolia: {
    LOAN_CONTRACT_ADDRESS: "0xF50c0F7c0Baa07bB8A2d3730B71639493956611F",
    PYUSD_TOKEN_ADDRESS: "0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9",
    CHAIN_ID: 11155111,
    RPC_URL: "https://sepolia.drpc.org"
  },
  kadenaTestnet: {
    LOAN_CONTRACT_ADDRESS: "0xA0F8E21B7DeafB489563B5428e42d26745c9EA52",
    PYUSD_TOKEN_ADDRESS: "0x8fd308C3F8596b5d4b563dc530DD84eBE69da656",
    CHAIN_ID: 5920,
    RPC_URL: "https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet/chain/20/evm/rpc"
  }
};

// Default to Horizon Testnet (current active network)
export const LOAN_CONTRACT_ADDRESS = NETWORK_CONFIG.horizon.LOAN_CONTRACT_ADDRESS;
export const PYUSD_TOKEN_ADDRESS = NETWORK_CONFIG.horizon.PYUSD_TOKEN_ADDRESS;

// Network selection helper
export const getContractAddresses = (network: keyof typeof NETWORK_CONFIG = 'horizon') => {
  return NETWORK_CONFIG[network];
};
