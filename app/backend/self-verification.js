// Self Protocol Backend Verification Service
// This is a standalone backend service for Self Protocol verification
// Can be deployed separately or integrated into your main backend

const express = require('express');
const cors = require('cors');
const { SelfBackendVerifier, AllIds, DefaultConfigStore } = require('@selfxyz/core');

const app = express();

// Initialize Self Protocol verifier
const selfBackendVerifier = new SelfBackendVerifier(
  "credoraIdentity", // scope - should match frontend
  "https://22079dba351a.ngrok-free.app", // Replace with your actual ngrok URL
  true, // mockPassport: false = mainnet, true = staging/testnet
  AllIds,
  new DefaultConfigStore({
    minimumAge: 18,
    excludedCountries: [],
    ofac: false,
    nationality: true,
    gender: true,
  }),
  "hex" // userIdentifierType
);

// Middleware
app.use(cors());
app.use(express.json());

// Self Protocol verification endpoint
app.post('/api/verify', async (req, res) => {
  try {
    const { attestationId, proof, publicSignals, userContextData } = req.body;

    // Validate request body
    if (!attestationId || !proof || !publicSignals || !userContextData) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields: attestationId, proof, publicSignals, userContextData'
      });
    }

    console.log('Verifying Self Protocol proof:', {
      attestationId,
      proofLength: JSON.stringify(proof).length,
      publicSignalsLength: publicSignals.length,
      userContextData
    });

    // Verify the proof using Self Protocol verifier
    const result = await selfBackendVerifier.verify(
      attestationId,    // Document type (1 = passport, 2 = EU ID card, 3 = Aadhaar)
      proof,            // The zero-knowledge proof
      publicSignals,    // Public signals array
      userContextData   // User context data (hex string)
    );

    // Check if verification was successful
    if (result.isValidDetails.isValid) {
      // Verification successful - process the result
      return res.status(200).json({
        status: "success",
        result: true,
        credentialSubject: result.discloseOutput,
      });
    } else {
      // Verification failed
      return res.status(400).json({
        status: "error",
        result: false,
        message: "Verification failed",
        error_code: "VERIFICATION_FAILED",
        details: result.isValidDetails,
      });
    }
  } catch (error) {
    console.error('Self Protocol verification error:', error);
    return res.status(500).json({
      status: 'error',
      result: false,
      message: error.message || 'Internal server error',
      error_code: 'UNKNOWN_ERROR'
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Self Protocol Backend' });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Self Protocol Backend running on port ${PORT}`);
});

module.exports = app;
