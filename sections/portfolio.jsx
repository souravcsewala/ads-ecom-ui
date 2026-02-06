'use client';

import { useState, useRef, useEffect } from 'react';
import { api } from '../lib/api';

export default function PortfolioSection() {
    const [portfolios, setPortfolios] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const scrollContainerRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    // Fetch portfolio data from API
    useEffect(() => {
        const fetchPortfolioData = async () => {
            try {
                setIsLoading(true);
                const response = await api.getPortfolio();

                if (response.success && response.portfolios) {
                    // Map to portfolio format
                    const portfolioItems = response.portfolios.map((item, index) => ({
                        id: item._id || index,
                        title: item.title || 'Untitled Design',
                        imageUrl: item.imageUrl,
                        figmaLink: item.linkUrl && item.linkUrl.trim() !== '' ? item.linkUrl : '#',
                        category: item.category || 'Design',
                        hasLink: item.linkUrl && item.linkUrl.trim() !== ''
                    }));

                    setPortfolios(portfolioItems);
                } else {
                    setPortfolios([]);
                }
            } catch (error) {
                console.error('Error fetching portfolio data:', error);
                setPortfolios([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPortfolioData();
    }, []);

    const checkScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
        }
    };

    useEffect(() => {
        if (portfolios.length > 0) {
            checkScroll();
            window.addEventListener('resize', checkScroll);
            return () => window.removeEventListener('resize', checkScroll);
        }
    }, [portfolios]);

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const { clientWidth } = scrollContainerRef.current;
            const scrollAmount = clientWidth; // Scroll one full container width (3 items on desktop)
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
            setTimeout(checkScroll, 500);
        }
    };

    return (
        <section className="py-12 md:py-24 bg-white relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-purple-100/50 blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-indigo-100/50 blur-3xl pointer-events-none"></div>

            <div className="container mx-auto px-6 relative">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div className="max-w-2xl">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
                            Performance-Driven <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Designs</span>
                        </h2>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            We don’t design blindly. Every creative is built using performance insights like audience behavior, hook placement, visual hierarchy, and conversion triggers                        </p>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => scroll('left')}
                            disabled={!canScrollLeft}
                            className={`p-4 rounded-full border-2 transition-all duration-300 ${canScrollLeft
                                ? 'border-purple-600 text-purple-600 hover:bg-purple-50 cursor-pointer shadow-sm'
                                : 'border-gray-200 text-gray-300 cursor-not-allowed'
                                }`}
                            aria-label="Previous items"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            disabled={!canScrollRight}
                            className={`p-4 rounded-full border-2 transition-all duration-300 ${canScrollRight
                                ? 'border-purple-600 text-purple-600 hover:bg-purple-50 cursor-pointer shadow-sm'
                                : 'border-gray-200 text-gray-300 cursor-not-allowed'
                                }`}
                            aria-label="Next items"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-24">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                    </div>
                ) : portfolios.length === 0 ? (
                    <div className="text-center py-24">
                        <p className="text-gray-600 text-lg">No portfolio items available at the moment.</p>
                    </div>
                ) : (
                    <div
                        ref={scrollContainerRef}
                        onScroll={checkScroll}
                        className="flex gap-8 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-8"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {portfolios.map((item) => (
                            <div
                                key={item.id}
                                className="flex-shrink-0 w-full md:w-[calc(33.333%-1.33rem)] snap-start group"
                            >
                                <div className="relative aspect-[4/5] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 bg-gray-100">
                                    <img
                                        src={item.imageUrl}
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />

                                    {/* Default Title Overlay (Visible by default, hidden on hover) */}
                                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 group-hover:opacity-0 pointer-events-none">
                                        <h3 className="text-xl font-bold text-white tracking-tight">{item.title}</h3>
                                        <p className="text-purple-300 text-xs font-semibold uppercase tracking-wider mt-1">{item.category}</p>
                                    </div>

                                    {/* Hover Overlay (Hidden by default, shown on hover) */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                                        <span className="text-purple-400 text-xs font-bold uppercase tracking-widest mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">
                                            {item.category}
                                        </span>
                                        <h3 className="text-2xl font-bold text-white mb-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-150">
                                            {item.title}
                                        </h3>
                                        {item.hasLink ? (
                                            <a
                                                href={item.figmaLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-full font-bold text-sm hover:bg-purple-50 transition-colors transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-200"
                                            >
                                                View Our Work
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                            </a>
                                        ) : (
                                            <div className="inline-flex items-center gap-2 bg-gray-400 text-white px-6 py-3 rounded-full font-bold text-sm cursor-not-allowed transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-200">
                                                View Our Work
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    {/* Visual indicator that it's clickable - only if link exists */}
                                    {item.hasLink && (
                                        <a
                                            href={item.figmaLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="absolute inset-0 z-10 block"
                                            aria-label={`Open ${item.title}`}
                                        ></a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </section>
    );
}
