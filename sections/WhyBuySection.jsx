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
    <section className="py-20 bg-gradient-to-b from-purple-50 via-white to-purple-50 relative overflow-hidden">
      {/* Background decorative shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pink-200/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full text-sm font-semibold shadow-lg">
              Why Choose Us
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-900 via-purple-700 to-indigo-700 bg-clip-text text-transparent mb-6">
            Why Buy Professional {isVideo ? 'Video' : 'Image'} Ads?
          </h2>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
            {isVideo
              ? 'Smart e-commerce teams focus on their strengths: finding winning concepts and scaling campaigns. Professional video creation requires a specialized team, so smart teams simply buy from our team to save time.'
              : 'Smart e-commerce teams focus on their strengths like finding winning insight and scaling campaigns. Professional image creation, ad copy, inspiration, and specialized expertise are crucial for success. Our team handles the creative process, so you can focus on what matters most.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Challenges Card */}
          <div className="relative bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 p-8 rounded-2xl border-2 border-red-200/50 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group">
            {/* Decorative background shapes */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-red-300/10 rounded-full -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-300/10 rounded-full -ml-16 -mb-16"></div>
            <div className="absolute top-1/2 right-4 w-24 h-24 bg-red-200/20 rounded-lg rotate-45"></div>
            <div className="absolute bottom-4 left-4 w-16 h-16 bg-rose-200/20 rounded-full"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {isVideo ? 'DIY Creative Challenges' : 'Creative Challenges'}
                </h3>
              </div>
              <ul className="space-y-4">
                {challenges.map((challenge, index) => (
                  <li key={index} className="flex items-start gap-3 group/item">
                    <div className="w-6 h-6 rounded-full bg-white border-2 border-red-400 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover/item:bg-red-500 group-hover/item:border-red-500 transition-colors">
                      <svg className="w-4 h-4 text-red-500 group-hover/item:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <span className="text-gray-700 font-medium leading-relaxed">{challenge}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Benefits Card */}
          <div className="relative bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-8 rounded-2xl border-2 border-green-200/50 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group">
            {/* Decorative background shapes */}
            <div className="absolute top-0 left-0 w-40 h-40 bg-green-300/10 rounded-full -ml-20 -mt-20"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-emerald-300/10 rounded-full -mr-16 -mb-16"></div>
            <div className="absolute top-1/2 left-4 w-24 h-24 bg-green-200/20 rounded-lg rotate-45"></div>
            <div className="absolute bottom-4 right-4 w-16 h-16 bg-teal-200/20 rounded-full"></div>
            <div className="absolute top-4 right-1/4 w-20 h-20 bg-emerald-200/15 rounded-full"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {isVideo ? 'Professional Ecom Services' : 'Professional Team Benefits'}
                </h3>
              </div>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3 group/item">
                    <div className="w-6 h-6 rounded-full bg-white border-2 border-green-400 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover/item:bg-green-500 group-hover/item:border-green-500 transition-colors">
                      <svg className="w-4 h-4 text-green-500 group-hover/item:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700 font-medium leading-relaxed">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Perfect Partnership Card */}
        <div className="relative bg-gradient-to-r from-blue-50 via-indigo-50 to-cyan-50 p-8 md:p-10 rounded-2xl border-2 border-blue-300/50 max-w-4xl mx-auto shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group">
          {/* Decorative background shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-200/20 to-indigo-200/20 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-gradient-to-tr from-cyan-200/20 to-blue-200/20 rounded-full -ml-28 -mb-28"></div>
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-indigo-200/15 rounded-lg rotate-45"></div>
          <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-blue-200/20 rounded-full"></div>
          <div className="absolute top-4 left-1/3 w-20 h-20 bg-cyan-200/15 rounded-full"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent mb-4">
                  Perfect Partnership
                </h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {isVideo
                    ? 'You need an AI-testing tool that helps you find winning ads quickly, consistently, and easily. Our team excels at creating professional video ads using advanced AI tools.'
                    : 'You excel at: finding winning ads, understanding your market, campaign strategy. Our team excels at: creating professional image ads using advanced AI tools.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

