import React, { useState } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { UploadPage } from './pages/UploadPage';
import { ProofPage } from './pages/ProofPage';
import { LendingPage } from './pages/LendingPage';
import { AadhaarPage } from './pages/AadhaarPage';
import { AnonAadhaarProvider } from './providers/AnonAadhaarProvider';

export type Step = 'home' | 'upload' | 'proof' | 'lending' | 'aadhaar';

interface UserData {
  monthlyIncome: number;
  proofGenerated: boolean;
  creditScore: number;
  documentName: string;
}

function App() {
  const [currentStep, setCurrentStep] = useState<Step>('home');
  const [userData, setUserData] = useState<UserData>({
    monthlyIncome: 0,
    proofGenerated: false,
    creditScore: 750,
    documentName: ''
  });

  const handleGetStarted = () => {
    setCurrentStep('upload');
  };

  const handleNavigateToAadhaar = () => {
    setCurrentStep('aadhaar');
  };

  const handleNavigateHome = () => {
    setCurrentStep('home');
  };

  const handleUploadComplete = (income: number, docName: string) => {
    setUserData(prev => ({
      ...prev,
      monthlyIncome: income,
      documentName: docName
    }));
    setCurrentStep('proof');
  };

  const handleProofGenerated = () => {
    setUserData(prev => ({
      ...prev,
      proofGenerated: true
    }));
    setCurrentStep('lending');
  };

  return (
    <AnonAadhaarProvider>
      {/* Fixed Header - outside of scrolling container */}
      <Header 
        currentStep={currentStep} 
        onNavigateHome={handleNavigateHome}
        onNavigateToAadhaar={handleNavigateToAadhaar}
      />
      
      <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-gradient-to-br from-gray-800/10 to-gray-700/10 rounded-full blur-xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-gray-700/10 to-gray-600/10 rounded-full blur-xl translate-x-1/2 translate-y-1/2"></div>
      <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-gradient-to-br from-gray-800/8 to-gray-700/8 rounded-full blur-lg -translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="relative z-10">
        {/* Progress Indicator - Right Side Vertical */}
        <div className="fixed top-1/2 right-4 transform -translate-y-1/2 z-40 hidden sm:block">
          <div className="flex flex-col items-center space-y-4 bg-black/20 backdrop-blur-2xl border border-white/15 rounded-full px-4 py-6 shadow-2xl ring-1 ring-white/5">
            {[
              { step: 'home', label: 'Home', icon: '🏠' },
              { step: 'upload', label: 'Upload', icon: '📄' },
              { step: 'proof', label: 'Proof', icon: '🔐' },
              { step: 'lending', label: 'Credit', icon: '💰' }
            ].map((item, index) => (
              <div key={item.step} className="flex flex-col items-center space-y-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all duration-300 ${
                  currentStep === item.step 
                    ? 'bg-white text-black' 
                    : index < ['home', 'upload', 'proof', 'lending'].indexOf(currentStep)
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-700 text-gray-400'
                }`}>
                  {index < ['home', 'upload', 'proof', 'lending'].indexOf(currentStep) ? '✓' : item.icon}
                </div>
                <span className={`text-xs font-medium transition-colors duration-300 text-center ${
                  currentStep === item.step ? 'text-white' : 'text-gray-400'
                }`}>
                  {item.label}
                </span>
                {index < 3 && (
                  <div className={`w-0.5 h-6 transition-colors duration-300 ${
                    index < ['home', 'upload', 'proof', 'lending'].indexOf(currentStep)
                      ? 'bg-green-500'
                      : 'bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
        
        <main className="pt-32 pb-8">
          <div className="transition-all duration-500 ease-in-out">
            {currentStep === 'home' && (
              <div className="animate-fadeIn">
                <HomePage onGetStarted={handleGetStarted} />
              </div>
            )}
            
            {currentStep === 'upload' && (
              <div className="animate-slideInRight">
                <UploadPage onUploadComplete={handleUploadComplete} />
              </div>
            )}
            
            {currentStep === 'proof' && (
              <div className="animate-slideInRight">
                <ProofPage 
                  userData={userData} 
                  onProofGenerated={handleProofGenerated}
                />
              </div>
            )}
            
            {currentStep === 'lending' && (
              <div className="animate-slideInRight">
                <LendingPage userData={userData} />
              </div>
            )}
            
            {currentStep === 'aadhaar' && (
              <div className="animate-slideInRight">
                <AadhaarPage />
              </div>
            )}
          </div>
        </main>
        
        <Footer />
      </div>
      </div>
    </AnonAadhaarProvider>
  );
}

export default App;