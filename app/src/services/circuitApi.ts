const CIRCUIT_API_BASE = 'http://localhost:3002';

export interface ProofRequest {
  pdf_bytes: number[];
  page_number: number;
  sub_string: string;
}

export interface ProofResponse {
  public_values: string;
  proof: string;
  [key: string]: any;
}

export interface VerifyRequest {
  public_values: string;
  proof: string;
  [key: string]: any;
}

export interface VerifyResponse {
  valid: boolean;
  error?: string;
}

export class CircuitApiService {
  private baseUrl: string;

  constructor(baseUrl: string = CIRCUIT_API_BASE) {
    this.baseUrl = baseUrl;
  }

  /**
   * Convert PDF file to bytes array
   */
  private async fileToBytes(file: File): Promise<number[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        const bytes = Array.from(new Uint8Array(arrayBuffer));
        resolve(bytes);
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * Generate a proof for a PDF document
   */
  async generateProof(file: File, pageNumber: number = 0, subString: string = "Sample Signed PDF Document"): Promise<ProofResponse> {
    try {
      const pdfBytes = await this.fileToBytes(file);
      
      const request: ProofRequest = {
        pdf_bytes: pdfBytes,
        page_number: pageNumber,
        sub_string: subString,
      };

      const response = await fetch(`${this.baseUrl}/prove`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Proof generation failed: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('Proof generation response:', result);
      
      // Check if result is an array (SP1ProofWithPublicValues might be serialized as array)
      let proofData = result;
      if (Array.isArray(result)) {
        console.log('Response is an array, taking first element');
        proofData = result[0];
      }
      
      console.log('Final proof object:', proofData);
      
      return proofData;
    } catch (error) {
      console.error('Error generating proof:', error);
      throw error;
    }
  }

  /**
   * Verify a proof
   */
  async verifyProof(proof: ProofResponse): Promise<VerifyResponse> {
    try {
      console.log('Sending proof for verification:', proof);
      
      // Ensure we include all required fields for verification
      const verificationData = {
        ...proof, // Include all fields from the proof
        sp1_version: proof.sp1_version || 'v5.0.0', // Ensure sp1_version is present
      };
      
      console.log('Verification data being sent:', verificationData);
      
      // Pass the complete proof object as the verify endpoint expects SP1ProofWithPublicValues
      const response = await fetch(`${this.baseUrl}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(verificationData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Verification failed:', errorText);
        throw new Error(`Proof verification failed: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('Verification response:', result);
      return result;
    } catch (error) {
      console.error('Error verifying proof:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const circuitApi = new CircuitApiService();
