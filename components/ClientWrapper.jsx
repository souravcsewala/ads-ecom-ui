'use client';

import { useState } from 'react';
import Header from './Header';
import BuyFormModal from './BuyFormModal';

export default function ClientWrapper({ 
  children, 
  plans = [],
  demoContent = [],
  teamMembers = [],
  initialAdType = 'image'
}) {
  const [adType, setAdType] = useState(initialAdType);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [buyModalData, setBuyModalData] = useState({
    planName: null,
    planPrice: null,
  });

  const openBuyModal = (planName = null, planPrice = null) => {
    setBuyModalData({ planName, planPrice });
    setIsBuyModalOpen(true);
  };

  // Clone children and pass props
  const childrenWithProps = children.map((child, index) => {
    if (child && typeof child === 'object' && 'type' in child) {
      return {
        ...child,
        key: index,
        props: {
          ...child.props,
          adType,
          onAdTypeChange: setAdType,
          onBuyClick: openBuyModal,
          plans,
          demoContent,
          teamMembers,
        },
      };
    }
    return child;
  });

  return (
    <>
      <Header onBuyClick={() => openBuyModal()} />
      {childrenWithProps}
      <BuyFormModal
        isOpen={isBuyModalOpen}
        onClose={() => setIsBuyModalOpen(false)}
        adType={adType}
        planName={buyModalData.planName}
        planPrice={buyModalData.planPrice}
      />
    </>
  );
}

