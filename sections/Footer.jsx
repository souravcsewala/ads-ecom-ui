export default function Footer({ adType, onBuyClick }) {
  const isVideo = adType === 'video';

  const handleBuyClick = () => {
    if (onBuyClick) {
      onBuyClick();
    } else {
      // Fallback: scroll to pricing section
      const element = document.getElementById('pricing');
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#0a0414] text-white py-16 relative overflow-hidden">
      {/* Glowing Round Shapes */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-purple-500/30 to-pink-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-blue-500/25 to-purple-500/20 rounded-full blur-3xl"></div>
      
      {/* Decorative Star Shape */}
      <div className="absolute bottom-0 right-0 w-32 h-32 text-purple-900/30 transform rotate-12">
        <svg viewBox="0 0 100 100" fill="currentColor">
          <path d="M50 10 L60 40 L90 40 L65 60 L75 90 L50 70 L25 90 L35 60 L10 40 L40 40 Z" />
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Main CTA Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Scale Your Brand with Better Creatives?
          </h2>
          <p className="text-lg md:text-xl text-purple-200 mb-8 max-w-3xl mx-auto leading-relaxed">
            Boost your brand with scroll stopping creatives made for Facebook, Instagram, and Google.
          </p>
          <button
            onClick={handleBuyClick}
            className="px-8 py-4 bg-white text-gray-900 rounded-lg font-semibold text-lg hover:bg-purple-50 transition-all shadow-lg hover:shadow-xl border-2 border-gray-200 cursor-pointer"
          >
            Buy Ecom Ads Now
          </button>
        </div>

        {/* Contact Buttons Section */}
        <div className="flex flex-wrap gap-4 justify-center items-center mb-8 pb-8 border-b border-purple-800/50">
          <a
            href="mailto:official@sisyphusinfotech.com"
            className="flex items-center gap-2 px-6 py-3 bg-purple-800/50 hover:bg-purple-700/50 text-white rounded-lg font-medium transition-all border border-purple-700/50 hover:border-purple-600/50 shadow-md hover:shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>official@sisyphusinfotech.com</span>
          </a>
          <a
            href="tel:+919038130595"
            className="flex items-center gap-2 px-6 py-3 bg-purple-800/50 hover:bg-purple-700/50 text-white rounded-lg font-medium transition-all border border-purple-700/50 hover:border-purple-600/50 shadow-md hover:shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span>+91-9038130595</span>
          </a>
        </div>

        {/* Copyright Line */}
        <div className="text-center">
          <p className="text-purple-400 text-sm">
            © 2024 Buy Ecom Ads. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

