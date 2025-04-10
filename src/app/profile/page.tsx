"use client"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, User, MapPin, Phone, UserCircle } from "lucide-react"

interface UserProfile {
  fullName: string
  email: string
  phoneNumber: string
  address: string
  accountType: "normal" | "delivery" | "seller"
}

export default function Profile() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Aquí deberías hacer la llamada a tu API para obtener los datos del usuario
    // Por ahora usaremos datos de ejemplo
    const mockProfile: UserProfile = {
      fullName: "Juan Pérez",
      email: "juan@ejemplo.com",
      phoneNumber: "123456789",
      address: "Calle Principal 123",
      accountType: "normal"
    }
    
    setUserProfile(mockProfile)
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F3E9] flex items-center justify-center">
        <div className="text-[#D05A44]">Cargando...</div>
      </div>
    )
  }

  const getAccountTypeLabel = (type: string) => {
    const types = {
      normal: "Usuario Normal",
      delivery: "Repartidor",
      seller: "Vendedor"
    }
    return types[type as keyof typeof types] || type
  }

  return (
    <div className="min-h-screen bg-[#F7F3E9] py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-[#D05A44]">Mi Perfil</h1>
          <p className="text-[#2D2A24]">Gestiona tu información personal</p>
        </header>

        {/* Profile Card */}
        <Card className="border-0 shadow-2xl bg-white">
          <CardHeader className="border-b border-[#A0C1B8]/20 pb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-[#D05A44] rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl text-[#2D2A24]">
                  {userProfile?.fullName}
                </CardTitle>
                <span className="text-[#D05A44] font-medium">
                  {getAccountTypeLabel(userProfile?.accountType || "")}
                </span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="grid gap-6">
              {/* Email */}
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-[#F7F3E9] rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-[#D05A44]" />
                </div>
                <div>
                  <p className="text-sm text-[#2D2A24]/60">Correo electrónico</p>
                  <p className="text-[#2D2A24] font-medium">{userProfile?.email}</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-[#F7F3E9] rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5 text-[#D05A44]" />
                </div>
                <div>
                  <p className="text-sm text-[#2D2A24]/60">Teléfono</p>
                  <p className="text-[#2D2A24] font-medium">{userProfile?.phoneNumber}</p>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-[#F7F3E9] rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-[#D05A44]" />
                </div>
                <div>
                  <p className="text-sm text-[#2D2A24]/60">Dirección</p>
                  <p className="text-[#2D2A24] font-medium">{userProfile?.address}</p>
                </div>
              </div>

              {/* Account Type */}
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-[#F7F3E9] rounded-full flex items-center justify-center">
                  <UserCircle className="w-5 h-5 text-[#D05A44]" />
                </div>
                <div>
                  <p className="text-sm text-[#2D2A24]/60">Tipo de cuenta</p>
                  <p className="text-[#2D2A24] font-medium">
                    {getAccountTypeLabel(userProfile?.accountType || "")}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}