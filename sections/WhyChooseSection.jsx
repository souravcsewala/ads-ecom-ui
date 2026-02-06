export default function WhyChooseSection({ adType }) {
  const isVideo = adType === 'video';

  const features = [
    {
      title: 'You Share Winning Inspiration',
      description: isVideo
        ? 'Got inspiration? Share it. Don’t? Our AGS team researches and creates high-impact creative directions. '
        : 'Got inspiration? Share it. Don’t? Our AGS team researches and creates high-impact creative directions. ',
    },
    {
      title: 'AGS Team Creates Your Ads',
      description: isVideo
        ? 'Our professional AGS creative team researches, designs, and delivers high-impact image and video ads—whether you bring inspiration or start fresh'
        : 'Our professional AGS creative team researches, designs, and delivers high-impact image and video ads—whether you bring inspiration or start fresh',
    },
    {
      title: ' High-Impact Ads, Ready to Run',
      description: isVideo
        ? 'Receive platform-ready ads for Facebook, Instagram, and Google — No learning curve, No delays. Just upload, launch, and scale'
        : 'Receive platform-ready ads for Facebook, Instagram, and Google — No learning curve, No delays. Just upload, launch, and scale',
    },
  ];

  return (
    <section className="py-10 md:py-20 bg-gradient-to-b from-purple-50/30 to-purple-50">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why E-Commerce Teams Choose Our Professional Ad Creation
          </h2>
          <p className="text-lg text-gray-600">
            {isVideo
              ? 'Tired of guessing which ads will work? Adexxpress, an AGS-powered service, helps e-commerce brands launch high-converting video ads faster—without trial and error.'
              : 'Tired of guessing which ads will work? Adexxpress, an AGS-powered service, helps e-commerce brands launch high-converting image ads faster—without trial and error.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-purple-50/50 p-8 border-2 border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center mb-4">
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

