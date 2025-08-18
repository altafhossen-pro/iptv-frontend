import ClapprPlayerMainUi from '@/components/MainUI/ClapprPlayerMainUi';
import DPlayerMainUi from '@/components/MainUI/DPlayerMainUi';
import ShakaPlayerMainUi from '@/components/MainUI/ShakaPlayerMainUi';
import NewsTicker from '@/components/Ticker/NewsTicker';
import React from 'react';
// import ShakaPlayerMainUi from '@/components/MainUI/ShakaPlayerMainUi'; // Uncomment to use Shaka Player instead of DPlayer

const page = () => {
  return (
    <div className='' >
      {/* News Ticker */}
      <NewsTicker />
      
      {/* Main Content */}
      <DPlayerMainUi />

      {/* * <ShakaPlayerMainUi /> * */}

      {/* <ClapprPlayerMainUi /> */}
    </div>
  );
};

export default page;