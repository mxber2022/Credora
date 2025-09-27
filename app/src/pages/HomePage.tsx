import React from 'react';
import { HeroSection } from '../components/sections/HeroSection';
import { Button } from '../components/ui/Button';
import { ArrowRight, Shield, Zap, DollarSign } from 'lucide-react';

interface HomePageProps {
  onGetStarted: () => void;
}

export function HomePage({ onGetStarted }: HomePageProps) {
  const features = [
    {
      icon: Shield,
      title: 'Privacy-First Verification',
      description: 'Zero-knowledge proofs ensure your personal data never leaves your device while proving income eligibility.'
    },
    {
      icon: Zap,
      title: 'Instant Loan Processing',
      description: 'Get loan decisions in minutes with automated zkPDF verification and smart contract execution.'
    },
    {
      icon: DollarSign,
      title: 'PYUSD Integration',
      description: 'Borrow digital PayPal USD with transparent terms and instant blockchain settlement.'
    }
  ];

  return (
    <div className="space-y-16">
      <HeroSection />
      
      {/* How It Works Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative bg-black/20 backdrop-blur-2xl border border-white/15 rounded-3xl py-16 px-8 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden ring-1 ring-white/5">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05)_0%,transparent_50%)]"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-full blur-3xl"></div>
          <div className="relative z-10 text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-full text-gray-300 text-sm font-medium mb-6">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
              Simple Process
            </div>
                <h2 className="text-2xl font-bold text-gray-100 mb-6">
                  How It Works
                </h2>
                <p className="text-sm text-gray-300 max-w-2xl mx-auto font-medium">
                  Three simple steps to access undercollateralized credit while maintaining complete privacy
                </p>
          </div>

          <div className="relative z-10 grid md:grid-cols-3 gap-10 mb-16">
            <div className="text-center relative bg-black/20 backdrop-blur-2xl border border-white/15 rounded-2xl p-8 shadow-2xl hover:shadow-3xl hover:border-white/25 transition-all duration-500 group hover:scale-105 animate-fadeIn overflow-hidden ring-1 ring-white/5">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 group-hover:shadow-xl">
                  <span className="text-3xl font-bold text-blue-400 group-hover:text-white transition-colors duration-300">1</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-100 mb-4 group-hover:text-white transition-colors duration-300">Upload Income Document</h3>
                <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                  Upload your digitally signed payslip, tax return, or platform earnings statement
                </p>
              </div>
            </div>
          
            <div className="text-center relative bg-black/20 backdrop-blur-2xl border border-white/15 rounded-2xl p-8 shadow-2xl hover:shadow-3xl hover:border-white/25 transition-all duration-500 group hover:scale-105 animate-fadeIn overflow-hidden ring-1 ring-white/5" style={{animationDelay: '0.2s'}}>
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 group-hover:shadow-xl">
                  <span className="text-3xl font-bold text-green-400 group-hover:text-white transition-colors duration-300">2</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-100 mb-4 group-hover:text-white transition-colors duration-300">Generate ZK Proof</h3>
                <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                  Our zkPDF technology creates a cryptographic proof of your income without revealing personal data
                </p>
              </div>
            </div>
          
            <div className="text-center relative bg-black/20 backdrop-blur-2xl border border-white/15 rounded-2xl p-8 shadow-2xl hover:shadow-3xl hover:border-white/25 transition-all duration-500 group hover:scale-105 animate-fadeIn overflow-hidden ring-1 ring-white/5" style={{animationDelay: '0.4s'}}>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 group-hover:shadow-xl">
                  <span className="text-3xl font-bold text-purple-400 group-hover:text-white transition-colors duration-300">3</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-100 mb-4 group-hover:text-white transition-colors duration-300">Access PYUSD Credit</h3>
                <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                  Get instant approval and borrow PayPal USD based on your verified income capacity
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 text-center">
            <Button onClick={onGetStarted} size="md" variant="outline" className="px-12 py-6 bg-black/20 backdrop-blur-2xl border border-white/15 text-gray-200 hover:bg-black/30 hover:text-white hover:border-white/25 hover:scale-105 transition-all duration-500 shadow-2xl hover:shadow-3xl group ring-1 ring-white/5 hover:ring-white/10">
              <span className="flex items-center text-base font-bold tracking-wide">
                Get Started
                <ArrowRight className="h-5 w-5 ml-3 group-hover:translate-x-1 transition-transform duration-500" />
              </span>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative bg-black/20 backdrop-blur-2xl border border-white/15 rounded-3xl p-12 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden ring-1 ring-white/5">
          {/* Subtle background elements */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(147,51,234,0.05)_0%,transparent_50%)]"></div>
          <div className="absolute top-0 left-0 w-80 h-80 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-full blur-3xl"></div>
          <div className="relative z-10 text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-full text-gray-300 text-sm font-medium mb-6">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2 animate-pulse"></div>
              Key Features
            </div>
            <h2 className="text-2xl font-bold text-gray-100 mb-6">
              Why Choose ZK Income Borrowing?
            </h2>
            <p className="text-sm text-gray-300 max-w-2xl mx-auto font-medium leading-relaxed">
              Revolutionary technology meets practical financial solutions
            </p>
          </div>

          <div className="relative z-10 grid md:grid-cols-3 gap-10">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="relative bg-black/20 backdrop-blur-2xl border border-white/15 rounded-2xl p-8 transition-all duration-500 shadow-2xl hover:shadow-3xl hover:border-white/25 group hover:scale-105 animate-fadeIn overflow-hidden ring-1 ring-white/5" style={{animationDelay: `${0.6 + index * 0.2}s`}}>
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <Icon className="h-10 w-10 text-gray-300 group-hover:text-white transition-all duration-500 mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500" />
                    <h3 className="text-lg font-semibold text-gray-100 mb-5 group-hover:text-white transition-colors duration-300">{feature.title}</h3>
                    <p className="text-gray-400 leading-relaxed text-sm group-hover:text-gray-300 transition-colors duration-300">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}