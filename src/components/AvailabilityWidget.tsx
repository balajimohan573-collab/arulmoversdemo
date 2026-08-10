import React, { useEffect, useState } from 'react';
import { LocalDb, type JcbStatus } from '../utils/localStorageDb';

interface AvailabilityWidgetProps {
  className?: string;
}

export const AvailabilityWidget: React.FC<AvailabilityWidgetProps> = ({ className = "" }) => {
  const [status, setStatus] = useState<JcbStatus>({
    availability: 'Available',
    hourlyPrice: 1000,
    operatorIncluded: true,
  });

  useEffect(() => {
    // Load status
    const loadStatus = () => {
      setStatus(LocalDb.getJcbStatus());
    };
    loadStatus();
    
    // Listen for storage changes to keep it updated if modified in admin dashboard
    window.addEventListener('storage', loadStatus);
    // Custom event to update same-window tabs / components
    window.addEventListener('aem_db_update', loadStatus);

    return () => {
      window.removeEventListener('storage', loadStatus);
      window.removeEventListener('aem_db_update', loadStatus);
    };
  }, []);

  const getStatusColor = () => {
    switch (status.availability) {
      case 'Available':
        return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'Limited':
        return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'Booked':
        return 'text-red-500 bg-red-500/10 border-red-500/20';
      default:
        return 'text-green-500 bg-green-500/10 border-green-500/20';
    }
  };

  const getStatusText = () => {
    switch (status.availability) {
      case 'Available':
        return 'JCB Available for Booking';
      case 'Limited':
        return 'JCB Limited Availability';
      case 'Booked':
        return 'JCB Currently Booked';
      default:
        return 'JCB Available';
    }
  };

  const getPulseColor = () => {
    switch (status.availability) {
      case 'Available':
        return 'bg-green-500';
      case 'Limited':
        return 'bg-amber-500';
      case 'Booked':
        return 'bg-red-500';
      default:
        return 'bg-green-500';
    }
  };

  return (
    <div className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-full border text-sm font-semibold tracking-wide backdrop-blur-md ${getStatusColor()} ${className}`}>
      <span className="relative flex h-2.5 w-2.5">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${getPulseColor()}`}></span>
        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${getPulseColor()}`}></span>
      </span>
      <span>{getStatusText()}</span>
    </div>
  );
};
export default AvailabilityWidget;
