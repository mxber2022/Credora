import React, { useState, useEffect, useCallback } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { encodeFunctionData } from 'viem';
import {
  useAnonAadhaar,
  useProver,
} from "@anon-aadhaar/react";
import { verifyProofWithRelayer } from './services/aadhaarService';
import { useContractVerification } from '../hooks/useContractVerification';
import { VerificationStatus } from './aadhaar/VerificationStatus';
import { ProofGeneration } from './aadhaar/ProofGeneration';
import { WalletLinking } from './aadhaar/WalletLinking';
import { NotificationToast } from './aadhaar/NotificationToast';
import { LoadingState } from './aadhaar/LoadingState';
import { VerifiedState } from './aadhaar/VerifiedState';

interface AadhaarVerificationProps {
  onVerificationComplete: (txHash: string) => void;
  setUseTestAadhaar: (state: boolean) => void;
  useTestAadhaar: boolean;
  onBack?: () => void;
}

export const AadhaarVerification: React.FC<AadhaarVerificationProps> = ({
  onVerificationComplete,
  setUseTestAadhaar,
  useTestAadhaar,
  onBack
}) => {
  const [verificationTx, setVerificationTx] = useState('');
  const [aggregationDetails, setAggregationDetails] = useState<any>(null);
  const [aggregationId, setAggregationId] = useState<number>(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('');
  const [walletLinked, setWalletLinked] = useState(false);
  const [linkTx, setLinkTx] = useState('');
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
    show: boolean;
  }>({ type: 'info', message: '', show: false });

  // Wagmi hooks
  const { address: walletAddress, isConnected } = useAccount();
  const { writeContract, data: txHash, isPending: isLinkingWallet, error: txError } = useWriteContract();
  
  // Wait for transaction confirmation
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
  });
  
  // Contract details
  const CONTRACT_ADDRESS = '0x964D28b5cC79af30210AC59AAd93a80E140Bd0cd';

  // Anon Aadhaar hooks
  const [anonAadhaar] = useAnonAadhaar();
  const [, latestProof] = useProver();

  // Contract verification hook
  const { isContractVerified, isCheckingStatus, checkVerificationStatus } = useContractVerification(walletAddress);

  // Memoize the verification complete callback
  const handleVerificationComplete = useCallback((txHash: string) => {
    onVerificationComplete(txHash);
  }, [onVerificationComplete]);

  // Handle transaction confirmation
  useEffect(() => {
    if (isConfirmed) {
      setWalletLinked(true);
      setNotification({
        type: 'success',
        message: 'Wallet linked successfully!',
        show: true
      });
      setTimeout(() => setNotification(prev => ({ ...prev, show: false })), 5000);
    }
  }, [isConfirmed]);

  // Handle transaction error
  useEffect(() => {
    if (txError) {
      setNotification({
        type: 'error',
        message: 'Transaction failed. Please try again.',
        show: true
      });
      setTimeout(() => setNotification(prev => ({ ...prev, show: false })), 5000);
    }
  }, [txError]);

  // Handle transaction hash
  useEffect(() => {
    if (txHash) {
      setLinkTx(txHash);
    }
  }, [txHash]);

  // Update wallet linked state based on contract verification
  useEffect(() => {
    if (isContractVerified && !walletLinked) {
      setWalletLinked(true);
      handleVerificationComplete('Already verified');
    }
  }, [isContractVerified, walletLinked, handleVerificationComplete]);


  const handleVerifyProof = async () => {
    if (!latestProof) {
      setNotification({
        type: 'error',
        message: 'Please generate an Anon Aadhaar proof first',
        show: true
      });
      setTimeout(() => setNotification(prev => ({ ...prev, show: false })), 5000);
      return;
    }

    setIsVerifying(true);
    setVerificationStatus('Submitting proof...');
    try {
      const result = await verifyProofWithRelayer(latestProof, setVerificationStatus);
      setVerificationTx(result.txHash);
      setAggregationDetails(result.aggregationDetails);
      setAggregationId(result.aggregationId);
      setVerificationStatus('Verification completed!');
      onVerificationComplete(result.txHash);
    } catch (error) {
      console.error('Verification failed:', error);
      setVerificationStatus('Verification failed');
      setNotification({
        type: 'error',
        message: 'Verification failed. Please try again.',
        show: true
      });
      setTimeout(() => setNotification(prev => ({ ...prev, show: false })), 5000);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLinkWallet = async () => {
    if (!isConnected || !walletAddress) {
      setNotification({
        type: 'error',
        message: 'Please connect your wallet first',
        show: true
      });
      setTimeout(() => setNotification(prev => ({ ...prev, show: false })), 5000);
      return;
    }

    if (!aggregationDetails) {
      setNotification({
        type: 'error',
        message: 'No aggregation details available. Please verify your proof first.',
        show: true
      });
      setTimeout(() => setNotification(prev => ({ ...prev, show: false })), 5000);
      return;
    }

    // Extract proof data from the latest proof and convert to BigInt
    const inputs = [
      BigInt(latestProof?.proof.pubkeyHash || '0'),
      BigInt(latestProof?.proof.nullifier || '0'),
      BigInt(latestProof?.proof.timestamp || '0'),
      BigInt(latestProof?.proof.ageAbove18 || '0'),
      BigInt(latestProof?.proof.gender || '0'),
      BigInt(latestProof?.proof.pincode || '0'),
      BigInt(latestProof?.proof.state || '0'),
      BigInt(latestProof?.proof.nullifierSeed || '0'),
      BigInt(latestProof?.proof.signalHash || '0')
    ];

    // Use actual aggregation details from the relayer response
    const aggregationIdBigInt = BigInt(aggregationId || 0);
    const domainId = BigInt(113);
    const merklePath = aggregationDetails.merkleProof as `0x${string}`[];
    const leafCount = BigInt(aggregationDetails.numberOfLeaves || 1);
    const index = BigInt(aggregationDetails.leafIndex || 0);

    writeContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: [{
        name: 'checkHash',
        type: 'function',
        inputs: [
          { name: 'inputs', type: 'uint256[]' },
          { name: '_aggregationId', type: 'uint256' },
          { name: '_domainId', type: 'uint256' },
          { name: '_merklePath', type: 'bytes32[]' },
          { name: '_leafCount', type: 'uint256' },
          { name: '_index', type: 'uint256' }
        ],
        outputs: [],
        stateMutability: 'nonpayable'
      }],
      functionName: 'checkHash',
      args: [inputs, BigInt(aggregationId), domainId, merklePath, leafCount, index]
    });
  };

  // Show loading state while checking verification status
  if (isCheckingStatus && walletAddress) {
    return <LoadingState />;
  }

  if (isContractVerified || walletLinked) {
    return <VerifiedState verificationTx={verificationTx} linkTx={linkTx} />;
  }

  return (
    <div className="min-h-screen py-8 relative bg-black">
      {/* Enhanced background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-500/10 to-purple-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-green-500/10 to-emerald-500/5 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-purple-500/10 to-pink-500/5 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '4s'}}></div>
        
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/30 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-green-400/40 rounded-full animate-ping" style={{animationDelay: '3s'}}></div>
        <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-purple-400/30 rounded-full animate-ping" style={{animationDelay: '5s'}}></div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      {/* Notification Toast */}
      <NotificationToast 
        notification={notification} 
        onClose={() => setNotification(prev => ({ ...prev, show: false }))} 
      />

      <div className="relative z-10">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 overflow-visible">
          {/* Back Button */}
          {onBack && (
            <div className="mb-8">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-300"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Back to verification methods</span>
              </button>
            </div>
          )}
          
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Anon Aadhaar Verification
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Prove Indian residency without revealing personal data using zero-knowledge proofs
            </p>
          </div>
      
          {/* Verification Status Display - Only show when not verified */}
          {!(isContractVerified || walletLinked) && (
            <VerificationStatus
              isVerified={isContractVerified || walletLinked}
              walletAddress={walletAddress}
              latestProof={latestProof}
              anonAadhaarStatus={anonAadhaar.status}
              verificationTx={verificationTx}
            />
          )}

          {/* Proof Generation */}
          <ProofGeneration
            useTestAadhaar={useTestAadhaar}
            setUseTestAadhaar={setUseTestAadhaar}
            anonAadhaarStatus={anonAadhaar.status}
            latestProof={latestProof}
            verificationStatus={verificationStatus}
            verificationTx={verificationTx}
            isVerifying={isVerifying}
            onVerifyProof={handleVerifyProof}
          />

          {/* Wallet Linking */}
          {verificationTx && !walletLinked && (
            <WalletLinking
              isConnected={isConnected}
              walletLinked={walletLinked}
              isLinkingWallet={isLinkingWallet}
              isWaitingConfirmation={isConfirming}
              verificationTx={verificationTx}
              linkTx={linkTx}
              onLinkWallet={handleLinkWallet}
            />
          )}
        </section>
      </div>
    </div>
  );
};