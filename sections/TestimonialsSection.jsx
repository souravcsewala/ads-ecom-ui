import { useState, useEffect } from 'react';

export default function TestimonialsSection({ adType }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    {
      quote: 'Ads are awesome with research ads, create awesome ads, and try to get a professional version made. It\'s the best platform to report ad creation without the extra overhead.',
      author: 'Rajesh Gupta',
      role: 'E-Com Pro',
    },
    {
      quote: 'We were struggling to create winning ads as there are many ads already, but now we just find the inspiration to get professionally polished versions. Perfect solution!',
      author: 'Neha Bhardwaj',
      role: 'HomeStyle Decor',
    },
    {
      quote: 'Since we started using this platform, things have changed. We send over our ideas, and they create high-quality video ads that actually work. The turnaround time is quick.',
      author: 'Amit Sinha',
      role: 'D2C Head',
    },
    {
      quote: 'The ROI we\'ve seen since switching to their professional ads is incredible. The creative team really understands what converts in the current market.',
      author: 'Sarah Jenkins',
      role: 'Marketing Lead',
    },
    {
      quote: 'Finally a service that delivers consistent quality. No more hit or miss with freelancers. These guys are an extension of our own team.',
      author: 'Mike Ross',
      role: 'Growth Manager',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Calculate distinct indices for 3 visible items: [prev, current, next]
  // We use modulo arithmetic to handle wrapping correctly
  const getVisibleIndices = () => {
    const len = testimonials.length;
    const prev = (activeIndex - 1 + len) % len;
    const next = (activeIndex + 1) % len;
    return [prev, activeIndex, next];
  };

  const visibleIndices = getVisibleIndices();

  return (
    <section id="testimonials" className="py-16 md:py-24 bg-purple-50/30 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What E-Commerce Teams Say About Our Professional Ads
          </h2>
          <p className="text-lg text-gray-600">
            Join hundreds of e-commerce teams who&apos;ve stopped struggling with DIY creation and started buying professional ads from our expert team.
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 max-w-7xl mx-auto min-h-[400px]">
          {visibleIndices.map((dataIndex, visualIndex) => {
            const testimonial = testimonials[dataIndex];
            const isCenter = visualIndex === 1; // Middle item of the 3 rendered

            return (
              <div
                key={`${dataIndex}-${visualIndex}`}
                className={`w-full md:w-1/3 transition-all duration-300 ease-in-out relative p-8 border-2 bg-purple-50/50 flex flex-col justify-between h-full min-h-[300px]
                  ${isCenter ? 'border-purple-300 ring-1 ring-purple-300 shadow-lg' : 'border-gray-200 hover:border-purple-300'}
                `}
              >
                <div>
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 leading-relaxed italic text-base">
                    "{testimonial.quote}"
                  </p>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <p className="font-bold text-gray-900">{testimonial.author}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center gap-2 mt-12">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${idx === activeIndex ? 'w-8 bg-purple-600' : 'w-2 bg-purple-200 hover:bg-purple-300'
                }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

