'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { Button } from '../ui/button';

interface NavItem {
  label: string;
  href: string;
}

interface RoleBasedLayoutProps {
  children: React.ReactNode;
  role: 'client' | 'store' | 'delivery';
}

const RoleBasedLayout: React.FC<RoleBasedLayoutProps> = ({ children, role }) => {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const clientNavItems: NavItem[] = [
    { label: 'Catalog', href: '/menu/catalog' },
    { label: 'Profile', href: '/profile' },
  ];

  const storeNavItems: NavItem[] = [
    { label: 'Dashboard', href: '/menu/store/dashboard' },
    { label: 'Products', href: '/menu/store/products' },
    { label: 'Orders', href: '/menu/store/orders' },
    { label: 'Suppliers', href: '/menu/store/suppliers' },
    { label: 'Reviews', href: '/menu/store/reviews' },
    { label: 'Profile', href: '/profile' },
  ];

  const deliveryNavItems: NavItem[] = [
    { label: 'Available Orders', href: '/menu/delivery/available' },
    { label: 'My Orders', href: '/menu/delivery/my-orders' },
    { label: 'Profile', href: '/profile' },
  ];

  const navItems = 
    role === 'client' ? clientNavItems :
    role === 'store' ? storeNavItems :
    deliveryNavItems;

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Mobile menu button */}
      <div className="md:hidden sticky top-0 z-30 flex items-center justify-between p-4 bg-white border-b">
        <h2 className="text-xl font-bold">
          {role === 'client' ? 'Client Menu' : 
           role === 'store' ? 'Store Management' : 
           'Delivery Dashboard'}
        </h2>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          aria-label={sidebarOpen ? "Close menu" : "Open menu"}
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Sidebar - Mobile (overlay) */}
      <div 
        className={`fixed inset-0 z-20 transform transition-transform duration-300 ease-in-out md:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="absolute inset-0 bg-gray-600 bg-opacity-75" onClick={toggleSidebar}></div>
        <div className="relative flex flex-col w-64 max-w-xs h-full bg-gray-100 pt-5 pb-4">
          <div className="px-4 pb-6 border-b border-gray-200">
            <h2 className="text-xl font-bold mb-6 text-center">
              {role === 'client' ? 'Client Menu' : 
               role === 'store' ? 'Store Management' : 
               'Delivery Dashboard'}
            </h2>
            <nav>
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link 
                      href={item.href}
                      className={`block p-2 rounded ${
                        pathname === item.href
                          ? 'bg-blue-500 text-white'
                          : 'hover:bg-gray-200'
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>

      {/* Sidebar - Desktop (fixed) */}
      <div className="hidden md:block md:w-64 md:flex-shrink-0 bg-gray-100 border-r">
        <div className="p-4">
          <h2 className="text-xl font-bold mb-6 text-center">
            {role === 'client' ? 'Client Menu' : 
             role === 'store' ? 'Store Management' : 
             'Delivery Dashboard'}
          </h2>
          <nav>
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link 
                    href={item.href}
                    className={`block p-2 rounded ${
                      pathname === item.href
                        ? 'bg-blue-500 text-white'
                        : 'hover:bg-gray-200'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-4 md:p-8 pt-4 md:pt-8">
        {children}
      </div>
    </div>
  );
};

export default RoleBasedLayout;

