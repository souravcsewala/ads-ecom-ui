'use client';

export default function HeroSection({ adType, onAdTypeChange, onBuyClick }) {
  return (
    <section id="hero" className="pt-32 pb-20 bg-gradient-to-b from-purple-950 via-purple-900 to-purple-950 relative overflow-hidden">
      {/* Animated Background Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Shopping Cart Icon */}
        <div className="absolute top-20 left-10 animate-pulse opacity-20">
          <svg className="w-16 h-16 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        
        {/* Chart/Graph Icon */}
        <div className="absolute top-40 right-20 animate-pulse opacity-20" style={{ animationDelay: '0.5s' }}>
          <svg className="w-14 h-14 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>

        {/* Sparkles/Stars Icon */}
        <div className="absolute bottom-32 left-1/4 animate-pulse opacity-20" style={{ animationDelay: '1s' }}>
          <svg className="w-12 h-12 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>

        {/* Trending Arrow Icon */}
        <div className="absolute top-60 left-1/3 animate-pulse opacity-20" style={{ animationDelay: '1.5s' }}>
          <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>

        {/* AI/Brain Icon */}
        <div className="absolute bottom-40 right-1/4 animate-pulse opacity-20" style={{ animationDelay: '0.7s' }}>
          <svg className="w-14 h-14 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>

        {/* Video Camera Icon */}
        <div className="absolute top-32 right-1/3 animate-pulse opacity-20" style={{ animationDelay: '0.3s' }}>
          <svg className="w-12 h-12 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>

        {/* Image Icon */}
        <div className="absolute bottom-60 left-1/2 animate-pulse opacity-20" style={{ animationDelay: '0.9s' }}>
          <svg className="w-11 h-11 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>

        {/* Rocket Icon */}
        <div className="absolute top-1/2 right-10 animate-pulse opacity-20" style={{ animationDelay: '1.2s' }}>
          <svg className="w-13 h-13 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>

        {/* Target/Bullseye Icon */}
        <div className="absolute bottom-20 right-1/3 animate-pulse opacity-20" style={{ animationDelay: '0.6s' }}>
          <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <p className="text-sm font-semibold text-purple-200 mb-4 uppercase tracking-wide">
            Professional Team | AI Tools | High Converting Ads
          </p>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Buy Professional E-Commerce Ads Created by Our Expert Team
          </h1>
          <p className="text-lg md:text-xl font-semibold text-purple-200 mb-6 uppercase tracking-wide">
            SAVE TIME. SAVE MONEY. GET BETTER ADS.
          </p>
          <p className="text-lg text-purple-100 mb-12 leading-relaxed">
            Send us your winning ad inspiration from Meta Ads Library, Adna, or Foreplay. Our professional team uses advanced AI tools to create high-converting image and video ads that match your vision perfectly.
          </p>

          <div className="flex flex-col md:flex-row gap-6 justify-center mb-8">
            <div
              className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                adType === 'video'
                  ? 'border-purple-300 bg-purple-700/50 shadow-lg backdrop-blur-sm'
                  : 'border-purple-600/30 bg-purple-800/30 hover:border-purple-500/50 backdrop-blur-sm'
              }`}
              onClick={() => onAdTypeChange('video')}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-400 to-indigo-400 flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-white">Professional Video Ads</h3>
                  <p className="text-sm text-purple-200">Expert team + AI tools</p>
                  <p className="text-sm font-semibold text-purple-300 mt-1">Starting from ₹1000</p>
                </div>
              </div>
            </div>

            <div
              className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                adType === 'image'
                  ? 'border-purple-300 bg-purple-700/50 shadow-lg backdrop-blur-sm'
                  : 'border-purple-600/30 bg-purple-800/30 hover:border-purple-500/50 backdrop-blur-sm'
              }`}
              onClick={() => onAdTypeChange('image')}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-white">Professional Image Ads</h3>
                  <p className="text-sm text-purple-200">Expert team + AI tools</p>
                  <p className="text-sm font-semibold text-purple-300 mt-1">Starting from ₹500</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onBuyClick}
              className="px-8 py-4 bg-gradient-to-r from-purple-400 to-indigo-400 text-white rounded-lg font-semibold text-lg hover:from-purple-300 hover:to-indigo-300 transition-all shadow-lg hover:shadow-xl"
            >
              {adType === 'video' ? 'Buy Professional Video Ads' : 'Buy Professional Image Ads'}
            </button>
            <button
              onClick={() => {
                const element = document.getElementById('how-it-works');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-4 bg-white/10 border-2 border-purple-300 text-white rounded-lg font-semibold text-lg hover:bg-white/20 backdrop-blur-sm transition-all"
            >
              See Our Process
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

