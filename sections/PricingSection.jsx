export default function PricingSection({ adType, onBuyClick, plans: serverPlans = [], onAdTypeChange = () => {} }) {
  const isVideo = adType === 'video';

  // Use server plans if available, otherwise fallback to hardcoded
  const hasServerPlans = serverPlans && serverPlans.length > 0;
  
  // Filter plans by adType
  const filteredPlans = hasServerPlans 
    ? serverPlans.filter(plan => plan.planType === adType && plan.isActive)
    : [];

  // Fallback hardcoded plans if no server plans
  const imagePlans = [
    {
      tag: 'New Here? Start Here',
      tagColor: 'bg-green-500',
      price: '₹1,000',
      pricePer: 'per image ad',
      total: 'Total: ₹5,000',
      features: [
        'Professional team creates 5 image ads',
        '5 single quality image ads',
        'Professional team + AI tools',
        'Style match to inspiration',
        '3-5 days delivery',
        'Money back guarantee',
      ],
      cta: 'Buy 5 Professional Images',
    },
    {
      tag: 'Most Popular',
      tagColor: 'bg-purple-600',
      price: '₹950',
      pricePer: 'per image ad',
      total: 'Total: ₹9,500',
      features: [
        '10 professional image ads',
        '10 unique image ads',
        'Expert team + AI tools',
        '2 style matching to inspiration',
        '3-5 days delivery',
        'Priority support',
      ],
      cta: 'Buy 10 Professional Images',
      popular: true,
    },
    {
      price: '₹900',
      pricePer: 'per image ad',
      total: 'Total: ₹18,000',
      features: [
        '20 professional image ads',
        '20 unique image ads',
        'Expert team + AI tools',
        '3 style matching to inspiration',
        '3-5 days delivery',
        'Dedicated account manager',
      ],
      cta: 'Buy 20 Professional Images',
    },
  ];

  const videoPlans = [
    {
      price: '₹9,500',
      pricePer: 'per video ad',
      total: '₹95,000',
      description: 'Best for small e-commerce campaigns',
      features: [
        '10 professional video ads',
        'Max 30 seconds per video',
        'Don\'t have AI tools',
        '1 day matching inspiration',
        '1 revision per video',
        'Free by expert',
      ],
      cta: 'Buy 10 Professional Video',
    },
    {
      tag: 'Most Popular',
      tagColor: 'bg-purple-600',
      price: '₹10,000',
      pricePer: '',
      total: '',
      description: 'Professional Ecom Video Ads',
      features: [
        '1 single video ads',
        'Max 20 seconds per video',
        '1 professional team',
        '1 day turnaround',
        '1 revision for your inspiration',
        '100% satisfaction',
        'Video ads only',
      ],
      cta: 'Buy Professional Video',
      popular: true,
    },
    {
      price: '₹9,000',
      pricePer: 'per video ad',
      total: '₹1,80,000',
      description: 'Best for scaling e-commerce ads',
      features: [
        '20 professional video ads',
        'Max 25 seconds per video',
        'Don\'t have AI tools',
        '1 day matching inspiration',
        '1 revision per video',
        'Free by expert',
      ],
      cta: 'Buy 20 Professional Video',
    },
  ];

  // Helper function to extract number of ads from text
  const extractNumberOfAds = (text) => {
    if (!text) return null;
    const match = text.match(/\b(\d+)\b/);
    return match ? parseInt(match[1]) : null;
  };

  // Use server plans if available, otherwise use hardcoded
  const plans = hasServerPlans 
    ? filteredPlans.map(plan => {
        // Extract numberOfAds from plan name, CTA, or first feature
        const numberOfAds = extractNumberOfAds(plan.planName) || 
                           extractNumberOfAds(plan.cta) || 
                           (plan.features?.[0] ? extractNumberOfAds(plan.features[0]) : null);
        
        return {
          planName: plan.planName || '',
          tag: plan.tag || '',
          tagColor: plan.tagColor || '',
          price: `₹${plan.price?.toLocaleString('en-IN') || '0'}`,
          pricePer: plan.pricePer || '',
          total: plan.total || '',
          description: plan.description || '',
          features: plan.features || [],
          cta: plan.cta || plan.planName,
          popular: plan.isPopular || false,
          planId: plan._id,
          numberOfAds: numberOfAds,
        };
      })
    : (isVideo ? videoPlans : imagePlans).map(plan => ({
        ...plan,
        numberOfAds: extractNumberOfAds(plan.cta) || extractNumberOfAds(plan.features?.[0]),
      }));
  
  const adTypeName = isVideo ? 'Video' : 'Image';

  return (
    <section id="pricing" className="py-20 bg-purple-50/30">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Buy Professional {adTypeName} Ads
          </h2>
          <p className="text-lg text-gray-600">
            Send us your inspiration from Meta Ads Library, Adna, or Foreplay and our professional team will create high-converting {isVideo ? 'video' : 'image'} ads using advanced AI tools.
          </p>
          <div className="mt-6 inline-flex rounded-full bg-white shadow-inner p-1">
            {['image', 'video'].map((type) => (
              <button
                key={type}
                onClick={() => onAdTypeChange(type)}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                  adType === type
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                {type === 'image' ? 'Image Plans' : 'Video Plans'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white p-8 rounded-2xl border-2 relative ${
                (plan.popular || (plan.tag && plan.tag.toLowerCase().includes('most popular')))
                  ? 'border-blue-500 shadow-2xl scale-105 ring-2 ring-blue-300 ring-offset-2'
                  : 'border-gray-200 hover:border-blue-200 shadow-sm'
              } transition-all`}
            >
              {plan.tag && (
                <div className={`absolute -top-4 left-6 ${plan.tagColor} text-white px-4 py-1 rounded-full text-sm font-semibold`}>
                  {plan.tag}
                </div>
              )}
              <div className="mb-6">
                {plan.planName && (
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{plan.planName}</h3>
                )}
                <div className="text-3xl font-bold text-gray-900 mb-1">{plan.price}</div>
                {plan.pricePer && (
                  <div className="text-sm text-gray-600 mb-2">{plan.pricePer}</div>
                )}
                {plan.total && (
                  <div className="text-lg font-semibold text-purple-600">{plan.total}</div>
                )}
                {plan.description && (
                  <div className="text-sm text-gray-600 mt-2">{plan.description}</div>
                )}
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => {
                  // Use numberOfAds from plan if available, otherwise extract from text
                  const numberOfAds = plan.numberOfAds || null;
                  onBuyClick(plan.cta, plan.price, plan.planId, numberOfAds);
                }}
                className={`w-full px-6 py-3 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg ${
                  plan.popular
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
          
          {/* Custom Plan Card */}
          <div className="bg-gradient-to-br from-purple-100 to-indigo-100 p-8 rounded-xl border-2 border-purple-300 hover:border-purple-400 transition-all flex flex-col justify-center items-center text-center">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Custom Plan
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Need a custom solution? Fill out our form and we&apos;ll create a plan tailored to your needs.
              </p>
            </div>
            <button
              onClick={() => onBuyClick('Custom Plan', 'Contact for pricing', null, null)}
              className="w-full px-6 py-3 bg-white border-2 border-purple-600 text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-all shadow-md hover:shadow-lg"
            >
              Fill Custom Plan
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

