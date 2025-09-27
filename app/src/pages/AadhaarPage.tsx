import React, { useState } from 'react';
import { AadhaarVerification } from '../components/AadhaarVerification';
import { SelfVerification } from '../components/self/SelfVerification';
import { IdentityVerificationChoice } from '../components/IdentityVerificationChoice';

type VerificationMethod = 'choice' | 'anon-aadhaar' | 'self-protocol';

export const AadhaarPage: React.FC = () => {
  const [useTestAadhaar, setUseTestAadhaar] = useState(true);
  const [verificationMethod, setVerificationMethod] = useState<VerificationMethod>('choice');

  const handleVerificationComplete = (txHash: string) => {
    console.log('Verification completed with tx:', txHash);
  };

  const handleSelectAnonAadhaar = () => {
    setVerificationMethod('anon-aadhaar');
  };

  const handleSelectSelfProtocol = () => {
    setVerificationMethod('self-protocol');
  };

  const handleBackToChoice = () => {
    setVerificationMethod('choice');
  };

  const renderVerificationComponent = () => {
    switch (verificationMethod) {
      case 'anon-aadhaar':
        return (
          <AadhaarVerification
            onVerificationComplete={handleVerificationComplete}
            setUseTestAadhaar={setUseTestAadhaar}
            useTestAadhaar={useTestAadhaar}
            onBack={handleBackToChoice}
          />
        );
      case 'self-protocol':
        return (
          <SelfVerification
            onVerificationSuccess={(result) => {
              console.log('Self Protocol verification successful:', result);
              // Handle success - could redirect or show success state
            }}
            onVerificationError={(error) => {
              console.error('Self Protocol verification failed:', error);
            }}
          />
        );
      default:
        return (
          <IdentityVerificationChoice
            onSelectAnonAadhaar={handleSelectAnonAadhaar}
            onSelectSelfProtocol={handleSelectSelfProtocol}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-gradient-to-br from-blue-800/10 to-indigo-800/10 rounded-full blur-xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-purple-800/10 to-pink-800/10 rounded-full blur-xl translate-x-1/2 translate-y-1/2"></div>
      
      <div className="relative z-10 py-8">
        {renderVerificationComponent()}
      </div>
    </div>
  );
};
