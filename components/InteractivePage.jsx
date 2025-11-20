'use client';

import { useState, useEffect } from 'react';
import BuyFormModal from './BuyFormModal';
import CustomPlanModal from './CustomPlanModal';
import HeroSection from '../sections/HeroSection';
import MeetingScheduleSection from '../sections/MeetingScheduleSection';
import AdsExamplesSection from '../sections/AdsExamplesSection';
import WhyChooseSection from '../sections/WhyChooseSection';
import PricingSection from '../sections/PricingSection';
import HowItWorksSection from '../sections/HowItWorksSection';
import WhyBuySection from '../sections/WhyBuySection';
import TeamSection from '../sections/TeamSection';
import TestimonialsSection from '../sections/TestimonialsSection';
import FAQSection from '../sections/FAQSection';
import Footer from '../sections/Footer';
import { api } from '../lib/api';

export default function InteractivePage({ 
  plans = [],
  demoContent = [],
  teamMembers = [],
  initialAdType = 'image'
}) {
  const [adType, setAdType] = useState(initialAdType);
  const [currentDemoContent, setCurrentDemoContent] = useState(demoContent);
  const [isLoadingDemoContent, setIsLoadingDemoContent] = useState(false);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [isCustomPlanModalOpen, setIsCustomPlanModalOpen] = useState(false);
  const [buyModalData, setBuyModalData] = useState({
    planName: null,
    planPrice: null,
    planId: null,
    numberOfAds: null,
  });

  const openBuyModal = (planName = null, planPrice = null, planId = null, numberOfAds = null) => {
    // Check if it's a custom plan
    if (planName === 'Custom Plan' || planId === null) {
      setIsCustomPlanModalOpen(true);
    } else {
      setBuyModalData({ planName, planPrice, planId, numberOfAds });
      setIsBuyModalOpen(true);
    }
  };

  // Fetch demo content when adType changes
  const handleAdTypeChange = async (newAdType) => {
    setAdType(newAdType);
    
    try {
      setIsLoadingDemoContent(true);
      const response = await api.getDemoContent(newAdType);
      
      if (response.success && response.contents) {
        setCurrentDemoContent(response.contents);
      }
    } catch (error) {
      console.error('Error fetching demo content:', error);
      // Keep existing content on error
    } finally {
      setIsLoadingDemoContent(false);
    }
  };

  // Initialize demo content on mount
  useEffect(() => {
    setCurrentDemoContent(demoContent);
  }, [demoContent]);

  // Listen for buy modal events from Header
  useEffect(() => {
    const handleOpenBuyModal = () => {
      openBuyModal();
    };

    window.addEventListener('openBuyModal', handleOpenBuyModal);
    return () => {
      window.removeEventListener('openBuyModal', handleOpenBuyModal);
    };
  }, []);

  return (
    <>
      <HeroSection 
        adType={adType} 
        onAdTypeChange={handleAdTypeChange}
        onBuyClick={() => openBuyModal()}
      />
      <AdsExamplesSection 
        adType={adType}
        demoContent={currentDemoContent}
        isLoading={isLoadingDemoContent}
        onAdTypeChange={handleAdTypeChange}
      />
      <WhyChooseSection adType={adType} />
      <PricingSection 
        adType={adType}
        onBuyClick={openBuyModal}
        plans={plans}
        onAdTypeChange={handleAdTypeChange}
      />
      <MeetingScheduleSection />
      <HowItWorksSection adType={adType} />
      <WhyBuySection adType={adType} />
      <TeamSection 
        adType={adType}
        teamMembers={teamMembers}
      />
      <TestimonialsSection adType={adType} />
      <FAQSection adType={adType} />
      <Footer adType={adType} />
      <BuyFormModal
        isOpen={isBuyModalOpen}
        onClose={() => setIsBuyModalOpen(false)}
        adType={adType}
        planName={buyModalData.planName}
        planPrice={buyModalData.planPrice}
        planId={buyModalData.planId}
        numberOfAds={buyModalData.numberOfAds}
      />
      <CustomPlanModal
        isOpen={isCustomPlanModalOpen}
        onClose={() => setIsCustomPlanModalOpen(false)}
      />
    </>
  );
}

