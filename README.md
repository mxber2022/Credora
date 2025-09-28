# 🏦 Credora - Zero-Knowledge PYUSD Borrowing Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Zero-Knowledge](https://img.shields.io/badge/Zero--Knowledge-Proofs-FF6B6B?logo=ethereum&logoColor=white)](https://z.cash/technology/zksnarks/)
[![Base](https://img.shields.io/badge/Base-Layer%202-0052FF?logo=base&logoColor=white)](https://base.org/)

> **Revolutionary zero-knowledge borrowing platform enabling undercollateralized loans in PayPal USD (PYUSD) using zkPDF-based proof of income and Anon Aadhaar identity verification.**

## 🌟 Overview

Credora is a cutting-edge zero-knowledge borrowing platform that enables users to access undercollateralized loans in PayPal USD (PYUSD) using advanced privacy-preserving technologies. Users can prove their income and identity without revealing sensitive personal information, enabling secure and private access to credit facilities backed by verified income capacity.

### 🎯 Key Features

- **🔐 Zero-Knowledge Proofs** - Privacy-preserving income verification without data exposure
- **📄 zkPDF Technology** - Verify digitally signed income documents using zk-SNARKs
- **💰 PYUSD Integration** - Access PayPal USD with transparent terms and instant settlement
- **🆔 Anon Aadhaar Integration** - Privacy-preserving Indian identity verification
- **🏦 Undercollateralized Borrowing** - Access credit based on verified income without locking crypto
- **🌐 Multi-Chain Support** - Built on Base testnet with cross-chain compatibility
- **🎨 Modern UI/UX** - Dark glassmorphism design with intuitive user experience
- **🔄 Real-time Data** - Live contract data fetching and dynamic credit calculations

## 🏗️ Architecture

```
Credora/
├── app/                          # Main React frontend application
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   │   ├── ui/              # Base UI components (Button, Card, etc.)
│   │   │   ├── sections/        # Page sections (LendingDashboard, LoanApplication)
│   │   │   ├── aadhaar/         # Anon Aadhaar verification components
│   │   │   └── services/        # Service integrations (aadhaarService, sp1Service)
│   │   ├── pages/               # Application pages (HomePage, ProofPage, LendingPage)
│   │   ├── hooks/               # Custom React hooks
│   │   └── providers/           # Context providers (AnonAadhaarProvider, AppKitProvider)
│   └── package.json
├── contract/                     # Smart contracts
│   ├── SalaryBasedLoanContract.sol  # Main lending contract
│   ├── AnonErc20.sol            # Anonymous ERC20 token
│   ├── AnonPayRegistration.sol  # Payment registration
│   └── Lending.sol              # Core lending logic
└── zkpdf/                       # Zero-knowledge PDF verification system
    ├── app/                     # Next.js demo frontend
    ├── circuits/                # SP1 zero-knowledge circuits
    │   ├── program/             # Main circuit program
    │   ├── script/              # Proof generation scripts
    │   └── contracts/           # Solidity smart contracts
    └── pdf-utils/               # PDF processing utilities
        ├── core/                # Core verification logic
        ├── extractor/           # PDF text extraction
        └── signature-validator/ # Digital signature validation
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **Rust** (latest stable)
- **SP1** (Succinct Prover)
- **Git**
- **MetaMask** or compatible wallet

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/credora.git
   cd credora
   ```

2. **Install frontend dependencies**
   ```bash
   cd app
   npm install
   ```

3. **Install PDF verification dependencies**
   ```bash
   cd ../zkpdf/app
   npm install
   ```

4. **Install Rust dependencies**
   ```bash
   cd ../zkpdf/circuits
   cargo build --release
   ```

### Development Setup

1. **Start the main application**
   ```bash
   cd app
   npm run dev
   ```
   Access at: `http://localhost:5173`

2. **Start PDF verification service**
   ```bash
   cd zkpdf/circuits/script
   RUST_LOG=info cargo run --release --bin prover
   ```
   API available at: `http://localhost:3002`

3. **Start PDF demo frontend** (optional)
   ```bash
   cd zkpdf/app
   npm run dev
   ```
   Access at: `http://localhost:3000`

## 🔧 Technology Stack

### Frontend
- **React 18** - Modern UI framework with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling with glassmorphism effects
- **Wagmi** - Ethereum integration and wallet connection
- **AppKit** - Multi-wallet connection interface
- **Lucide React** - Beautiful icon library

### Zero-Knowledge Proofs
- **SP1** - Succinct Prover for RISC-V programs
- **Groth16** - zk-SNARK proof system
- **Rust** - High-performance circuit development
- **WebAssembly** - Browser-compatible proof generation
- **PKCS#7** - Digital signature validation

### Blockchain & Lending
- **Base Testnet** - Layer 2 Ethereum scaling
- **PayPal USD (PYUSD)** - Digital currency for lending
- **Solidity** - Smart contract development
- **Foundry** - Development framework
- **Horizon Testnet** - Alternative testnet support

### Privacy & Identity
- **Anon Aadhaar** - Privacy-preserving Indian identity
- **Horizen Labs Relayer** - Proof aggregation service
- **Self Protocol** - Additional identity verification
- **Nullifier System** - Prevent duplicate applications

## 📋 Features

### 🔐 Privacy-Preserving Income Verification

- **PDF Document Processing** - Upload digitally signed payslips, tax returns, or invoices
- **Zero-Knowledge Proofs** - Generate proofs without revealing document contents
- **Digital Signature Validation** - Verify document authenticity using PKCS#7
- **Text Extraction** - Extract and verify specific information from PDFs
- **Salary Range Detection** - Automatically determine income brackets for credit limits

### 🆔 Multi-Identity Verification

- **Anon Aadhaar Integration** - Prove Indian citizenship without revealing Aadhaar number
- **Self Protocol** - Additional identity verification options
- **Age Verification** - Confirm age eligibility (18+) for lending
- **Location Verification** - Verify state and pincode for regional policies
- **Nullifier System** - Prevent duplicate applications and double-spending

### 💰 PYUSD Borrowing Features

- **Undercollateralized Loans** - Access PYUSD loans based on verified income without locking crypto
- **zkPDF Income Verification** - Prove income capacity using zero-knowledge proofs
- **PYUSD Integration** - Access digital PayPal USD with 6-decimal precision
- **Dynamic Credit Limits** - Risk-based lending limits based on verified income
- **Real-time Contract Data** - Live fetching of loan status, balances, and credit metrics
- **Instant Settlement** - Fast loan disbursement and repayment processing

### 🎨 User Experience

- **Dark Glassmorphism UI** - Modern, accessible design with smooth animations
- **Drag & Drop Upload** - Intuitive document upload interface
- **Real-time Status** - Live updates on verification progress
- **Mobile Responsive** - Optimized for all device sizes
- **Loading States** - Comprehensive loading indicators and progress tracking
- **Error Handling** - User-friendly error messages and recovery options

## 🔒 Security & Privacy

### Zero-Knowledge Proofs
- **Document Privacy** - PDF contents never leave user's device
- **Selective Disclosure** - Only reveal necessary information
- **Cryptographic Security** - Industry-standard encryption and hashing
- **Proof Verification** - On-chain verification of zero-knowledge proofs

### Smart Contract Security
- **Audited Contracts** - Professional security audits
- **Upgradeable Architecture** - Modular, secure upgrade paths
- **Access Controls** - Role-based permission system
- **Fund Safety** - Secure fund management and disbursement

### Data Protection
- **Local Processing** - All sensitive operations happen client-side
- **No Data Storage** - Personal information is never stored
- **GDPR Compliant** - Privacy-by-design architecture
- **Wallet Integration** - Secure wallet connection without data exposure

## 📊 Smart Contracts

### SalaryBasedLoanContract.sol
Main lending contract that handles:
- Income verification through zkPDF proofs
- Loan application and approval process
- PYUSD token integration
- Credit limit calculations based on salary ranges
- Loan status tracking and repayment

### Key Functions
```solidity
function verifySalaryProof(bytes calldata _publicValues, bytes calldata _proofBytes) 
    external returns (string memory, bool, bytes32, bytes32);

function applyForLoan(uint256 amount, uint256 termMonths, bytes32 documentCommitment) 
    external returns (uint256);

function approveLoan(uint256 loanId) external;
```

### Contract Addresses

#### Horizon Testnet (Chain ID: 845320009)
- **Loan Contract**: `0x4e6AE06ed9812C007Ec45C6b152389924C405b64`
- **PyUSD Token**: `0x1A463De40d1a508574a0Bd668Fbd063a5f161933`
- **RPC URL**: `https://horizon-testnet.rpc.succinct.xyz`

#### Celo Sepolia (Chain ID: 11142220)
- **Loan Contract**: `0xA0F8E21B7DeafB489563B5428e42d26745c9EA52`
- **PyUSD Token**: `0x8fd308C3F8596b5d4b563dc530DD84eBE69da656`
- **RPC URL**: `https://forno.celo-sepolia.celo-testnet.org`

#### Ethereum Sepolia (Chain ID: 11155111)
- **Loan Contract**: `0xF50c0F7c0Baa07bB8A2d3730B71639493956611F`
- **PyUSD Token**: `0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9`
- **RPC URL**: `https://sepolia.drpc.org`

#### Kadena Testnet (Chain ID: 5920)
- **Loan Contract**: `0xA0F8E21B7DeafB489563B5428e42d26745c9EA52`
- **PyUSD Token**: `0x8fd308C3F8596b5d4b563dc530DD84eBE69da656`
- **RPC URL**: `https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet/chain/20/evm/rpc`

## 🧪 Testing

### Unit Tests
```bash
# Frontend tests
cd app
npm run test

# PDF verification tests
cd zkpdf/pdf-utils
cargo test

# Circuit tests
cd zkpdf/circuits
cargo test
```

### Integration Tests
```bash
# End-to-end testing
npm run test:e2e

# Proof generation testing
cd zkpdf/circuits/script
cargo run --release -- --prove
```

### Manual Testing
1. Upload a digitally signed PDF document
2. Generate zero-knowledge proof
3. Connect wallet and verify identity
4. Apply for PYUSD loan
5. Monitor loan status and repayments

## 🚀 Deployment

### Frontend Deployment
```bash
cd app
npm run build
npm run preview
```

### Smart Contract Deployment
```bash
cd contract
forge build
forge deploy --rpc-url $RPC_URL --private-key $PRIVATE_KEY
```

### Production Setup
1. Configure environment variables
2. Deploy smart contracts to mainnet
3. Update frontend configuration
4. Deploy to Vercel/Netlify
5. Configure domain and SSL

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

### Code Style
- **TypeScript** - Strict type checking enabled
- **ESLint** - Automated code linting
- **Prettier** - Code formatting
- **Rust** - Standard rustfmt formatting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Succinct Labs** - SP1 zero-knowledge proof system
- **Horizen Labs** - Anon Aadhaar implementation
- **Base Protocol** - Layer 2 infrastructure
- **OpenZeppelin** - Smart contract libraries
- **Self Protocol** - Identity verification infrastructure
- **zkPDF Template** - [zkPDF Template Repository](https://github.com/mxber2022/zkpdfcredora) for PDF verification and zero-knowledge proof generation

## 📞 Support

- **Documentation**: [docs.credora.finance](https://docs.credora.finance)
- **Discord**: [discord.gg/credora](https://discord.gg/credora)
- **Twitter**: [@CredoraFinance](https://twitter.com/CredoraFinance)
- **Email**: support@credora.finance

## 🔮 Roadmap

### Phase 1 (Current)
- [x] PDF document verification with zkPDF
- [x] Anon Aadhaar integration
- [x] Basic lending functionality
- [x] Dark theme UI with glassmorphism
- [x] Real-time contract data integration
- [x] PYUSD token integration

### Phase 2 (Q2 2024)
- [ ] Multi-chain support (Polygon, Arbitrum)
- [ ] Advanced risk assessment algorithms
- [ ] Mobile application (React Native)
- [ ] API marketplace for third-party integrations
- [ ] Advanced privacy features

### Phase 3 (Q3 2024)
- [ ] Cross-border lending capabilities
- [ ] Institutional partnerships
- [ ] Governance token and DAO
- [ ] Advanced analytics dashboard
- [ ] Compliance and regulatory features

## 🎯 Use Cases

### Individual Borrowers
- **Salary-based Loans** - Access credit based on verified income
- **Privacy Protection** - Maintain financial privacy while accessing credit
- **Instant Access** - Quick loan approval and disbursement
- **Flexible Terms** - Customizable loan terms and repayment schedules

### Financial Institutions
- **Risk Assessment** - Zero-knowledge income verification
- **Compliance** - Privacy-preserving KYC/AML processes
- **Efficiency** - Automated loan processing and approval
- **Security** - Cryptographic proof of income without data exposure

### Developers
- **API Access** - Integrate zero-knowledge verification
- **SDK Support** - Easy integration with existing applications
- **Documentation** - Comprehensive guides and examples
- **Community** - Active developer community and support

---

**Built with ❤️ for a privacy-first financial future**

*Credora enables a new era of privacy-preserving finance where users can access credit based on verified income without compromising their personal data or financial privacy.*