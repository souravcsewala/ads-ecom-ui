'use client';

import { useState } from 'react';

export default function FAQSection({ adType }) {
  const isVideo = adType === 'video';
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'Will these ad creatives work for my product or niche?',
      answer: 'Yes. Adexxpress is built specifically for e-commerce brands and works across most product categories. We create both image and video ad creatives, using proven ad principles like clear messaging, strong visuals, and conversion intent—so the ads are adaptable, not generic.',
    },
    {
      question: 'What types of ad creatives do you provide?',
      answer: 'We provide high-quality image ads and short-form video ads designed for e-commerce advertising. All creatives are optimized for platforms like Facebook, Instagram, and Google, and delivered ready to launch.',
    },

    {
      question: 'How is this different from using AI tools or templates?',
      answer: 'AI tools can generate visuals quickly, but they often lack context and refinement. Adexxpress is an AGS-built product, where every image and video creative is professionally reviewed and refined to meet real ad performance standards—not just visual output.',
    },
    {
      question: isVideo ? 'How long is your professional creation process?' : 'How does your professional team work?',
      answer: isVideo
        ? 'Our professional team typically delivers your video ads within 1 day. We use advanced AI tools combined with expert oversight to ensure quick turnaround without compromising on quality.'
        : 'Our expert team uses advanced AI tools to create professional ads that match your inspiration. We handle the entire creative process, from concept to final delivery, ensuring consistent quality and style matching.',
    },
    {
      question: isVideo ? 'What if the video doesn\'t match my inspiration?' : 'What if the image doesn\'t match my inspiration?',
      answer: isVideo
        ? 'We offer revisions to ensure your video ads match your inspiration perfectly. Our team works closely with you to refine the creative until it meets your expectations. Customer satisfaction is our priority.'
        : 'We offer revisions to ensure your image ads match your inspiration perfectly. Our team works closely with you to refine the creative until it meets your expectations. Customer satisfaction is our priority.',
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-10 md:py-20 bg-gradient-to-b from-purple-50 to-purple-50/30">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600">
            Adexxpress is a product by AGS, built to deliver fast, reliable, and performance-focused  {isVideo ? 'video' : 'image'} ad creatives for e-commerce brands
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-purple-50/50 border-2 border-gray-200 overflow-hidden">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-purple-50 transition-colors cursor-pointer"
              >
                <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                <svg
                  className={`w-5 h-5 text-purple-600 flex-shrink-0 transition-transform ${openIndex === index ? 'rotate-180' : ''
                    }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndex === index && (
                <div className="px-6 py-4 border-t border-gray-200">
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

