import React, { useState, useEffect } from 'react';
import { Zap, Shield, CheckCircle, Eye, Copy, ExternalLink } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Progress } from '../ui/Progress';
import { LoanApplication } from './LoanApplication';

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
  const [showLoanApplication, setShowLoanApplication] = useState(false);
  const [loanId, setLoanId] = useState<number | null>(null);

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
    console.log('Button clicked - handleContinue called');
    setShowLoanApplication(true);
  };

  const handleLoanApplied = (appliedLoanId: number) => {
    console.log('Loan applied:', appliedLoanId);
    setLoanId(appliedLoanId);
    // Navigate to lending page after loan application
    onProofGenerated();
  };

  const handleBackToProof = () => {
    setShowLoanApplication(false);
  };

  const copyProofHash = () => {
    navigator.clipboard.writeText(proofData?.proofHash || '');
  };

  const progress = ((currentStage + 1) / stages.length) * 100;

  // Show loan application if proof is generated and user clicked apply
  if (showLoanApplication && proofData) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <LoanApplication 
          proofData={proofData}
          onLoanApplied={handleLoanApplied}
          onBack={handleBackToProof}
        />
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <div className="inline-flex items-center px-4 py-2 bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-full text-gray-300 text-sm font-medium mb-6">
          <Zap className="h-4 w-4 mr-2" />
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
          zkPDF Processing
        </div>
        <h2 className="text-3xl font-bold text-gray-100 mb-4">
          Generating Zero-Knowledge Proof
        </h2>
        <p className="text-base text-gray-400 max-w-2xl mx-auto font-medium">
          Creating a cryptographic proof that verifies your income meets the threshold 
          without revealing any personal information.
        </p>
        <div className="mt-8 max-w-md mx-auto">
          <Progress value={progress} variant="default" size="lg" />
          <p className="text-sm text-gray-400 mt-2">{Math.round(progress)}% Complete</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="relative bg-black/20 backdrop-blur-2xl border border-white/15 rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden ring-1 ring-white/5">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.05)_0%,transparent_50%)]"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-full blur-2xl"></div>
            <h3 className="relative z-10 text-lg font-medium text-gray-100 mb-6">Processing Stages</h3>
              <div className="space-y-4">
                {stages.map((stage, index) => {
                  const isActive = index === currentStage;
                  const isCompleted = index < currentStage;
                  
                  return (
                    <div key={stage.id} className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 ${
                     isActive ? 'bg-black/90 border border-gray-700/60' : 
                     isCompleted ? 'bg-black/80 border border-gray-700/50' : 
                     'bg-black/70 border border-gray-800/50'
                    }`}>
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
                       isActive ? 'bg-white text-black' :
                       isCompleted ? 'bg-white text-black' :
                       'bg-gray-800 text-gray-400'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : isActive ? (
                          <div className="w-3 h-3 bg-black rounded-full animate-pulse" />
                        ) : (
                          <span className="text-xs font-bold">{index + 1}</span>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h4 className={`font-medium ${
                         isActive ? 'text-white' :
                         isCompleted ? 'text-gray-100' :
                         'text-gray-300'
                        }`}>
                          {stage.label}
                        </h4>
                        {isActive && (
                          <div className="mt-2">
                            <Progress value={60} variant="default" size="sm" />
                          </div>
                        )}
                      </div>
                      
                      {isActive && (
                        <div className="animate-spin">
                          <Zap className="h-4 w-4 text-gray-300" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
          </div>

          <div className="bg-black/20 backdrop-blur-2xl border border-white/15 rounded-2xl p-8 shadow-lg ring-1 ring-white/5">
            <h3 className="text-lg font-medium text-gray-100 mb-6">What's Being Proven?</h3>
              <div className="space-y-3">
                {[
                  `Monthly income ≥ $${userData.monthlyIncome >= 5000 ? '5,000' : '3,000'}`,
                  'Document is digitally signed & authentic',
                  'Income source is legitimate employer',
                  'Document issued within 90 days'
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-gray-300 flex-shrink-0" />
                    <span className="text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
          </div>
        </div>

        <div className="space-y-8">
          {proofData && (
            <div className="bg-black/20 backdrop-blur-2xl border border-white/15 rounded-2xl p-8 shadow-lg ring-1 ring-white/5">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-100">Proof Generated Successfully!</h3>
                    <p className="text-gray-300">Your zero-knowledge proof is ready</p>
                  </div>
                </div>
              <div className="mt-6">
                <div className="space-y-4">
                  <div className="p-4 bg-black/20 border border-white/15 rounded-xl ring-1 ring-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-300">Proof Hash</span>
                      <Button 
                        variant="ghost"
                        size="sm"
                        onClick={copyProofHash}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <code className="text-xs text-gray-400 break-all">
                      {proofData.proofHash}
                    </code>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-black/20 border border-white/15 rounded-lg ring-1 ring-white/5">
                      <div className="text-xs text-gray-400 mb-1">Gas Used</div>
                      <div className="font-semibold text-gray-200">{proofData.gasUsed.toLocaleString()}</div>
                    </div>
                    <div className="p-3 bg-black/20 border border-white/15 rounded-lg ring-1 ring-white/5">
                      <div className="text-xs text-gray-400 mb-1">Verification Time</div>
                      <div className="font-semibold text-gray-200">{proofData.verificationTime}</div>
                    </div>
                  </div>

                  <div className="p-4 bg-black/20 border border-white/15 rounded-xl ring-1 ring-white/5">
                    <div className="flex items-center space-x-2 mb-2">
                      <Eye className="h-4 w-4 text-gray-300" />
                      <span className="text-sm font-medium text-gray-200">Public Inputs</span>
                    </div>
                    <div className="text-xs text-gray-300 space-y-1">
                      <div>Min Threshold: ${proofData.publicInputs.minIncomeThreshold.toLocaleString()}</div>
                      <div>Document Type: {proofData.publicInputs.documentType}</div>
                      <div>Circuit ID: {proofData.circuitId}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Button
                    onClick={handleContinue}
                    className="w-full"
                    variant="outline"
                    size="md"
                  >
                    <span>Apply for PYUSD Loan</span>
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-400">
                      Your verified income qualifies you for PYUSD lending
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-black/20 backdrop-blur-2xl border border-white/15 rounded-2xl p-6 shadow-lg ring-1 ring-white/5">
            <h3 className="text-base font-medium text-gray-100 mb-4">Technical Details</h3>
              <div className="space-y-3 text-sm">
                {[
                  { label: 'Curve', value: 'BN254' },
                  { label: 'Trusted Setup', value: 'Powers of Tau' },
                  { label: 'Constraints', value: '~2.4M' },
                  { label: 'Proof Size', value: '256 bytes' }
                ].map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-gray-400">{item.label}</span>
                    <span className="font-medium text-gray-200">{item.value}</span>
                  </div>
                ))}
              </div>
          </div>
        </div>
      </div>
    </section>
  );
}