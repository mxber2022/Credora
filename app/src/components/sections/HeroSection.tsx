import React from 'react';
import { Shield, Lock, Zap, TrendingUp } from 'lucide-react';
import { FeatureCard } from '../ui/FeatureCard';
import { Badge } from '../ui/Badge';
import { StatCard } from '../ui/StatCard';

export function HeroSection() {
  const features = [
    { 
      icon: Shield, 
      title: 'Privacy-First Verification',
      description: 'Zero-knowledge proofs protect your personal data'
    },
    { 
      icon: Lock, 
      title: 'Cryptographic Security',
      description: 'Military-grade encryption for financial data'
    },
    { 
      icon: Zap, 
      title: 'Instant Approval',
      description: 'Get loan decisions in minutes'
    },
    { 
      icon: TrendingUp, 
      title: 'Undercollateralized',
      description: 'Access credit without locking crypto'
    },
  ];

  return (
    <section className="relative overflow-hidden py-20 bg-black">
      {/* Enhanced background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-500/10 to-purple-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-purple-500/10 to-pink-500/5 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-green-500/10 to-emerald-500/5 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '4s'}}></div>
        
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/30 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400/40 rounded-full animate-ping" style={{animationDelay: '3s'}}></div>
        <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-green-400/30 rounded-full animate-ping" style={{animationDelay: '5s'}}></div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-black/20 via-black/30 to-black/20 backdrop-blur-2xl border border-white/20 rounded-full text-gray-200 text-sm font-bold mb-8 shadow-2xl hover:shadow-3xl transition-all duration-500 group ring-1 ring-white/10 hover:ring-white/20 animate-pulse-slow">
            <span className="group-hover:text-white transition-all duration-500 tracking-wider uppercase bg-gradient-to-r from-gray-200 via-white to-gray-200 bg-clip-text text-transparent group-hover:from-white group-hover:via-blue-100 group-hover:to-white group-hover:animate-pulse">PayPal • ZKPDF • Self Protocol</span>
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold mb-8 leading-tight tracking-tight">
            <span className="text-white bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent animate-fadeIn">
              Borrow with Privacy
            </span>
            <br />
            <span className="text-gray-400 animate-fadeIn font-light" style={{animationDelay: '0.2s'}}>
              Prove Your Income, Not Your Identity
            </span>
          </h1>
          
          <p className="text-base text-gray-300 mb-16 max-w-3xl mx-auto leading-relaxed font-normal animate-fadeIn" style={{animationDelay: '0.4s'}}>
            Revolutionary undercollateralized lending powered by zero-knowledge proofs. 
            Upload signed income documents, generate privacy-preserving proofs, and access 
            instant PYUSD credit without revealing personal data.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-black/20 backdrop-blur-2xl border border-white/15 rounded-2xl p-8 transition-all duration-500 shadow-2xl hover:shadow-3xl hover:border-white/25 hover:scale-105 animate-fadeIn overflow-hidden ring-1 ring-white/5"
                style={{animationDelay: `${0.6 + index * 0.1}s`}}
              >
                {/* Subtle gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <feature.icon className="h-8 w-8 text-gray-300 group-hover:text-white transition-all duration-500 mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500" />
                  <h3 className="font-semibold text-gray-100 mb-3 text-sm text-center group-hover:text-white transition-colors duration-300">{feature.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed text-center group-hover:text-gray-300 transition-colors duration-300">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 animate-fadeIn" style={{animationDelay: '1s'}}>
          <div className="group relative bg-black/20 backdrop-blur-2xl border border-white/15 rounded-2xl p-8 text-center shadow-2xl hover:shadow-3xl hover:border-white/25 transition-all duration-500 hover:scale-105 overflow-hidden ring-1 ring-white/5">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="text-3xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors duration-300 group-hover:scale-110 transition-transform duration-300">$50M+</div>
              <p className="text-gray-400 font-medium text-xs leading-relaxed group-hover:text-gray-300 transition-colors duration-300">Available PYUSD Liquidity</p>
              <div className="mt-4 flex items-center justify-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse group-hover:animate-ping"></div>
              </div>
            </div>
          </div>
          <div className="group relative bg-black/20 backdrop-blur-2xl border border-white/15 rounded-2xl p-8 text-center shadow-2xl hover:shadow-3xl hover:border-white/25 transition-all duration-500 hover:scale-105 overflow-hidden ring-1 ring-white/5">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="text-3xl font-bold text-white mb-4 group-hover:text-green-400 transition-colors duration-300 group-hover:scale-110 transition-transform duration-300">5 Min</div>
              <p className="text-gray-400 font-medium text-xs leading-relaxed group-hover:text-gray-300 transition-colors duration-300">Average Proof Generation</p>
              <div className="mt-4 flex items-center justify-center">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse group-hover:animate-ping"></div>
              </div>
            </div>
          </div>
          <div className="group relative bg-black/20 backdrop-blur-2xl border border-white/15 rounded-2xl p-8 text-center shadow-2xl hover:shadow-3xl hover:border-white/25 transition-all duration-500 hover:scale-105 overflow-hidden ring-1 ring-white/5">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="text-3xl font-bold text-white mb-4 group-hover:text-purple-400 transition-colors duration-300 group-hover:scale-110 transition-transform duration-300">99.9%</div>
              <p className="text-gray-400 font-medium text-xs leading-relaxed group-hover:text-gray-300 transition-colors duration-300">Privacy Preservation</p>
              <div className="mt-4 flex items-center justify-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse group-hover:animate-ping"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}