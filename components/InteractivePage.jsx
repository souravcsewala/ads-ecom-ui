'use client';

import { useState, useEffect } from 'react';
import BuyFormModal from './BuyFormModal';
import CustomPlanModal from './CustomPlanModal';
import HeroSection from '../sections/HeroSection';
import MeetingScheduleSection from '../sections/MeetingScheduleSection';
import AdsExamplesSection from '../sections/AdsExamplesSection';
import WhyChooseSection from '../sections/WhyChooseSection';
import PromoBannerSection from '../sections/PromoBannerSection';
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
  const [currentTeamMembers, setCurrentTeamMembers] = useState(teamMembers);
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

  // Fetch fresh demo content and team members on initial mount (client-side) to ensure signed URLs are valid
  useEffect(() => {
    const fetchInitialData = async () => {
      // Fetch demo content
      try {
        setIsLoadingDemoContent(true);
        // Use initialAdType to fetch the correct content type on mount
        const demoResponse = await api.getDemoContent(initialAdType);
        
        if (demoResponse.success && demoResponse.contents) {
          setCurrentDemoContent(demoResponse.contents);
        } else {
          // Fallback to server-provided content if API fails
          setCurrentDemoContent(demoContent);
        }
      } catch (error) {
        console.error('Error fetching demo content on mount:', error);
        // Fallback to server-provided content on error
        setCurrentDemoContent(demoContent);
      } finally {
        setIsLoadingDemoContent(false);
      }

      // Fetch team members
      try {
        const teamResponse = await api.getTeamMembers();
        
        if (teamResponse.success && teamResponse.teamMembers) {
          setCurrentTeamMembers(teamResponse.teamMembers);
        } else {
          // Fallback to server-provided team members if API fails
          setCurrentTeamMembers(teamMembers);
        }
      } catch (error) {
        console.error('Error fetching team members on mount:', error);
        // Fallback to server-provided team members on error
        setCurrentTeamMembers(teamMembers);
      }
    };

    // Always fetch fresh data on mount to ensure signed URLs are valid
    fetchInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount - we intentionally don't include dependencies

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
      <PromoBannerSection onBuyClick={() => openBuyModal()} />
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
        teamMembers={currentTeamMembers}
      />
      <TestimonialsSection adType={adType} />
      <FAQSection adType={adType} />
      <Footer adType={adType} onBuyClick={() => openBuyModal()} />
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

