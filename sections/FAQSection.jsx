'use client';

import { useState } from 'react';

export default function FAQSection({ adType }) {
  const isVideo = adType === 'video';
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'How does buying professional ads fit into our research process?',
      answer: 'Our service seamlessly integrates with your existing research workflow. You continue using Meta Ads Library, Adna, or Foreplay to find winning ads, then send us your inspiration. Our professional team handles the creation process, so you can focus on strategy and scaling.',
    },
    {
      question: 'Do you create ad strategies and concepts for us?',
      answer: 'We focus on creating professional ads based on your inspiration. You provide the winning ad concepts you\'ve researched, and our expert team uses advanced AI tools to create high-quality versions that match your vision.',
    },
    {
      question: isVideo ? 'What makes your team different from DIY ads?' : 'What makes your team different from DIY AI tools?',
      answer: 'Our professional team combines human expertise with cutting-edge AI tools. Unlike DIY solutions, we ensure consistent quality, proper style matching, and professional results every time. No learning curve, no trial and error - just professional ads ready for your campaigns.',
    },
    {
      question: 'What inspiration materials do I need to provide?',
      answer: 'Simply send us your winning ad inspiration from Meta Ads Library, Adna, Foreplay, or any research tool. You can share screenshots, links, or descriptions of the ads that caught your attention. Our team will handle the rest.',
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
    <section className="py-20 bg-gradient-to-b from-purple-50 to-purple-50/30">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600">
            Everything you need to know about buying professional AI {isVideo ? 'video' : 'image'} ads from our expert team.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-purple-50/50 rounded-xl border-2 border-gray-200 overflow-hidden">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-purple-50 transition-colors"
              >
                <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                <svg
                  className={`w-5 h-5 text-purple-600 flex-shrink-0 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
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

