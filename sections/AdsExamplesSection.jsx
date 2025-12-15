'use client';

import { useState, useEffect, useRef } from 'react';

export default function AdsExamplesSection({ adType, demoContent = [], isLoading = false, onAdTypeChange = () => {} }) {
  const [zoomImage, setZoomImage] = useState(null);
  const scrollContainerRef = useRef(null);
  const autoScrollRef = useRef({ isPaused: false, animationFrameId: null });
  const isVideo = adType === 'video';
  
  // Use server demo content if available, otherwise fallback to hardcoded
  const hasDemoContent = demoContent && demoContent.length > 0;
  
  const filteredDemoContent = hasDemoContent
    ? demoContent.filter(content => content.contentType === adType && content.isActive)
    : [];
  
  // Fallback hardcoded examples
  const fallbackExamples = isVideo 
    ? [
        { title: 'Beauty Brand Video Ads' },
        { title: 'E-commerce Product Videos' },
        { title: 'Home Decor Videos' },
      ]
    : [
        { title: 'Beauty Brand Static Ads' },
        { title: 'E-commerce Product Images' },
        { title: 'Home Decor Images' },
      ];
  
  const examples = hasDemoContent && filteredDemoContent.length > 0
    ? filteredDemoContent.map(content => ({
        title: content.title,
        description: content.description,
        imageUrl: content.imageUrl,
        videoUrl: content.videoUrl,
        thumbnailUrl: content.thumbnailUrl,
      }))
    : fallbackExamples;

  // Auto-scroll functionality
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || examples.length === 0) {
      return;
    }

    // Cancel any existing animation frame
    if (autoScrollRef.current.animationFrameId) {
      cancelAnimationFrame(autoScrollRef.current.animationFrameId);
    }

    // Reset scroll position and pause state
    container.scrollLeft = 0;
    autoScrollRef.current.isPaused = false;

    // Function to start auto-scroll
    const startAutoScroll = () => {
      if (!container) return;
      
      // Check if container has scrollable content
      const maxScroll = container.scrollWidth - container.clientWidth;
      if (maxScroll <= 0) {
        return false; // Not scrollable yet
      }

      let scrollPosition = 0;
      const scrollSpeed = 1; // pixels per frame

      const scroll = () => {
        if (!autoScrollRef.current.isPaused && container) {
          scrollPosition += scrollSpeed;
          
          // Reset scroll position when reaching the end (loop back to start)
          const currentMaxScroll = container.scrollWidth - container.clientWidth;
          if (currentMaxScroll > 0 && scrollPosition >= currentMaxScroll) {
            scrollPosition = 0;
          }
          
          container.scrollLeft = scrollPosition;
        }
        autoScrollRef.current.animationFrameId = requestAnimationFrame(scroll);
      };

      // Start scrolling immediately
      autoScrollRef.current.animationFrameId = requestAnimationFrame(scroll);
      return true;
    };

    // Use requestAnimationFrame to wait for next paint cycle, ensuring DOM is ready
    let retryTimers = [];
    const rafId = requestAnimationFrame(() => {
      // Try starting immediately after paint
      if (!startAutoScroll()) {
        // If not ready, retry with increasing delays
        retryTimers.push(setTimeout(() => startAutoScroll(), 200));
        retryTimers.push(setTimeout(() => startAutoScroll(), 500));
        retryTimers.push(setTimeout(() => startAutoScroll(), 1000));
      }
    });

    // Pause on hover
    const handleMouseEnter = () => {
      autoScrollRef.current.isPaused = true;
    };

    const handleMouseLeave = () => {
      autoScrollRef.current.isPaused = false;
    };

    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(rafId);
      retryTimers.forEach(timer => clearTimeout(timer));
      if (autoScrollRef.current.animationFrameId) {
        cancelAnimationFrame(autoScrollRef.current.animationFrameId);
      }
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [examples.length, adType, demoContent, isLoading]);

  // Manual navigation functions
  const scrollLeft = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    autoScrollRef.current.isPaused = true;
    const scrollAmount = container.clientWidth * 0.8; // Scroll 80% of container width
    container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    
    // Resume auto-scroll after a delay
    setTimeout(() => {
      autoScrollRef.current.isPaused = false;
    }, 2000);
  };

  const scrollRight = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    autoScrollRef.current.isPaused = true;
    const scrollAmount = container.clientWidth * 0.8; // Scroll 80% of container width
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    
    // Resume auto-scroll after a delay
    setTimeout(() => {
      autoScrollRef.current.isPaused = false;
    }, 2000);
  };

  return (
    <section className="py-20 bg-purple-50/30">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Professional {isVideo ? 'Video' : 'Image'} Ads That Convert
          </h2>
          <p className="text-lg text-gray-600">
            See how our professional team has transformed client inspiration into high-converting {isVideo ? 'video' : 'image'} campaigns using advanced AI tools.
          </p>
          <div className="mt-6 inline-flex rounded-full bg-white shadow-inner p-1">
            {['image', 'video'].map((type) => (
              <button
                key={type}
                onClick={() => onAdTypeChange(type)}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                  adType === type
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                {type === 'image' ? 'Image Ads' : 'Video Ads'}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <div className="relative">
            {/* Left Arrow Button */}
            <button
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all backdrop-blur-sm border border-purple-200 cursor-pointer"
              aria-label="Scroll left"
            >
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Right Arrow Button */}
            <button
              onClick={scrollRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all backdrop-blur-sm border border-purple-200 cursor-pointer"
              aria-label="Scroll right"
            >
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <div 
              ref={scrollContainerRef}
              className="flex gap-8 overflow-x-hidden scrollbar-hide"
              style={{ scrollBehavior: 'auto' }}
            >
          {examples.map((example, index) => (
            <div key={`${index}-${example.title || index}`} className="relative group flex-shrink-0 w-full md:w-[calc(33.333%-1.5rem)] min-w-[280px] max-w-[400px]">
              <div className={`${isVideo ? 'aspect-[9/16]' : 'aspect-square'} rounded-xl shadow-lg hover:shadow-xl transition-all overflow-hidden`}>
                {hasDemoContent && filteredDemoContent.length > 0 && (example.imageUrl || example.videoUrl) ? (
                  <div className="w-full h-full rounded-lg overflow-hidden">
                    {isVideo && example.videoUrl ? (
                      <video 
                        src={example.videoUrl} 
                        className="w-full h-full object-cover"
                        controls
                        autoPlay
                        loop
                        muted
                        playsInline
                        poster={example.thumbnailUrl}
                      />
                    ) : example.imageUrl ? (
                      <div className="relative w-full h-full">
                        <img 
                          src={example.imageUrl} 
                          alt={example.title}
                          className="w-full h-full object-cover cursor-zoom-in transition-transform duration-300 group-hover:scale-[1.02]"
                          onClick={() =>
                            setZoomImage({
                              url: example.imageUrl,
                              title: example.title,
                              description: example.description,
                            })
                          }
                        />
                        {/* Zoom Icon Overlay */}
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                          <div className="bg-black/60 backdrop-blur-sm rounded-full p-2.5">
                            <svg 
                              className="w-5 h-5 text-white" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" 
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full bg-purple-50/40 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center">
                            {isVideo ? (
                              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            ) : (
                              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            )}
                          </div>
                          <p className="text-sm font-semibold text-gray-700">Professional Result</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-full bg-purple-50/40 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center">
                        {isVideo ? (
                          <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        ) : (
                          <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-gray-700">Professional Result</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-4 text-center">
                <p className="font-semibold text-gray-900">{example.title}</p>
                {example.description && (
                  <p className="text-sm text-gray-600 mt-1">{example.description}</p>
                )}
              </div>
            </div>
          ))}
            </div>
          </div>
        )}
      </div>

      {zoomImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setZoomImage(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setZoomImage(null)}
              className="absolute top-4 right-4 text-white bg-black/60 hover:bg-black/80 rounded-full p-2 cursor-pointer"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="bg-black flex items-center justify-center p-6">
              <img
                src={zoomImage.url}
                alt={zoomImage.title}
                className="max-h-[80vh] max-w-full object-contain"
              />
            </div>
            <div className="p-6 bg-white">
              <h3 className="text-2xl font-semibold text-gray-900">{zoomImage.title}</h3>
              {zoomImage.description && (
                <p className="mt-2 text-gray-600">{zoomImage.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

