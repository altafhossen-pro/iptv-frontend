import DPlayerMainUi from '@/components/MainUI/DPlayerMainUi';
import NewsTicker from '@/components/Ticker/NewsTicker';
import React from 'react';

const page = () => {
  return (
    <div className='' >
      {/* News Ticker */}
      <NewsTicker />
      
      {/* Main Content */}
      <DPlayerMainUi />
    </div>
  );
};

export default page;