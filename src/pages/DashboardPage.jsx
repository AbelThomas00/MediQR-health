import React from 'react';
import MediQRPassport from '../components/MediQRPassport';
import RxDecodeEngine from '../components/RxDecodeEngine';
import PerspectiveEngine from '../components/PerspectiveEngine';
import { useMediQR } from '../context/MediQRContext';

const DashboardPage = () => {
  const { isLoading } = useMediQR();

  if (isLoading) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          <p className="text-primary font-bold animate-pulse">Loading MediQR Data...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
        <MediQRPassport />
        <RxDecodeEngine />
      </div>
      <PerspectiveEngine />
    </>
  );
};

export default DashboardPage;
