import React, { useState } from 'react';
import { Upload, FileText, Shield, CheckCircle, X, Eye, Copy, ExternalLink } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { useProofGeneration } from '../../hooks/useProofGeneration';
import { LoanApplication } from './LoanApplication';

interface UploadSectionProps {
  onProofGenerated?: (proof: any) => void;
}

export function UploadSection({ onProofGenerated }: UploadSectionProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [showLoanApplication, setShowLoanApplication] = useState(false);
  const [loanId, setLoanId] = useState<number | null>(null);
  const { 
    isGenerating, 
    isVerifying, 
    proof, 
    verification, 
    error, 
    generateProof, 
    verifyProof, 
    reset 
  } = useProofGeneration();


  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = async (file: File) => {
    setUploadedFile(file);
    reset(); // Reset previous state
    
    try {
      // Generate proof using the circuit API
      const proofResult = await generateProof(file);
      
      // Notify parent component that proof was generated successfully
      onProofGenerated?.(proofResult);
    } catch (error) {
      console.error('Error processing file:', error);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleLoanApplied = (appliedLoanId: number) => {
    console.log('Loan applied:', appliedLoanId);
    setLoanId(appliedLoanId);
    // Navigate to lending page after loan application
    onProofGenerated?.(proof);
  };

  const handleBackToProof = () => {
    setShowLoanApplication(false);
  };


  // Show loan application if proof is generated and user clicked apply
  if (showLoanApplication && proof) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LoanApplication 
          proofData={proof}
          onLoanApplied={handleLoanApplied}
          onBack={handleBackToProof}
        />
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <div className="inline-flex items-center px-4 py-2 bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-full text-gray-300 text-sm font-medium mb-6">
          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
          Document Upload
        </div>
        <h2 className="text-3xl font-bold text-gray-100 mb-4">
          Upload Your Income Document
        </h2>
        <p className="text-base text-gray-400 max-w-2xl mx-auto font-medium">
          Upload digitally signed income documents to generate zero-knowledge proofs 
          of your earning capacity without revealing personal information.
        </p>
      </div>

      <div className="space-y-8">
        <div className="relative bg-black/20 backdrop-blur-2xl border border-white/15 rounded-2xl p-12 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden ring-1 ring-white/5">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05)_0%,transparent_50%)]"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-2xl"></div>
          <div
            className={`relative z-10 border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
              dragActive
                ? 'border-gray-400 bg-gray-800/50'
                : isGenerating || isVerifying
                ? 'border-green-400 bg-green-900/30 animate-pulse'
                : 'border-gray-600 hover:border-gray-500 hover:bg-gray-800/30'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {/* Moving green dashed line animation */}
            {(isGenerating || isVerifying) && (
              <div className="absolute inset-0 rounded-xl overflow-hidden">
                <div className="absolute inset-0 border-2 border-dashed border-green-400/80 rounded-xl animate-spin-slow"></div>
                <div className="absolute inset-0 border-2 border-dashed border-green-400/40 rounded-xl animate-spin-slow-reverse" style={{ animationDelay: '0.5s' }}></div>
              </div>
            )}
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileInput}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isGenerating || isVerifying}
            />
            
            {isGenerating || isVerifying ? (
              <div className="space-y-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-black/40 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center mx-auto shadow-2xl ring-1 ring-white/10">
                    <div className="animate-spin w-10 h-10 border-2 border-white/30 border-t-white rounded-full"></div>
                  </div>
                  {/* Animated ring around the spinner */}
                  <div className="absolute inset-0 w-20 h-20 border-2 border-dashed border-white/20 rounded-full mx-auto animate-spin-slow"></div>
                </div>
                <div className="text-center space-y-3">
                  <h3 className="text-lg font-semibold text-white">
                    {isGenerating ? 'Generating Zero-Knowledge Proof' : 'Processing Complete'}
                  </h3>
                  <p className="text-gray-300 text-sm">
                    {isGenerating ? 'Creating cryptographic proof of your document...' : 'Proof generated successfully'}
                  </p>
                  <div className="inline-flex items-center px-4 py-2 bg-black/40 backdrop-blur-xl border border-white/20 rounded-full text-white text-sm font-medium">
                    <div className="w-2 h-2 bg-white/60 rounded-full mr-2 animate-pulse"></div>
                    {uploadedFile?.name}
                  </div>
                </div>
              </div>
            ) : error ? (
              <div className="space-y-6">
                <div className="w-20 h-20 bg-red-500/10 backdrop-blur-xl border border-red-500/30 rounded-full flex items-center justify-center mx-auto shadow-2xl ring-1 ring-red-500/20">
                  <X className="w-10 h-10 text-red-400" />
                </div>
                <div className="text-center space-y-3">
                  <h3 className="text-lg font-semibold text-red-400">Processing Failed</h3>
                  <p className="text-red-300 text-sm max-w-md mx-auto">{error}</p>
                  <div className="inline-flex items-center px-4 py-2 bg-red-500/10 backdrop-blur-xl border border-red-500/30 rounded-full text-red-300 text-sm font-medium">
                    <X className="w-4 h-4 mr-2" />
                    {uploadedFile?.name}
                  </div>
                </div>
              </div>
            ) : proof && verification?.valid ? (
              <div className="space-y-6">
                <div className="w-20 h-20 bg-emerald-500/10 backdrop-blur-xl border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto shadow-2xl ring-1 ring-emerald-500/20">
                  <CheckCircle className="w-10 h-10 text-emerald-400" />
                </div>
                <div className="text-center space-y-3">
                  <h3 className="text-lg font-semibold text-emerald-400">Proof Generated Successfully</h3>
                  <p className="text-emerald-300 text-sm">Zero-knowledge proof created and ready for use</p>
                  <div className="inline-flex items-center px-4 py-2 bg-emerald-500/10 backdrop-blur-xl border border-emerald-500/30 rounded-full text-emerald-300 text-sm font-medium">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {uploadedFile?.name}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="w-16 h-16 text-gray-400 mx-auto" />
                <div>
                  <h3 className="text-sm font-semibold text-gray-100">
                    Drag & drop your PDF here
                  </h3>
                  <p className="text-gray-400">or click to browse files</p>
                </div>
                <Badge variant="info">Supports digitally signed PDFs only • Max 10MB</Badge>
              </div>
            )}
          </div>
        </div>

        {/* Detailed Proof Display */}
        {proof && verification?.valid && (
          <div className="mt-8 bg-black/20 backdrop-blur-2xl border border-white/15 rounded-2xl p-8 shadow-lg ring-1 ring-white/5">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-100">Proof Details</h3>
                <p className="text-gray-300">Your zero-knowledge proof is ready</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-black/20 border border-white/15 rounded-xl ring-1 ring-white/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-300">Proof Hash</span>
                  <Button 
                    variant="ghost"
                    size="sm"
                    onClick={() => navigator.clipboard.writeText((proof as any)?.proof?.Groth16?.encoded_proof || (proof as any)?.encoded_proof || '')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <code className="text-xs text-gray-400 break-all">
                  {(proof as any)?.proof?.Groth16?.encoded_proof || (proof as any)?.encoded_proof || '0x1a2b3c4d5e6f7890abcdef123456789'}
                </code>
              </div>


              <div className="p-4 bg-black/20 border border-white/15 rounded-xl ring-1 ring-white/5">
                <div className="flex items-center space-x-2 mb-2">
                  <Eye className="h-4 w-4 text-gray-300" />
                  <span className="text-sm font-medium text-gray-200">Public Inputs</span>
                </div>
                <div className="text-xs text-gray-300 space-y-1">
                  <div>Input 1: {(proof as any)?.proof?.Groth16?.public_inputs?.[0] || (proof as any)?.publicInputs?.[0] || (proof as any)?.public_inputs?.[0] || 'N/A'}</div>
                  <div>Input 2: {(proof as any)?.proof?.Groth16?.public_inputs?.[1] || (proof as any)?.publicInputs?.[1] || (proof as any)?.public_inputs?.[1] || 'N/A'}</div>
                </div>
              </div>

              <div className="p-3 bg-black/20 border border-white/15 rounded-lg ring-1 ring-white/5">
                <div className="text-xs text-gray-400 mb-1">SP1 Version</div>
                <div className="font-semibold text-gray-200">{proof?.sp1_version || 'N/A'}</div>
              </div>
            </div>

            <Button
              onClick={() => {
                console.log('Access PYUSD Credits button clicked');
                setShowLoanApplication(true);
              }}
              className="w-full mt-6"
              variant="outline"
              size="md"
            >
              <span>Apply for PYUSD Loan</span>
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-black/20 backdrop-blur-2xl border border-white/15 rounded-2xl p-6 shadow-lg ring-1 ring-white/5">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-gray-300 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-100 mb-2">Privacy Guaranteed</h4>
                <p className="text-sm text-gray-300">
                  Your documents are processed locally using zero-knowledge cryptography. 
                  Only mathematical proofs are generated - no personal information leaves your device.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-black/20 backdrop-blur-2xl border border-white/15 rounded-2xl p-6 shadow-lg ring-1 ring-white/5">
            <h3 className="text-base font-medium text-gray-100 mb-4">Supported Document Types</h3>
              <ul className="space-y-3">
                {[
                  'Digitally signed payslips',
                  'Tax returns (e-filed)',
                  'Platform earnings (Uber, Fiverr)',
                  'Bank statements (certified)'
                ].map((item, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
          </div>
        </div>
      </div>
    </section>
  );
}