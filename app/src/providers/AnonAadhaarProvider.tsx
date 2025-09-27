import React from 'react';
import { AnonAadhaarProvider as AnonAadhaarProviderCore } from '@anon-aadhaar/react';

interface AnonAadhaarProviderProps {
  children: React.ReactNode;
}

export function AnonAadhaarProvider({ children }: AnonAadhaarProviderProps) {
  return (
    <AnonAadhaarProviderCore
      _useTestAadhaar={true} // Set to false for production
    >
      {children}
    </AnonAadhaarProviderCore>
  );
}
