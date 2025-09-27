// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ISP1Verifier} from "@sp1-contracts/ISP1Verifier.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @title SalaryBasedLoanContract
/// @author Succinct Labs
/// @notice This contract allows users to take out loans based on their verified salary ranges
contract SalaryBasedLoanContract {
    
    // Loan structure
    struct Loan {
        uint256 loanId;
        address borrower;
        uint256 amount;
        uint256 interestRate;
        uint256 termMonths;
        uint256 monthlyPayment;
        uint256 totalAmount;
        uint256 remainingBalance;
        uint256 startTime;
        uint256 lastPaymentTime;
        bool isActive;
        bool isPaidOff;
        string salaryRange;
        bytes32 documentCommitment;
    }

    // Salary ranges and their corresponding loan limits
    mapping(string => uint256) public salaryRangeLimits;
    mapping(string => uint256) public salaryRangeInterestRates;
    
    // User loan data
    mapping(address => uint256[]) public userLoans;
    mapping(uint256 => Loan) public loans;
    mapping(address => bool) public hasActiveLoan;
    
    // Document verification tracking
    mapping(bytes32 => bool) public verifiedDocuments;
    mapping(bytes32 => string) public documentSalaryRanges;
    
    // Contract state
    uint256 public nextLoanId = 1;
    uint256 public totalLoansIssued = 0;
    uint256 public totalActiveLoans = 0;
    uint256 public contractBalance = 0;
    
    // SP1 Verifier for salary proof verification
    address public verifier;
    bytes32 public salaryProgramVKey;
    
    // USD Token for loans
    IERC20 public usdToken;
    
    // Contract owner
    address public owner;

    // Events
    event LoanApplied(
        uint256 indexed loanId,
        address indexed borrower,
        uint256 amount,
        string salaryRange,
        uint256 interestRate
    );
    
    event LoanApproved(
        uint256 indexed loanId,
        address indexed borrower,
        uint256 amount,
        uint256 interestRate,
        uint256 termMonths
    );
    
    event LoanRejected(
        uint256 indexed loanId,
        address indexed borrower,
        string reason
    );
    
    event PaymentMade(
        uint256 indexed loanId,
        address indexed borrower,
        uint256 paymentAmount,
        uint256 remainingBalance
    );
    
    event LoanPaidOff(
        uint256 indexed loanId,
        address indexed borrower,
        uint256 totalPaid
    );
    
    event SalaryDocumentVerified(
        bytes32 indexed documentCommitment,
        string salaryRange,
        address indexed borrower
    );

    constructor(address _verifier, bytes32 _salaryProgramVKey, address _usdToken) {
        owner = msg.sender;
        verifier = _verifier;
        salaryProgramVKey = _salaryProgramVKey;
        usdToken = IERC20(_usdToken);
        
        // Initialize salary range limits (in USD - stored as wei for precision)
        salaryRangeLimits["0-1000"] = 100 * 1e18;        // $100 max
        salaryRangeLimits["1000-2000"] = 500 * 1e18;     // $500 max
        salaryRangeLimits["2000-3000"] = 1000 * 1e18;    // $1,000 max
        salaryRangeLimits["3000-4000"] = 2000 * 1e18;   // $2,000 max
        salaryRangeLimits["4000-5000"] = 3000 * 1e18;   // $3,000 max
        salaryRangeLimits["5000-6000"] = 5000 * 1e18;   // $5,000 max
        salaryRangeLimits["6000-7000"] = 8000 * 1e18;   // $8,000 max
        salaryRangeLimits["7000-8000"] = 12000 * 1e18;  // $12,000 max
        salaryRangeLimits["8000-9000"] = 15000 * 1e18;  // $15,000 max
        salaryRangeLimits["9000-10000"] = 20000 * 1e18; // $20,000 max
        salaryRangeLimits["10000+"] = 50000 * 1e18;     // $50,000 max
        
        // Initialize interest rates (in basis points, 100 = 1%)
        salaryRangeInterestRates["0-1000"] = 2000;      // 20% APR
        salaryRangeInterestRates["1000-2000"] = 1500;   // 15% APR
        salaryRangeInterestRates["2000-3000"] = 1200;   // 12% APR
        salaryRangeInterestRates["3000-4000"] = 1000;   // 10% APR
        salaryRangeInterestRates["4000-5000"] = 800;    // 8% APR
        salaryRangeInterestRates["5000-6000"] = 600;    // 6% APR
        salaryRangeInterestRates["6000-7000"] = 500;    // 5% APR
        salaryRangeInterestRates["7000-8000"] = 400;    // 4% APR
        salaryRangeInterestRates["8000-9000"] = 300;    // 3% APR
        salaryRangeInterestRates["9000-10000"] = 250;   // 2.5% APR
        salaryRangeInterestRates["10000+"] = 200;       // 2% APR
    }

    /// @notice Verify salary document proof and store verification
    /// @param _publicValues The encoded public values from salary proof
    /// @param _proofBytes The encoded proof
    function verifySalaryProof(bytes calldata _publicValues, bytes calldata _proofBytes)
        external
        returns (string memory, bool, bytes32, bytes32)
    {
        // TODO: Comment out on-chain proof verification for now
        // ISP1Verifier(verifier).verifyProof(salaryProgramVKey, _publicValues, _proofBytes);
        
        // Decode public values directly from proof data
        (string memory salaryRange, bool signatureValid, bytes32 documentCommitment, bytes32 publicKeyHash) = 
            abi.decode(_publicValues, (string, bool, bytes32, bytes32));
        
        // Store verification results (without actual proof verification)
        verifiedDocuments[documentCommitment] = true;
        documentSalaryRanges[documentCommitment] = salaryRange;
        
        emit SalaryDocumentVerified(documentCommitment, salaryRange, msg.sender);
        
        return (salaryRange, signatureValid, documentCommitment, publicKeyHash);
    }

    /// @notice Apply for a loan with salary verification
    /// @param amount The loan amount requested
    /// @param termMonths The loan term in months
    /// @param documentCommitment The document commitment from salary verification
    function applyForLoan(
        uint256 amount,
        uint256 termMonths,
        bytes32 documentCommitment
    ) external returns (uint256) {
        require(amount > 0, "Loan amount must be greater than 0");
        require(termMonths >= 1 && termMonths <= 60, "Term must be between 1 and 60 months");
        require(!hasActiveLoan[msg.sender], "User already has an active loan");
        require(usdToken.balanceOf(address(this)) >= amount, "Insufficient USD funds");
        require(verifiedDocuments[documentCommitment], "Document not verified");
        
        // Get salary range from verified document
        string memory salaryRange = documentSalaryRanges[documentCommitment];
        require(bytes(salaryRange).length > 0, "Salary range not found");
        
        // Check if salary range is valid
        require(salaryRangeLimits[salaryRange] > 0, "Invalid salary range");
        
        // Check if requested amount is within salary-based limit
        require(amount <= salaryRangeLimits[salaryRange], "Loan amount exceeds salary-based limit");
        
        // Calculate interest rate based on salary range
        uint256 interestRate = salaryRangeInterestRates[salaryRange];
        require(interestRate > 0, "Interest rate not set for this salary range");
        
        // Create loan application
        uint256 loanId = nextLoanId++;
        Loan storage loan = loans[loanId];
        
        loan.loanId = loanId;
        loan.borrower = msg.sender;
        loan.amount = amount;
        loan.interestRate = interestRate;
        loan.termMonths = termMonths;
        loan.salaryRange = salaryRange;
        loan.documentCommitment = documentCommitment;
        loan.startTime = block.timestamp;
        loan.lastPaymentTime = block.timestamp;
        loan.isActive = false;
        loan.isPaidOff = false;
        
        // Calculate monthly payment and total amount
        (uint256 monthlyPayment, uint256 totalAmount) = calculateLoanPayment(amount, interestRate, termMonths);
        loan.monthlyPayment = monthlyPayment;
        loan.totalAmount = totalAmount;
        loan.remainingBalance = totalAmount;
        
        // Add to user's loans
        userLoans[msg.sender].push(loanId);
        
        emit LoanApplied(loanId, msg.sender, amount, salaryRange, interestRate);
        
        return loanId;
    }

    /// @notice Approve a loan application
    /// @param loanId The loan ID to approve
    function approveLoan(uint256 loanId) external onlyOwner {
        Loan storage loan = loans[loanId];
        require(loan.borrower != address(0), "Loan does not exist");
        require(!loan.isActive, "Loan is already active");
        require(!loan.isPaidOff, "Loan is already paid off");
        
        // Mark loan as active
        loan.isActive = true;
        hasActiveLoan[loan.borrower] = true;
        
        // Update contract state
        totalLoansIssued++;
        totalActiveLoans++;
        
        // Transfer USD funds to borrower
        require(usdToken.transfer(loan.borrower, loan.amount), "USD transfer failed");
        
        emit LoanApproved(loanId, loan.borrower, loan.amount, loan.interestRate, loan.termMonths);
    }

    /// @notice Reject a loan application
    /// @param loanId The loan ID to reject
    /// @param reason The reason for rejection
    function rejectLoan(uint256 loanId, string memory reason) external onlyOwner {
        Loan storage loan = loans[loanId];
        require(loan.borrower != address(0), "Loan does not exist");
        require(!loan.isActive, "Loan is already active");
        require(!loan.isPaidOff, "Loan is already paid off");
        
        // Mark loan as inactive (rejected)
        loan.isActive = false;
        
        emit LoanRejected(loanId, loan.borrower, reason);
    }

    /// @notice Make a loan payment
    /// @param loanId The loan ID to make payment for
    /// @param paymentAmount The USD amount to pay
    function makePayment(uint256 loanId, uint256 paymentAmount) external {
        Loan storage loan = loans[loanId];
        require(loan.borrower == msg.sender, "Only borrower can make payments");
        require(loan.isActive, "Loan is not active");
        require(!loan.isPaidOff, "Loan is already paid off");
        require(paymentAmount > 0, "Payment amount must be greater than 0");
        
        // Transfer USD from borrower to contract
        require(usdToken.transferFrom(msg.sender, address(this), paymentAmount), "USD transfer failed");
        uint256 remainingBalance = loan.remainingBalance;
        
        // Check if payment is sufficient
        if (paymentAmount >= remainingBalance) {
            // Loan is paid off
            loan.remainingBalance = 0;
            loan.isPaidOff = true;
            loan.isActive = false;
            hasActiveLoan[loan.borrower] = false;
            totalActiveLoans--;
            
            // Refund excess payment
            if (paymentAmount > remainingBalance) {
                uint256 refund = paymentAmount - remainingBalance;
                require(usdToken.transfer(loan.borrower, refund), "Refund transfer failed");
                paymentAmount = remainingBalance;
            }
            
            emit LoanPaidOff(loanId, loan.borrower, loan.totalAmount);
        } else {
            // Partial payment
            loan.remainingBalance -= paymentAmount;
            loan.lastPaymentTime = block.timestamp;
            
            emit PaymentMade(loanId, loan.borrower, paymentAmount, loan.remainingBalance);
        }
        
        // Update contract balance (USD tokens are now in contract)
    }

    /// @notice Check if a loan is overdue
    /// @param loanId The loan ID to check
    function checkLoanStatus(uint256 loanId) external view returns (bool isOverdue, uint256 daysOverdue) {
        Loan memory loan = loans[loanId];
        require(loan.borrower != address(0), "Loan does not exist");
        
        if (!loan.isActive || loan.isPaidOff) {
            return (false, 0);
        }
        
        uint256 monthsSinceStart = (block.timestamp - loan.startTime) / 30 days;
        uint256 expectedPayments = monthsSinceStart;
        uint256 actualPayments = (loan.totalAmount - loan.remainingBalance) / loan.monthlyPayment;
        
        if (expectedPayments > actualPayments) {
            daysOverdue = (block.timestamp - loan.lastPaymentTime) / 1 days;
            isOverdue = daysOverdue > 30; // 30 days grace period
        }
        
        return (isOverdue, daysOverdue);
    }

    /// @notice Get user's loan history
    /// @param user The user address
    function getUserLoans(address user) external view returns (uint256[] memory) {
        return userLoans[user];
    }

    /// @notice Get loan details
    /// @param loanId The loan ID
    function getLoanDetails(uint256 loanId) external view returns (Loan memory) {
        return loans[loanId];
    }

    /// @notice Calculate loan payment details
    /// @param amount The loan amount
    /// @param interestRate The annual interest rate in basis points
    /// @param termMonths The loan term in months
    function calculateLoanPayment(
        uint256 amount,
        uint256 interestRate,
        uint256 termMonths
    ) public pure returns (uint256 monthlyPayment, uint256 totalAmount) {
        // Simple interest calculation to avoid overflow
        // Total interest = principal * annual_rate * years
        uint256 totalInterest = (amount * interestRate * termMonths) / (12 * 10000);
        totalAmount = amount + totalInterest;
        monthlyPayment = totalAmount / termMonths;
        
        return (monthlyPayment, totalAmount);
    }

    /// @notice Check if document is verified
    /// @param documentCommitment The document commitment
    function isDocumentVerified(bytes32 documentCommitment) external view returns (bool) {
        return verifiedDocuments[documentCommitment];
    }

    /// @notice Get salary range for verified document
    /// @param documentCommitment The document commitment
    function getDocumentSalaryRange(bytes32 documentCommitment) external view returns (string memory) {
        require(verifiedDocuments[documentCommitment], "Document not verified");
        return documentSalaryRanges[documentCommitment];
    }

    /// @notice Deposit USD funds to the contract
    /// @param amount The USD amount to deposit
    function deposit(uint256 amount) external onlyOwner {
        require(usdToken.transferFrom(msg.sender, address(this), amount), "USD deposit failed");
    }

    /// @notice Withdraw USD funds from the contract
    /// @param amount The USD amount to withdraw
    function withdraw(uint256 amount) external onlyOwner {
        require(usdToken.transfer(msg.sender, amount), "USD withdrawal failed");
    }

    /// @notice Get contract statistics
    function getContractStats() external view returns (
        uint256 _totalLoansIssued,
        uint256 _totalActiveLoans,
        uint256 _contractBalance,
        uint256 _nextLoanId
    ) {
        return (totalLoansIssued, totalActiveLoans, usdToken.balanceOf(address(this)), nextLoanId);
    }

    /// @notice Update salary range limits (only owner)
    /// @param salaryRange The salary range
    /// @param newLimit The new loan limit
    function updateSalaryRangeLimit(string memory salaryRange, uint256 newLimit) external onlyOwner {
        salaryRangeLimits[salaryRange] = newLimit;
    }

    /// @notice Update interest rates (only owner)
    /// @param salaryRange The salary range
    /// @param newRate The new interest rate in basis points
    function updateInterestRate(string memory salaryRange, uint256 newRate) external onlyOwner {
        salaryRangeInterestRates[salaryRange] = newRate;
    }

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only contract owner can call this function");
        _;
    }
}
