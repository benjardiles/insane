import React, { ReactNode } from 'react';
import RoleBasedLayout from './RoleBasedLayout';

interface ClientLayoutProps {
  children: ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  return (
    <RoleBasedLayout role="client">
      {children}
    </RoleBasedLayout>
  );
};

export default ClientLayout;

