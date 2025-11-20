export default function HowItWorksSection({ adType }) {
  const isVideo = adType === 'video';

  const steps = [
    {
      number: 1,
      title: 'You Send Winning Ad Inspiration',
      description: isVideo
        ? 'Meta Ads Library, Adna, Foreplay, or any tool to research for winning ads. Send us your creative of winning videos and images directly.'
        : 'Use Meta Ads Library, Adna, Foreplay, or any tool to research high-performing image ads. Send us your list of winning images and we\'ll handle the rest.',
    },
    {
      number: 2,
      title: 'Our Team Creates Professional Ads',
      description: isVideo
        ? 'Our expert team uses advanced AI tools to create professional ads that match your inspiration. Our team will create high quality, every time.'
        : 'Our expert team uses advanced AI tools to create professional ads that match your inspiration, brand\'s style, and approach. Professional, high-quality results.',
    },
    {
      number: 3,
      title: 'You Get Campaign-Ready Ads',
      description: isVideo
        ? 'Receive professional ads ready to use. Our team will create for your e-commerce ads, video ads, and image ads directly.'
        : 'Receive polished image ads ready for campaigns. Clean, consistent, and pixel-perfect, each image. Focus on strategy while we handle the creative.',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-b from-purple-50 to-purple-50/30">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How Our Professional Team Creates Your Winning Ads
          </h2>
          <p className="text-lg text-gray-600">
            {isVideo
              ? 'Smart e-commerce teams have discovered the perfect solution to create winning ads. Then buy professional versions from our expert team.'
              : 'Smart e-commerce teams have discovered the perfect solution: research winning ads, then buy professional versions from our expert team.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl font-bold text-white">{step.number}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

