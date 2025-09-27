import React, { useState, useEffect } from 'react';
import { CheckCircle, X, ExternalLink, Shield, User } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { useAccount } from 'wagmi';

// Self Protocol imports
import { SelfQRcodeWrapper, SelfAppBuilder } from '@selfxyz/qrcode';
import { getUniversalLink } from "@selfxyz/core";
import { ethers } from "ethers";
import { verifySelfProof } from '../../services/selfService';

interface SelfVerificationProps {
  onVerificationSuccess?: (result: any) => void;
  onVerificationError?: (error: string) => void;
}

export function SelfVerification({ onVerificationSuccess, onVerificationError }: SelfVerificationProps) {
  const { address, isConnected, status } = useAccount();
  const [selfApp, setSelfApp] = useState<any>(null);
  const [universalLink, setUniversalLink] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeSelfApp = async () => {
      try {
        // Check if wallet is connected
        if (!address) {
          setError("Please connect your wallet to continue with Self Protocol verification");
          return;
        }
        
        // Check for required environment variables
        const appName = "Credora";
        const scope = "credoraIdentity";
        const endpoint = "https://2249979f102c.ngrok-free.app/api/verify";

        const app = new SelfAppBuilder({
          version: 2,
          appName: appName,
          scope: scope,
          endpoint: "https://2249979f102c.ngrok-free.app/api/verify",
          logoBase64: "https://i.postimg.cc/mrmVf9hm/self.png",
          userId: address,
        endpointType: "staging_https",  
        userIdType: "hex",
        userDefinedData: "Hello World!",
        disclosures: {
          minimumAge: 18,
          excludedCountries: [],
          ofac: false,
          nationality: true,
          gender: true,
        }
      }).build();

        setSelfApp(app);
        setUniversalLink(getUniversalLink(app));
      } catch (error) {
        console.error("Failed to initialize Self app:", error);
        setError(`Failed to initialize Self Protocol: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };

    initializeSelfApp();
  }, [address]);

  const handleSuccessfulVerification = (result: any) => {
    console.log("Self Protocol verification successful:", result);
    setIsVerifying(false);
    
    // Self Protocol verification is complete - no need to verify again
    const verificationResult = {
      isValid: true,
      credentialSubject: {
        nationality: "Verified",
        gender: "Verified", 
        age: "18+",
        verificationMethod: "Self Protocol"
      },
      verificationStatus: "proof_verified"
    };
    console.log("Verification result:", verificationResult);
    
    setVerificationResult(verificationResult);
    onVerificationSuccess?.(verificationResult);
  };

  const handleVerificationError = (error: any) => {
    console.error("Self Protocol verification failed:", error);
    setIsVerifying(false);
    
    // Handle specific error types
    let errorMessage = 'Verification failed';
    if (error?.reason?.includes('No address associated with hostname')) {
      errorMessage = 'Self Protocol endpoint is not accessible. Please check your network connection or try again later.';
    } else if (error?.reason?.includes('dns error')) {
      errorMessage = 'Network error: Unable to connect to Self Protocol services.';
    } else if (error?.reason) {
      errorMessage = `Verification failed: ${error.reason}`;
    } else if (error?.message) {
      errorMessage = `Verification failed: ${error.message}`;
    }
    
    setError(errorMessage);
    onVerificationError?.(error);
  };

  const openSelfApp = () => {
    if (universalLink) {
      window.open(universalLink, "_blank");
    }
  };

  const resetVerification = () => {
    setVerificationResult(null);
    setError(null);
    setIsVerifying(false);
  };

  if (error && !selfApp) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Premium Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-500/10 to-purple-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-green-500/10 to-emerald-500/5 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-purple-500/10 to-pink-500/5 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '4s'}}></div>
        </div>

        <div className="relative z-10">
          <Card className="bg-black/20 backdrop-blur-2xl border border-white/15 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden ring-1 ring-white/5 group rounded-3xl">
            {/* Premium background effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <CardContent className="relative z-10 px-8 pb-8">
              {/* Header */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center px-6 py-3 bg-black/20 backdrop-blur-2xl border border-white/20 rounded-full text-white text-sm font-bold mb-6 group-hover:bg-black/30 group-hover:border-white/30 transition-all duration-500 shadow-lg">
                  <div className="w-2 h-2 bg-gradient-to-r from-white to-gray-300 rounded-full mr-3 animate-pulse"></div>
                  <span className="tracking-wider uppercase">Wallet Connection Required</span>
                </div>
                
                <h3 className="text-3xl font-bold text-gray-100 mb-4 group-hover:text-white transition-colors duration-300">
                  {/* Connect Your Wallet */}
                </h3>
                <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto group-hover:text-gray-300 transition-colors duration-300">
                  Please connect your wallet to continue with Self Protocol verification
                </p>
              </div>

              {/* Main Content */}
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Left Side - Instructions */}
                <div className="space-y-8">
                  <div className="bg-gradient-to-br from-blue-500/5 to-purple-500/5 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 group/step">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center mr-4 group-hover/step:bg-blue-500/30 transition-colors duration-300">
                        <span className="text-blue-400 font-bold text-sm">1</span>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-100 group-hover/step:text-white transition-colors duration-300">
                        Connect Wallet
                      </h4>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed group-hover/step:text-gray-300 transition-colors duration-300">
                      Click the "Connect Wallet" button in the header to link your wallet
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-green-500/5 to-emerald-500/5 backdrop-blur-xl border border-green-500/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 group/step">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center mr-4 group-hover/step:bg-green-500/30 transition-colors duration-300">
                        <span className="text-green-400 font-bold text-sm">2</span>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-100 group-hover/step:text-white transition-colors duration-300">
                        Verify Identity
                      </h4>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed group-hover/step:text-gray-300 transition-colors duration-300">
                      Once connected, scan the QR code to verify your identity with Self Protocol
                    </p>
                  </div>
                </div>

                {/* Right Side - Wallet Icon */}
                <div className="flex justify-center lg:justify-end">
                  <div className="bg-black/20 backdrop-blur-2xl border border-white/15 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 group/wallet">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover/wallet:scale-110 group-hover/wallet:rotate-3 transition-all duration-500 group-hover/wallet:shadow-xl border border-blue-500/30">
                        <Shield className="h-10 w-10 text-blue-400 group-hover/wallet:text-blue-300 transition-colors duration-500" />
                      </div>
                      <div className="space-y-4">
                        <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-4 py-2 rounded-full font-medium w-full block">Wallet Required</Badge>
                        <Badge className="bg-green-500/20 text-green-400 border border-green-500/30 px-4 py-2 rounded-full font-medium w-full block">Self Protocol Ready</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="text-center mt-8">
                <button 
                  onClick={() => {
                    // Trigger wallet connection
                    if (typeof window !== 'undefined' && window.ethereum) {
                        // @ts-ignore
                      window.ethereum.request({ method: 'eth_requestAccounts' });
                    }
                  }} 
                  className="py-4 px-8 rounded-2xl font-bold text-base transition-all duration-500 shadow-2xl hover:shadow-3xl hover:scale-105 group border-2 bg-black/20 backdrop-blur-2xl border-white/20 text-white hover:bg-black/30 hover:border-white/30 hover:text-gray-100 hover:ring-2 hover:ring-white/20"
                >
                  <span className="flex items-center justify-center">
                    Connect Wallet
                    <svg className="h-5 w-5 ml-3 group-hover:translate-x-1 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </span>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (verificationResult) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Premium Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-green-500/10 to-emerald-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-500/5 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-purple-500/10 to-pink-500/5 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '4s'}}></div>
        </div>

        <div className="relative z-10">
          <Card className="bg-black/20 backdrop-blur-2xl border border-white/15 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden ring-1 ring-white/5 group rounded-3xl">
            {/* Premium background effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <CardContent className="relative z-10 px-8 pb-8">
              {/* Success Header */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center px-6 py-3 bg-black/20 backdrop-blur-2xl border border-green-500/30 rounded-full text-green-300 text-sm font-bold mb-6 group-hover:bg-black/30 group-hover:border-green-500/50 group-hover:text-green-200 transition-all duration-500 shadow-lg">
                  <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full mr-3 animate-pulse"></div>
                  <span className="tracking-wider uppercase">Verification Complete</span>
                </div>
                
                <h3 className="text-3xl font-bold text-gray-100 mb-4 group-hover:text-white transition-colors duration-300">
                  Identity Verified
                </h3>
                <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto group-hover:text-gray-300 transition-colors duration-300">
                  Your identity has been successfully verified and you can now access PYUSD lending
                </p>
              </div>

              {/* Success Content */}
              <div className="grid lg:grid-cols-2 gap-12 items-start">
                {/* Left Side - Success Info */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-green-500/5 to-emerald-500/5 backdrop-blur-xl border border-green-500/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 group/success">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center mr-4 group-hover/success:bg-green-500/30 transition-colors duration-300">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-100 group-hover/success:text-white transition-colors duration-300">
                        Self Protocol Verified
                      </h4>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed group-hover/success:text-gray-300 transition-colors duration-300">
                      Your identity has been cryptographically verified using Self Protocol
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-blue-500/5 to-purple-500/5 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 group/access">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center mr-4 group-hover/access:bg-blue-500/30 transition-colors duration-300">
                        <span className="text-blue-400 font-bold text-sm">✓</span>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-100 group-hover/access:text-white transition-colors duration-300">
                        Access Granted
                      </h4>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed group-hover/access:text-gray-300 transition-colors duration-300">
                      You can now access PYUSD lending with your verified identity
                    </p>
                  </div>
                </div>

                {/* Right Side - Success Badges */}
                <div className="flex justify-center lg:justify-end">
                  <div className="bg-black/20 backdrop-blur-2xl border border-white/15 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 group/badges w-full max-w-sm">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-green-500/20 to-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover/badges:scale-110 group-hover/badges:rotate-3 transition-all duration-500 group-hover/badges:shadow-xl border border-green-500/30">
                        <CheckCircle className="h-10 w-10 text-green-400 group-hover/badges:text-green-300 transition-colors duration-500" />
                      </div>
                      <div className="space-y-4">
                        <div className="w-full">
                          <Badge className="bg-green-500/20 text-green-400 border border-green-500/30 px-4 py-2 rounded-full font-medium w-full block">Self Protocol Verified</Badge>
                        </div>
                        <div className="w-full">
                          <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-4 py-2 rounded-full font-medium w-full block">Age: 18+</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="text-center mt-8">
                <button 
                  onClick={resetVerification} 
                  className="py-4 px-8 rounded-2xl font-bold text-base transition-all duration-500 shadow-2xl hover:shadow-3xl hover:scale-105 group border-2 bg-black/20 backdrop-blur-2xl border-white/20 text-white hover:bg-black/30 hover:border-white/30 hover:text-gray-100 hover:ring-2 hover:ring-white/20"
                >
                  <span className="flex items-center justify-center">
                    Step 2: Link Wallet
                    <svg className="h-5 w-5 ml-3 group-hover:translate-x-1 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-500/10 to-purple-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-green-500/10 to-emerald-500/5 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-purple-500/10 to-pink-500/5 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative z-10">
        <Card className="bg-black/20 backdrop-blur-2xl border border-white/15 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden ring-1 ring-white/5 group rounded-3xl">
          {/* Premium background effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
        
          <CardContent className="relative z-10 px-8 pb-8">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-6 py-3 bg-black/20 backdrop-blur-2xl border border-white/20 rounded-full text-white text-sm font-bold mb-6 group-hover:bg-black/30 group-hover:border-white/30 transition-all duration-500 shadow-lg">
                <div className="w-2 h-2 bg-gradient-to-r from-white to-gray-300 rounded-full mr-3 animate-pulse"></div>
                <span className="tracking-wider uppercase">Quick Identity Verification</span>
              </div>
              
              <h3 className="text-3xl font-bold text-gray-100 mb-4 group-hover:text-white transition-colors duration-300">
                Verify Your Identity
              </h3>
              <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto group-hover:text-gray-300 transition-colors duration-300">
                Use the Self app to scan the QR code and securely verify your identity for PYUSD lending
              </p>
            </div>

            {/* Main Content */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Side - Instructions */}
              <div className="space-y-8">
                {/* Step 1 */}
                <div className="bg-gradient-to-br from-blue-500/5 to-purple-500/5 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 group/step">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center mr-4 group-hover/step:bg-blue-500/30 transition-colors duration-300">
                      <span className="text-blue-400 font-bold text-sm">1</span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-100 group-hover/step:text-white transition-colors duration-300">
                      Download Self App
                    </h4>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed group-hover/step:text-gray-300 transition-colors duration-300">
                    Get the Self app from your mobile app store if you haven't already
                  </p>
                </div>

                {/* Step 2 */}
                <div className="bg-gradient-to-br from-green-500/5 to-emerald-500/5 backdrop-blur-xl border border-green-500/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 group/step">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center mr-4 group-hover/step:bg-green-500/30 transition-colors duration-300">
                      <span className="text-green-400 font-bold text-sm">2</span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-100 group-hover/step:text-white transition-colors duration-300">
                      Scan QR Code
                    </h4>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed group-hover/step:text-gray-300 transition-colors duration-300">
                    Open the Self app and scan the QR code to start verification
                  </p>
                </div>

                {/* Requirements */}
                <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 group/req">
                  <div className="flex items-center mb-4">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                    <h4 className="text-lg font-semibold text-gray-100 group-hover/req:text-white transition-colors duration-300">
                      What You'll Need
                    </h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-3 w-3 text-green-400" />
                      </div>
                      <span className="text-sm text-gray-300">Must be 18+ years old</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-3 w-3 text-green-400" />
                      </div>
                      <span className="text-sm text-gray-300">Valid passport or government ID</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-3 w-3 text-green-400" />
                      </div>
                      <span className="text-sm text-gray-300">Share nationality & gender info</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - QR Code */}
              <div className="flex justify-center lg:justify-end">
                {selfApp ? (
                  <div className="relative">
                     <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-4 shadow-2xl hover:shadow-3xl transition-all duration-500 group/qr">
                      <SelfQRcodeWrapper
                        selfApp={selfApp}
                        onSuccess={() => handleSuccessfulVerification({})}
                        onError={handleVerificationError}
                      />
                    </div>
                    {/* Blinking Green Light */}
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500/30 rounded-full animate-pulse shadow-lg">
                      <div className="w-full h-full bg-green-400 rounded-full animate-ping"></div>
                    </div>
                    {/* Decorative elements */}
                    <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-purple-500/20 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-80 w-80 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl">
                    <div className="text-center">
                      <LoadingSpinner size="lg" />
                      <p className="text-gray-400 text-sm mt-4">Initializing verification...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Alternative Section */}
            <div className="border-t border-gray-700/50 pt-8 mt-8">
              <div className="text-center">
                <div className="inline-flex items-center px-3 py-1 bg-gray-500/10 backdrop-blur-xl border border-gray-500/20 rounded-full text-gray-400 text-xs font-medium mb-4">
                  <ExternalLink className="h-3 w-3 mr-2" />
                  Mobile Alternative
                </div>
                <h4 className="text-sm font-medium text-gray-300 mb-4 group-hover:text-white transition-colors duration-300">Direct Mobile Link</h4>
                <Button 
                  onClick={openSelfApp}
                  variant="outline"
                  size="lg"
                  className="max-w-md mx-auto py-4 px-8 rounded-2xl font-bold text-base transition-all duration-500 shadow-2xl hover:shadow-3xl hover:scale-105 group bg-black/20 backdrop-blur-2xl border border-white/20 text-white hover:bg-black/30 hover:border-white/30 hover:text-gray-100 hover:ring-2 hover:ring-white/20"
                  disabled={!universalLink}
                >
                  <ExternalLink className="h-5 w-5 mr-3 group-hover:translate-x-1 transition-transform duration-500" />
                  Open in Self App
                </Button>
                <p className="text-xs text-gray-500 mt-3 group-hover:text-gray-400 transition-colors duration-300 max-w-md mx-auto">
                  Tap to open the Self app directly on your mobile device
                </p>
              </div>
            </div>

            {/* Status Indicator */}
            {isVerifying && (
              <div className="flex items-center justify-center space-x-3 text-blue-400 bg-blue-500/10 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-4 shadow-2xl">
                <div className="animate-spin w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full"></div>
                <span className="text-sm font-medium">Processing verification...</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
