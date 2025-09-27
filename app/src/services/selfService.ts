// Self Protocol verification service
// This would typically be implemented on your backend server

export interface SelfVerificationResult {
  isValid: boolean;
  credentialSubject?: {
    nationality?: string;
    gender?: string;
    date_of_birth?: string;
    name?: string;
    passport_number?: string;
    expiry_date?: string;
  };
  error?: string;
}

export interface SelfVerificationRequest {
  attestationId: number;
  proof: string;
  publicSignals: string[];
  userContextData: string;
}

/**
 * Verify Self Protocol proof on the backend
 * This calls the backend API endpoint for verification
 */
export async function verifySelfProof(request: SelfVerificationRequest): Promise<SelfVerificationResult> {
  try {
    // Extract data from the request (matching sample code)
    const { attestationId, proof, publicSignals, userContextData } = request;

    // Verify all required fields are present (matching sample code)
    if (!proof || !publicSignals || !attestationId || !userContextData) {
      return {
        isValid: false,
        error: "Proof, publicSignals, attestationId and userContextData are required"
      };
    }

    // Get the backend endpoint from environment variables
    const backendEndpoint = process.env.VITE_SELF_BACKEND_ENDPOINT || 'http://localhost:3001';
    
    // Call the backend API endpoint
    const response = await fetch(`${backendEndpoint}/api/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        attestationId,
        proof,
        publicSignals,
        userContextData
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    // Convert backend result to frontend format
    return {
      isValid: result.result,
      credentialSubject: result.credentialSubject,
      error: result.message
    };
  } catch (error) {
    console.error('Self Protocol verification failed:', error);
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Verification failed'
    };
  }
}

/**
 * Get Self Protocol configuration
 * This matches the sample code structure
 */
export function getSelfConfig() {
  return {
    appName: process.env.VITE_SELF_APP_NAME || 'Credora',
    scope: process.env.VITE_SELF_SCOPE || 'credora-identity',
    endpoint: process.env.VITE_SELF_ENDPOINT || '',
    backendEndpoint: process.env.VITE_SELF_BACKEND_ENDPOINT || 'http://localhost:3001',
    // Backend verification configuration (must match frontend)
    verification_config: {
      excludedCountries: [],
      ofac: false,
      minimumAge: 18,
    }
  };
}

/**
 * Validate Self Protocol configuration
 */
export function validateSelfConfig(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  const config = getSelfConfig();

  if (!config.endpoint) {
    errors.push('VITE_SELF_ENDPOINT is required');
  }

  if (!config.scope) {
    errors.push('VITE_SELF_SCOPE is required');
  }

  if (config.scope.length > 30) {
    errors.push('VITE_SELF_SCOPE must be 30 characters or less');
  }

  if (!config.backendEndpoint) {
    errors.push('VITE_SELF_BACKEND_ENDPOINT is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
