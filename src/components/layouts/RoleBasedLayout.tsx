import React, { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  label: string;
  href: string;
}

interface RoleBasedLayoutProps {
  children: ReactNode;
  role: 'client' | 'store' | 'delivery';
}

const RoleBasedLayout: React.FC<RoleBasedLayoutProps> = ({ children, role }) => {
  const pathname = usePathname();

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

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-100 border-r">
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
      <div className="flex-1 p-8">
        {children}
      </div>
    </div>
  );
};

export default RoleBasedLayout;
