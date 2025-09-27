import React, { useState, useEffect } from 'react';
import { Zap, Shield, CheckCircle, Eye, Copy, ExternalLink } from 'lucide-react';

interface ProofGenerationProps {
  userData: {
    monthlyIncome: number;
    documentName: string;
  };
  onProofGenerated: () => void;
}

export function ProofGeneration({ userData, onProofGenerated }: ProofGenerationProps) {
  const [currentStage, setCurrentStage] = useState(0);
  const [proofData, setProofData] = useState<any>(null);

  const stages = [
    { id: 'parsing', label: 'Parsing PDF Content', duration: 1500 },
    { id: 'signature', label: 'Verifying Digital Signature', duration: 2000 },
    { id: 'circuit', label: 'Building ZK Circuit', duration: 2500 },
    { id: 'witness', label: 'Generating Witness', duration: 1800 },
    { id: 'proof', label: 'Computing ZK-SNARK Proof', duration: 3000 },
    { id: 'complete', label: 'Proof Generated', duration: 500 },
  ];

  const mockProofData = {
    proofHash: '0x1a2b3c4d5e6f7890abcdef123456789',
    publicInputs: {
      minIncomeThreshold: 3000,
      proofTimestamp: Date.now(),
      documentType: 'payslip'
    },
    circuitId: 'income-verification-v2.1',
    gasUsed: 145_000,
    verificationTime: '1.2s'
  };

  useEffect(() => {
    if (currentStage < stages.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStage(prev => {
          const newStage = prev + 1;
          if (newStage === stages.length - 1) {
            setProofData(mockProofData);
          }
          return newStage;
        });
      }, stages[currentStage].duration);
      
      return () => clearTimeout(timer);
    }
  }, [currentStage]);

  const handleContinue = () => {
    onProofGenerated();
  };

  const copyProofHash = () => {
    navigator.clipboard.writeText(proofData?.proofHash || '');
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <div className="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-blue-700 text-sm font-medium mb-6">
          <Zap className="h-4 w-4 mr-2" />
          zkPDF Processing • {userData.documentName}
        </div>
        <h2 className="text-4xl font-bold text-slate-900 mb-4">
          Generating Zero-Knowledge Proof
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Creating a cryptographic proof that verifies your income meets the threshold 
          without revealing any personal information.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="bg-black/20 backdrop-blur-2xl border border-white/15 rounded-2xl p-8 shadow-lg ring-1 ring-white/5">
            <h3 className="text-lg font-medium text-gray-100 mb-6">Processing Stages</h3>
            
            <div className="space-y-4">
              {stages.map((stage, index) => {
                const isActive = index === currentStage;
                const isCompleted = index < currentStage;
                const isUpcoming = index > currentStage;
                
                return (
                  <div key={stage.id} className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 ${
                    isActive ? 'bg-blue-500/10 border border-blue-400/30' : 
                    isCompleted ? 'bg-green-500/10 border border-green-400/30' : 
                    'bg-gray-500/10 border border-gray-400/20'
                  }`}>
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
                      isActive ? 'bg-blue-500 text-white' :
                      isCompleted ? 'bg-green-500 text-white' :
                      'bg-gray-600 text-gray-300'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : isActive ? (
                        <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                      ) : (
                        <span className="text-xs font-bold">{index + 1}</span>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h4 className={`font-medium ${
                        isActive ? 'text-blue-300' :
                        isCompleted ? 'text-green-300' :
                        'text-gray-400'
                      }`}>
                        {stage.label}
                      </h4>
                      {isActive && (
                        <div className="mt-2">
                          <div className="w-full bg-gray-700 rounded-full h-1">
                            <div className="bg-blue-500 h-1 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {isActive && (
                      <div className="animate-spin">
                        <Zap className="h-4 w-4 text-blue-600" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-gradient-to-r from-slate-900 to-blue-900 rounded-2xl p-8 text-white">
            <h3 className="text-xl font-semibold mb-4">What's Being Proven?</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-blue-300" />
                <span>Monthly income ≥ ${userData.monthlyIncome >= 5000 ? '5,000' : '3,000'}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-blue-300" />
                <span>Document is digitally signed & authentic</span>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-blue-300" />
                <span>Income source is legitimate employer</span>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-blue-300" />
                <span>Document issued within 90 days</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {proofData && (
            <div className="bg-white rounded-2xl border border-slate-200 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">Proof Generated Successfully!</h3>
                  <p className="text-slate-600">Your zero-knowledge proof is ready</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">Proof Hash</span>
                    <button 
                      onClick={copyProofHash}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                  <code className="text-xs text-slate-600 break-all">
                    {proofData.proofHash}
                  </code>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <div className="text-xs text-slate-500 mb-1">Gas Used</div>
                    <div className="font-semibold text-slate-900">{proofData.gasUsed.toLocaleString()}</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <div className="text-xs text-slate-500 mb-1">Verification Time</div>
                    <div className="font-semibold text-slate-900">{proofData.verificationTime}</div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <Eye className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Public Inputs</span>
                  </div>
                  <div className="text-xs text-blue-700 space-y-1">
                    <div>Min Threshold: ${proofData.publicInputs.minIncomeThreshold.toLocaleString()}</div>
                    <div>Document Type: {proofData.publicInputs.documentType}</div>
                    <div>Circuit ID: {proofData.circuitId}</div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleContinue}
                className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <span>Access INR Credit</span>
                <ExternalLink className="h-4 w-4" />
              </button>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-slate-200 p-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Technical Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Curve</span>
                <span className="font-medium">BN254</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Trusted Setup</span>
                <span className="font-medium">Powers of Tau</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Constraints</span>
                <span className="font-medium">~2.4M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Proof Size</span>
                <span className="font-medium">256 bytes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}