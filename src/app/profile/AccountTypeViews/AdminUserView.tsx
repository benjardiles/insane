import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, User, Phone, UserCircle, Shield } from "lucide-react";

interface UserProfile {
  fullName: string;
  email: string;
  phoneNumber: string;
  accountType: string;
}

interface AdminUserViewProps {
  userProfile: UserProfile;
}

export const AdminUserView: React.FC<AdminUserViewProps> = ({ userProfile }) => {
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
                    <p className="text-[#2D2A24] font-medium">Administrador</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Admin Badge Section */}
            <div className="bg-[#F7F3E9] p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-[#D05A44] mb-4">
                Información de Administrador
              </h3>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-4">
                  <Shield className="w-6 h-6 text-[#D05A44]" />
                </div>
                <div>
                  <p className="text-[#2D2A24] font-medium">Administrador del Sistema</p>
                  <p className="text-sm text-[#2D2A24]/60">Acceso completo</p>
                </div>
              </div>
            </div>

            {/* Admin Features Section */}
            <div className="bg-[#F7F3E9] p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-[#D05A44] mb-4">
                Funciones de Administrador
              </h3>
              <ul className="space-y-2 text-[#2D2A24]">
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Gestionar usuarios
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Supervisar tiendas
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Monitorear repartidores
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Configuración del sistema
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Reportes y estadísticas
                </li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
