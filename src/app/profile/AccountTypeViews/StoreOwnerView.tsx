import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, User, MapPin, Phone, UserCircle, Store, Building } from "lucide-react";

interface UserProfile {
  fullName: string;
  email: string;
  phoneNumber: string;
  address?: string;
  accountType: string;
  storeName?: string;
  storeAddress?: string;
  storePhone?: string;
}

interface StoreOwnerViewProps {
  userProfile: UserProfile;
}

export const StoreOwnerView: React.FC<StoreOwnerViewProps> = ({ userProfile }) => {
  return (
    <Card className="border-0 shadow-2xl bg-white">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            {/* User Info Section */}
            <div className="bg-[#F7F3E9] p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-[#D05A44] mb-4">
                Información Personal
              </h3>
              <div className="space-y-4">
                {/* Full Name */}
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-[#D05A44]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#2D2A24]/60">Nombre completo</p>
                    <p className="text-[#2D2A24] font-medium">{userProfile.fullName}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-[#D05A44]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#2D2A24]/60">Correo electrónico</p>
                    <p className="text-[#2D2A24] font-medium">{userProfile.email}</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-[#D05A44]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#2D2A24]/60">Teléfono</p>
                    <p className="text-[#2D2A24] font-medium">{userProfile.phoneNumber}</p>
                  </div>
                </div>

                {/* Account Type */}
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <UserCircle className="w-5 h-5 text-[#D05A44]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#2D2A24]/60">Tipo de cuenta</p>
                    <p className="text-[#2D2A24] font-medium">Tienda</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Store Info Section */}
            <div className="bg-[#F7F3E9] p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-[#D05A44] mb-4">
                Información de la Tienda
              </h3>
              <div className="space-y-4">
                {/* Store Name */}
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <Store className="w-5 h-5 text-[#D05A44]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#2D2A24]/60">Nombre de la tienda</p>
                    <p className="text-[#2D2A24] font-medium">{userProfile.storeName}</p>
                  </div>
                </div>

                {/* Store Address */}
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <Building className="w-5 h-5 text-[#D05A44]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#2D2A24]/60">Dirección de la tienda</p>
                    <p className="text-[#2D2A24] font-medium">{userProfile.storeAddress}</p>
                  </div>
                </div>

                {/* Store Phone */}
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-[#D05A44]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#2D2A24]/60">Teléfono de la tienda</p>
                    <p className="text-[#2D2A24] font-medium">{userProfile.storePhone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Store Features Section */}
            <div className="bg-[#F7F3E9] p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-[#D05A44] mb-4">
                Funciones de Tienda
              </h3>
              <ul className="space-y-2 text-[#2D2A24]">
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Gestionar productos
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Administrar pedidos
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Ver reseñas
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Gestionar proveedores
                </li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
