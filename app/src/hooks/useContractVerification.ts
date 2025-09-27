import { useState, useEffect, useCallback } from 'react';
import { createPublicClient, http } from 'viem';

const CONTRACT_ADDRESS = '0x964D28b5cC79af30210AC59AAd93a80E140Bd0cd';

// Viem client for reading contract
const publicClient = createPublicClient({
  chain: {
    id: 845320009,
    name: 'Horizon Testnet',
    network: 'horizon-testnet',
    nativeCurrency: {
      decimals: 18,
      name: 'ETH',
      symbol: 'ETH',
    },
    rpcUrls: {
      default: { http: ['https://horizen-rpc-testnet.appchain.base.org'] },
      public: { http: ['https://horizen-rpc-testnet.appchain.base.org'] },
    },
  },
  transport: http()
});

export const useContractVerification = (walletAddress?: string) => {
  const [isContractVerified, setIsContractVerified] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [contractError, setContractError] = useState<any>(null);

  // Check verification status from contract
  const checkVerificationStatus = useCallback(async () => {
    if (!walletAddress) {
      setIsCheckingStatus(false);
      return;
    }
    
    setIsCheckingStatus(true);
    setContractError(null);
    
    try {
      const isVerified = await publicClient.readContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: [{
          name: 'registeredUsers',
          type: 'function',
          inputs: [{ name: 'user', type: 'address' }],
          outputs: [{ name: '', type: 'bool' }],
          stateMutability: 'view'
        }],
        functionName: 'registeredUsers',
        args: [walletAddress as `0x${string}`]
      });
      
      console.log('Contract verification result:', isVerified);
      setIsContractVerified(isVerified);
      
      return isVerified;
    } catch (error) {
      console.error('Error checking verification status:', error);
      setContractError(error);
      return false;
    } finally {
      setIsCheckingStatus(false);
    }
  }, [walletAddress]);

  // Check status when wallet is connected
  useEffect(() => {
    if (walletAddress) {
      checkVerificationStatus();
    } else {
      setIsCheckingStatus(false);
    }
  }, [walletAddress, checkVerificationStatus]);

  return {
    isContractVerified,
    isCheckingStatus,
    contractError,
    checkVerificationStatus
  };
};
