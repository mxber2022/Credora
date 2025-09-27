import React, { useState } from 'react';
import { Upload, FileText, Shield, CheckCircle, X } from 'lucide-react';
import { useProofGeneration } from '../hooks/useProofGeneration';

interface UploadSectionProps {
  onProofGenerated?: (proof: any) => void;
}

export function UploadSection({ onProofGenerated }: UploadSectionProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
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


  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-white mb-4">
          Upload Your Income Document
        </h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Upload digitally signed income documents (payslips, tax returns, or freelance invoices) 
          to generate zero-knowledge proofs of your earning capacity.
        </p>
      </div>

      <div className="space-y-8">
        <div
            className={`relative border-2 border-dashed rounded-2xl p-16 text-center transition-all duration-300 bg-black/20 backdrop-blur-2xl shadow-2xl ring-1 ring-white/5 ${
              dragActive
                ? 'border-blue-400/60 bg-blue-500/10 hover:border-blue-400/80'
                : isGenerating || isVerifying
                ? 'border-green-400/60 bg-green-500/10 hover:border-green-400/80 animate-pulse'
                : 'border-white/20 hover:border-white/40 hover:bg-black/30'
            }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {/* Moving green dashed line animation */}
          {(isGenerating || isVerifying) && (
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 border-2 border-dashed border-green-400/80 rounded-2xl animate-spin-slow"></div>
              <div className="absolute inset-0 border-2 border-dashed border-green-400/40 rounded-2xl animate-spin-slow-reverse" style={{ animationDelay: '0.5s' }}></div>
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
                <h3 className="text-xl font-semibold text-white">
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
                <h3 className="text-xl font-semibold text-red-400">Processing Failed</h3>
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
                <h3 className="text-xl font-semibold text-emerald-400">Proof Generated Successfully</h3>
                <p className="text-emerald-300 text-sm">Zero-knowledge proof created and ready for use</p>
                <div className="inline-flex items-center px-4 py-2 bg-emerald-500/10 backdrop-blur-xl border border-emerald-500/30 rounded-full text-emerald-300 text-sm font-medium">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {uploadedFile?.name}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 group">
              <div className="w-20 h-20 bg-blue-500/20 border border-blue-500/30 rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Upload className="w-10 h-10 text-blue-400 group-hover:text-white transition-colors duration-300" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors duration-300">
                  Drag & drop your PDF here
                </h3>
                <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">or click to browse files</p>
              </div>
              <div className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                Supports digitally signed PDFs only • Max 10MB
              </div>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-xl backdrop-blur-sm">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-blue-400 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-300">Privacy Guaranteed</h4>
                <p className="text-sm text-blue-200 mt-1">
                  Your documents are processed locally. Only mathematical proofs are generated - 
                  no personal information leaves your device.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-xl backdrop-blur-sm">
            <h4 className="font-medium text-green-300 mb-3">Supported Document Types</h4>
            <ul className="space-y-2 text-sm text-green-200">
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>Digitally signed payslips</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>Tax returns (e-filed)</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>Platform earnings (Uber, Fiverr)</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>Bank statements (certified)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}