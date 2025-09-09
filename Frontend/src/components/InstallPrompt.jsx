// src/components/InstallPrompt.jsx
import React from 'react';
import { Download as DownloadIcon } from '@mui/icons-material'; // or use your own icon

const InstallPrompt = ({ show, onInstall }) => {
  if (!show) return null;

  return (
    <div
      className="fixed right-5 bottom-5 bg-orange-500 w-14 h-14 rounded-full shadow-lg flex justify-center items-center cursor-pointer animate-bounce"
      onClick={onInstall}
    >
      <DownloadIcon style={{ color: 'white', fontSize: '32px' }} />
    </div>
  );
};

export default InstallPrompt;
