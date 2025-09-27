import React, { useState } from 'react';
import { Shield, User, CheckCircle, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

interface IdentityVerificationChoiceProps {
  onSelectAnonAadhaar: () => void;
  onSelectSelfProtocol: () => void;
}

export function IdentityVerificationChoice({ 
  onSelectAnonAadhaar, 
  onSelectSelfProtocol 
}: IdentityVerificationChoiceProps) {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const verificationMethods = [
    {
      id: 'anon-aadhaar',
      name: 'Anon Aadhaar',
      description: 'Privacy-preserving Indian identity verification',
      icon: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 34 34" fill="none">
          <path d="M0.00591726 10.5519V15.7281C0.00591726 15.8169 0.0769276 15.888 0.16569 15.888H4.5624C4.65116 15.888 4.72217 15.8169 4.72217 15.7281V6.16693C4.72217 5.33809 5.39282 4.66713 6.22127 4.66713H15.6991C15.7879 4.66713 15.8589 4.59609 15.8589 4.50728V0.159846C15.8589 0.0710425 15.7859 0 15.6972 0L10.5332 0.00986693C9.80727 0.00986693 9.11098 0.29996 8.59616 0.815021L0.80478 8.61002C0.289957 9.12508 0 9.82367 0 10.5538L0.00591726 10.5519Z" fill="#FD8B0E"></path>
          <path d="M33.9842 10.5499C33.9842 9.82368 33.6943 9.12509 33.1794 8.61201L25.3881 0.81701C24.8732 0.301948 24.175 0.0118565 23.4451 0.0118565H18.2713C18.1825 0.0118565 18.1115 0.0828997 18.1115 0.171703V4.57045C18.1115 4.65925 18.1825 4.7303 18.2713 4.7303H27.828C28.6565 4.7303 29.3271 5.40126 29.3271 6.23009V15.7124C29.3271 15.8012 29.3981 15.8722 29.4869 15.8722H33.8323C33.9211 15.8722 33.9941 15.7992 33.9921 15.7104L33.9822 10.544L33.9842 10.5499Z" fill="#081224"></path>
          <path d="M33.8343 18.112H29.4376C29.3488 18.112 29.2778 18.1831 29.2778 18.2719V27.8331C29.2778 28.6619 28.6072 29.3329 27.7787 29.3329H18.3009C18.2121 29.3329 18.1411 29.4039 18.1411 29.4927V33.8402C18.1411 33.929 18.2141 34 18.3028 34L23.4668 33.9901C24.1927 33.9901 24.891 33.7 25.4038 33.185L33.1952 25.39C33.71 24.8749 34 24.1763 34 23.4462V18.2699C34 18.1811 33.927 18.1101 33.8402 18.1101L33.8343 18.112Z" fill="#009A08"></path>
          <path d="M15.7287 29.2677H6.17195C5.3435 29.2677 4.67285 28.5967 4.67285 27.7679V18.2856C4.67285 18.1968 4.60184 18.1258 4.51308 18.1258H0.167658C0.0788955 18.1258 0.0078852 18.1988 0.0078852 18.2876L0.0177483 23.454C0.0177483 24.1802 0.307706 24.8788 0.822528 25.3919L8.61391 33.1869C9.12873 33.7019 9.827 33.992 10.5568 33.992H15.7307C15.8195 33.992 15.8905 33.921 15.8905 33.8322V29.4334C15.8905 29.3446 15.8195 29.2736 15.7307 29.2736L15.7287 29.2677Z" fill="#081224"></path>
        </svg>
      ),
      features: ['Indian citizenship proof', 'Age verification', 'Location verification', 'Privacy-first'],
      color: 'green',
      onSelect: onSelectAnonAadhaar
    },
    {
      id: 'self-protocol',
      name: 'Self Protocol',
      description: 'Global identity verification with passport/ID documents',
      icon: () => (
        <img 
          src="https://docs.self.xyz/~gitbook/image?url=https%3A%2F%2F558968968-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Forganizations%252FN7JVIot3pWv4ZY6bRRrw%252Fsites%252Fsite_WgLhj%252Ficon%252FANI7wUW00mwXyWKSVz2c%252FSelf%2520App%2520Icon.png%3Falt%3Dmedia%26token%3D3f8725c5-5d2c-4a3e-8b58-8b50c0835ef6&width=32&dpr=2&quality=100&sign=34638d37&sv=2" 
          alt="Self Protocol" 
          className="w-10 h-10"
        />
      ),
      features: ['Global passport verification', 'Age verification', 'Nationality disclosure', 'Cross-border support'],
      color: 'blue',
      onSelect: onSelectSelfProtocol
    }
  ];

  const handleMethodSelect = (methodId: string, onSelect: () => void) => {
    setSelectedMethod(methodId);
    onSelect();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-500/10 to-purple-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-green-500/10 to-emerald-500/5 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-purple-500/10 to-pink-500/5 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative z-10 text-center mb-16">
        <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-black/20 via-black/30 to-black/20 backdrop-blur-2xl border border-white/20 rounded-full text-gray-200 text-sm font-bold mb-8 shadow-2xl hover:shadow-3xl transition-all duration-500 group ring-1 ring-white/10 hover:ring-white/20 animate-pulse-slow">
          <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mr-3 animate-pulse"></div>
          <span className="group-hover:text-white transition-all duration-500 tracking-wider uppercase bg-gradient-to-r from-gray-200 via-white to-gray-200 bg-clip-text text-transparent group-hover:from-white group-hover:via-blue-100 group-hover:to-white group-hover:animate-pulse">
            Choose Verification Method
          </span>
        </div>
        <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight tracking-tight">
          <span className="text-white bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent animate-fadeIn">
            Verify Your Identity
          </span>
        </h2>
        <p className="text-lg text-gray-300 max-w-3xl mx-auto font-normal leading-relaxed animate-fadeIn" style={{animationDelay: '0.2s'}}>
          Select your preferred identity verification method to access PYUSD lending
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {verificationMethods.map((method, index) => {
          const Icon = method.icon;
          const isSelected = selectedMethod === method.id;
          
          return (
            <Card 
              key={method.id}
              className={`relative bg-black/20 backdrop-blur-2xl border transition-all duration-500 shadow-2xl hover:shadow-3xl hover:scale-105 overflow-hidden ring-1 rounded-2xl group animate-fadeIn ${
                isSelected 
                  ? `border-${method.color}-500/50 bg-${method.color}-500/10` 
                  : 'border-white/15 hover:border-white/25'
              }`}
              // @ts-ignore
              style={{animationDelay: `${0.4 + index * 0.2}s`}}
            >
              {/* Premium Background Effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-${method.color}-500/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              <CardHeader className="text-center pb-6 relative z-10">
                <div className="w-20 h-20 bg-black/20 backdrop-blur-2xl border border-white/15 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-xl transition-all duration-500">
                  <Icon />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-100 mb-3 group-hover:text-white transition-colors duration-300">
                  {method.name}
                </CardTitle>
                <p className="text-gray-400 text-base leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                  {method.description}
                </p>
              </CardHeader>
              
              <CardContent className="space-y-8 relative z-10">
                {/* Features List */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors duration-300">Key Features</h4>
                  <div className="space-y-3">
                    {method.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3 group/feature">
                        <div className={`w-6 h-6 bg-${method.color}-500/20 rounded-full flex items-center justify-center group-hover:bg-${method.color}-500/30 transition-colors duration-300`}>
                          <CheckCircle className={`h-3 w-3 text-${method.color}-400 group-hover/feature:scale-110 transition-transform duration-300`} />
                        </div>
                        <span className="text-sm text-gray-300 group-hover/feature:text-white transition-colors duration-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex justify-center">
                  <Badge 
                    variant={method.id === 'anon-aadhaar' ? 'success' : 'info'}
                    className={`text-xs px-4 py-2 rounded-full font-medium transition-all duration-300 group-hover:scale-105 ${
                      method.id === 'anon-aadhaar' 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30 group-hover:bg-green-500/30' 
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30 group-hover:bg-blue-500/30'
                    }`}
                  >
                    {method.id === 'anon-aadhaar' ? 'India Focused' : 'Global Support'}
                  </Badge>
                </div>

                {/* Select Button */}
                <button
                  onClick={() => handleMethodSelect(method.id, method.onSelect)}
                  className="w-full py-4 px-6 rounded-2xl font-bold text-base transition-all duration-500 shadow-2xl hover:shadow-3xl hover:scale-105 group border-2 bg-black/20 backdrop-blur-2xl border-white/20 text-white hover:bg-black/30 hover:border-white/30 hover:text-gray-100 hover:ring-2 hover:ring-white/20"
                >
                  <span className="flex items-center justify-center">
                    Choose {method.name}
                    <ArrowRight className="h-5 w-5 ml-3 group-hover:translate-x-1 transition-transform duration-500" />
                  </span>
                </button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Premium Privacy Section */}
      <div className="mt-16">
        <div className="relative bg-gradient-to-r from-black/20 via-black/30 to-black/20 backdrop-blur-2xl border border-white/15 rounded-3xl p-12 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden ring-1 ring-white/5 group">
          {/* Premium background elements */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(59,130,246,0.05)_0%,transparent_50%)]"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '4s'}}></div>
          
          <div className="relative z-10 text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white text-sm font-medium mb-6 group-hover:bg-white/20 transition-all duration-500">
              <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-blue-400 rounded-full mr-2 animate-pulse"></div>
              Privacy Guaranteed
            </div>
            <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-gray-100 transition-colors duration-300">
              Zero-Knowledge Security
            </h3>
            <p className="text-gray-300 text-base leading-relaxed max-w-3xl mx-auto group-hover:text-gray-200 transition-colors duration-300">
              Both verification methods use zero-knowledge proofs to protect your personal information. 
              Your identity data never leaves your device - only mathematical proofs are generated.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
