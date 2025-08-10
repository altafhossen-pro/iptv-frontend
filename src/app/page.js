import DPlayerMainUi from '@/components/MainUI/DPlayerMainUi';
import MainUi from '@/components/MainUI/MainUi';
import VideoJsIPTVPlayer from '@/components/MainUI/VideoJsIPTVPlayer';
import React from 'react';

const page = () => {
  return (
    <div>
      {/* <MainUi /> */}
      <DPlayerMainUi />
      {/* <VideoJsIPTVPlayer /> */}
    </div>
  );
};

export default page;