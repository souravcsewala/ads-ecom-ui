export default function WhyChooseSection({ adType }) {
  const isVideo = adType === 'video';
  
  const features = [
    {
      title: 'Your Find Winning Ads',
      description: isVideo 
        ? 'Leverage Meta Ads Library, Adna, Foreplay to research winning ads. Send us your inspiration list and we\'ll handle the rest.'
        : 'Leverage Meta Ads Library, Adna, Foreplay to research winning ads. Send us your inspiration list and we\'ll handle the rest.',
    },
    {
      title: 'Our Team\'s Professional Creation',
      description: isVideo
        ? 'Our expert team uses advanced AI tools to create professional ads that match your inspiration. No learning curve, no trial and error - just results.'
        : 'Our expert team uses advanced AI tools to create professional ads that match your inspiration. No learning curve, no trial and error - just results.',
    },
    {
      title: 'Result: High-Converting Ads',
      description: isVideo
        ? 'Get professional quality ads ready for your campaigns. Focus on strategy & scaling while we handle the technical creative process.'
        : 'Get professional quality ads ready for your campaigns. Focus on strategy & scaling while we handle the technical creative process.',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-purple-50/30 to-purple-50">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why E-Commerce Teams Choose Our Professional Ad Creation
          </h2>
          <p className="text-lg text-gray-600">
            {isVideo 
              ? 'You need at finding winning ads with Meta Ads Library, Adna, and Foreplay. Our professional team excels at creating the winning cutting edge AI tools.'
              : 'You\'re tired of finding winning ads with Meta Ads Library, Adna, and Foreplay. Our professional team will create high-converting AI ads using cutting-edge AI tools.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-purple-50/50 p-8 rounded-xl border-2 border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

