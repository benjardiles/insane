import React, { ReactNode } from 'react';
import RoleBasedLayout from './RoleBasedLayout';

interface StoreLayoutProps {
  children: ReactNode;
}

const StoreLayout: React.FC<StoreLayoutProps> = ({ children }) => {
  return (
    <RoleBasedLayout role="store">
      {children}
    </RoleBasedLayout>
  );
};

export default StoreLayout;
