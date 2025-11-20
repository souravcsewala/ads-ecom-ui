export default function Footer({ adType }) {
  const isVideo = adType === 'video';

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Buy Ecom Ads</h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
          {isVideo
            ? 'You can find winning ads, our professional team creates them using advanced AI tools. The perfect tool for e-commerce brands.'
            : 'You\'re tired of winning ads, but you\'ve not found a way to create high-converting AI ads. Your professional team is here to create them for you.'}
        </p>
        <p className="text-gray-400 text-sm">
          © 2024 Buy Ecom Ads. All rights reserved. | Professional Team + AI Tools
        </p>
      </div>
    </footer>
  );
}

