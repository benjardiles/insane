import React, { ReactNode } from 'react';
import RoleBasedLayout from './RoleBasedLayout';

interface DeliveryLayoutProps {
  children: ReactNode;
}

const DeliveryLayout: React.FC<DeliveryLayoutProps> = ({ children }) => {
  return (
    <RoleBasedLayout role="delivery">
      {children}
    </RoleBasedLayout>
  );
};

export default DeliveryLayout;
