'use client';

import { useState, useEffect, useRef } from 'react';

export default function TeamSection({ adType, teamMembers: serverTeamMembers = [] }) {
  const scrollContainerRef = useRef(null);
  const autoScrollRef = useRef({ isPaused: false, animationFrameId: null });
  const isVideo = adType === 'video';

  // Use server team members if available, otherwise fallback to hardcoded
  const hasTeamMembers = serverTeamMembers && serverTeamMembers.length > 0;
  
  // Fallback hardcoded team members
  const fallbackTeamMembers = isVideo
    ? [
        { name: 'Indira', role: 'Chief Winreach' },
        { name: 'Priyal', role: 'Ad Whisperer' },
        { name: 'Nica', role: 'Cloud Optimization' },
      ]
    : [
        { name: 'Trisha', role: 'Chief Of Growth' },
        { name: 'Priyali', role: 'Ad Whisperer' },
        { name: 'Naina', role: 'Head Of Creative' },
      ];
  
  const teamMembers = hasTeamMembers && serverTeamMembers.length > 0
    ? serverTeamMembers.map(member => ({
        name: member.name,
        role: member.role,
        bio: member.bio,
        image: member.image,
        socialLinks: member.socialLinks,
      }))
    : fallbackTeamMembers;

  // Auto-scroll functionality
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || teamMembers.length === 0) return;

    let scrollPosition = 0;
    const scrollSpeed = 0.5; // pixels per frame

    const scroll = () => {
      if (!autoScrollRef.current.isPaused) {
        scrollPosition += scrollSpeed;
        
        // Reset scroll position when reaching the end (loop back to start)
        const maxScroll = container.scrollWidth - container.clientWidth;
        if (scrollPosition >= maxScroll) {
          scrollPosition = 0;
        }
        
        container.scrollLeft = scrollPosition;
      }
      autoScrollRef.current.animationFrameId = requestAnimationFrame(scroll);
    };

    // Start scrolling
    autoScrollRef.current.animationFrameId = requestAnimationFrame(scroll);

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
      if (autoScrollRef.current.animationFrameId) {
        cancelAnimationFrame(autoScrollRef.current.animationFrameId);
      }
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [teamMembers.length, adType]);

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
    <section id="team" className="py-20 bg-gradient-to-b from-purple-50/30 to-purple-50">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Meet Our Creative Team
          </h2>
          <p className="text-lg text-gray-600">
            The talented professionals behind every successful ad campaign - each bringing their unique expertise to create content that converts.
          </p>
        </div>

        <div className="relative">
          {/* Left Arrow Button */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all backdrop-blur-sm border border-purple-200"
            aria-label="Scroll left"
          >
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all backdrop-blur-sm border border-purple-200"
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
            {teamMembers.map((member, index) => (
              <div key={`${index}-${member.name || index}`} className="relative group flex-shrink-0 text-center w-full md:w-[calc(33.333%-1.5rem)] min-w-[280px] max-w-[350px]">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 mx-auto mb-4 flex items-center justify-center shadow-lg overflow-hidden">
                  {member.image?.url ? (
                    <img 
                      src={member.image.url} 
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl font-bold text-white">{member.name[0]}</span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-purple-600 font-semibold">{member.role}</p>
                {member.bio && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{member.bio}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

