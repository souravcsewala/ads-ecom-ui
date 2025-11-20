export default function TestimonialsSection({ adType }) {
  const isVideo = adType === 'video';

  const testimonials = isVideo
    ? [
        {
          quote: 'Ads are awesome with research ads, create awesome ads, and try to get a professional version made, but now we don\'t use the platform to find top performing ads, and then the experience from BuyEcomAds creates professional versions for us. It\'s the best platform to report ad creation without the extra overhead.',
          author: 'Rajesh Gupta',
          role: 'E-Com Pro',
        },
        {
          quote: 'We were struggling to create winning ads as there are many ads already, but now we just find the inspiration to get professionally polished versions from the team. It\'s the perfect solution - we save time and get better results!',
          author: 'Neha Bhardwaj',
          role: 'HomeStyle Decor',
        },
        {
          quote: 'We were constantly trying to find the best performing ads for Meta, but it always felt like a hit or miss. Since we started using this platform, things have changed. We send over our ideas, and they create high-quality video ads that actually work. The turnaround time is quick, and the results speak for themselves.',
          author: 'Amit Sinha',
          role: 'D2C Head',
        },
      ]
    : [
        {
          quote: 'Earlier, we were stuck with research-only, creative inspiration ideas, and couldn\'t get a professional version into ads. But now, we\'ve found a new platform for Best EcomAds for winning ads, and I love the expert team from BuyEcomAds creates professional versions for us. We are looking forward to expect more creations and have an extra discount!',
          author: 'Rajesh Toshi',
          role: 'E-com Ops Head',
        },
        {
          quote: 'We were struggling for months to generate ads but we never got them right. Finally, I found this and got the inspiration. I just got professionally created versions from their team. It\'s the perfect solution - no one can create ads for better results!',
          author: 'Neha Bharadwaj',
          role: 'Marketing Director',
        },
        {
          quote: 'We were consistently trying to find the best performing creatives. Now, we\'ve started using this platform. Things have changed! We save time, money, and they create high-quality video ads that actually work. The turnaround time is quick, and the results speak for themselves!',
          author: 'Amit Toshi',
          role: 'Co-founder',
        },
      ];

  return (
    <section id="testimonials" className="py-20 bg-purple-50/30">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What E-Commerce Teams Say About Our Professional Ads
          </h2>
          <p className="text-lg text-gray-600">
            Join hundreds of e-commerce teams who've stopped struggling with DIY creation and started buying professional ads from our expert team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-purple-50/50 p-8 rounded-xl border-2 border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed italic">"{testimonial.quote}"</p>
              <div className="border-t border-gray-200 pt-4">
                <p className="font-bold text-gray-900">{testimonial.author}</p>
                <p className="text-sm text-gray-600">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

