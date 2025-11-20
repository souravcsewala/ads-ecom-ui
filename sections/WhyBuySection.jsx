export default function WhyBuySection({ adType }) {
  const isVideo = adType === 'video';

  const challenges = isVideo
    ? [
        'Time consuming for finding winning ads',
        'COST-ineffective for ads',
        'Outdated software and tools',
        'Limited staff and AI',
        'Scaling limitations',
      ]
    : [
        'Time-consuming planning process',
        'Inconsistent quality results',
        'Team distracted from core tasks',
        'Expensive software and tools',
        'Shortage of ad creators',
        'Scaling bottlenecks',
      ];

  const benefits = isVideo
    ? [
        'Expert team + AI tools',
        'Consistent professional quality',
        'Cutting edge AI tools',
        '200% ROI/ROAS',
        'Good customer service',
        'Faster time to market',
      ]
    : [
        'Expertise & Speed',
        'Consistent professional quality',
        'Dedicated to core processes',
        'Scale without hiring',
        'Specialized expertise',
        'Faster time to market',
      ];

  return (
    <section className="py-20 bg-purple-50/30">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Buy Professional {isVideo ? 'Video' : 'Image'} Ads?
          </h2>
          <p className="text-lg text-gray-600">
            {isVideo
              ? 'Smart e-commerce teams focus on their strengths: finding winning concepts and scaling campaigns. Professional video creation requires a specialized team, so smart teams simply buy from our team to save time.'
              : 'Smart e-commerce teams focus on their strengths like finding winning insight and scaling campaigns. Professional image creation, ad copy, inspiration, and specialized expertise are crucial for success. Our team handles the creative process, so you can focus on what matters most.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-red-50 p-8 rounded-xl border-2 border-red-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                {isVideo ? 'DIY Creative Challenges' : 'Creative Challenges'}
              </h3>
            </div>
            <ul className="space-y-3">
              {challenges.map((challenge, index) => (
                <li key={index} className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-gray-700">{challenge}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-green-50 p-8 rounded-xl border-2 border-green-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                {isVideo ? 'Professional Ecom Services' : 'Professional Team Benefits'}
              </h3>
            </div>
            <ul className="space-y-3">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-xl border-2 border-green-300 max-w-3xl mx-auto">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Perfect Partnership</h3>
              <p className="text-gray-700 leading-relaxed">
                {isVideo
                  ? 'You need an AI-testing tool that helps you find winning ads quickly, consistently, and easily. Our team excels at creating professional video ads using advanced AI tools.'
                  : 'You excel at: finding winning ads, understanding your market, campaign strategy. Our team excels at: creating professional image ads using advanced AI tools.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

