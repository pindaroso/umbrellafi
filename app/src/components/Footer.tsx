import { useEffect } from 'react';

import useStore from '@/stores/core';

const Footer = () => {
  const {
    blockNumber,
    blockNumberTimer,
    etfsTimer,
    initETFPolling,
    initBlockNumberPolling,
  } = useStore();

  useEffect(() => {
    if (!etfsTimer) {
      initETFPolling();
    }
  }, [etfsTimer, initETFPolling]);

  useEffect(() => {
    if (!blockNumberTimer) {
      initBlockNumberPolling();
    }
  }, [blockNumberTimer, initBlockNumberPolling]);

  return (
    <footer className="h-10 mt-auto flex flex-col z-10">
      <div className="mx-auto text-gray-500 text-tiny">
        {blockNumber ? (
          <span className="text-green-700">• {blockNumber}</span>
        ) : (
          <span>Loading...</span>
        )}
      </div>
    </footer>
  );
};

export default Footer;
