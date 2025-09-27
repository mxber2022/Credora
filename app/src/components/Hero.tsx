import React from 'react';
import { Shield, Lock, Zap, TrendingUp } from 'lucide-react';

export function Hero() {
  const features = [
    { icon: Shield, text: 'Privacy-First Verification' },
    { icon: Lock, text: 'Zero-Knowledge Proofs' },
    { icon: Zap, text: 'Instant Loan Approval' },
    { icon: TrendingUp, text: 'Undercollateralized Lending' },
  ];

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50 border border-blue-300 rounded-full text-blue-700 text-sm font-bold mb-6 shadow-lg hover:shadow-xl transition-all duration-500 group ring-1 ring-blue-200 hover:ring-blue-300 animate-pulse-slow">
            <span className="tracking-wider uppercase bg-gradient-to-r from-blue-700 via-blue-800 to-blue-700 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:via-blue-900 group-hover:to-blue-600 group-hover:animate-pulse">PayPal • ZKPDF • Self Protocol</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
              Borrow with Privacy
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Prove Your Income, Not Your Identity
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Revolutionary undercollateralized lending powered by zero-knowledge proofs. 
            Upload signed income documents, generate privacy-preserving proofs, and access 
            instant PYUSD credit without revealing personal data.
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex flex-col items-center p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/70 transition-all duration-300">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl mb-4">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-sm font-semibold text-slate-700 text-center">{feature.text}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 lg:p-12 text-white">
          <div className="grid lg:grid-cols-3 gap-8 text-center lg:text-left">
            <div>
              <h3 className="text-3xl font-bold mb-2">$50M+</h3>
              <p className="text-blue-100">Available PYUSD Liquidity</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-2">5 Min</h3>
              <p className="text-blue-100">Average Proof Generation</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-2">99.9%</h3>
              <p className="text-blue-100">Privacy Preservation</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}