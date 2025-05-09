"use client"
import { useEffect, useState } from "react"
import { getProfile } from "@/services/api/auth"
import { StoreOwnerView, NormalUserView, DeliveryUserView, AdminUserView } from "@/components/AccountTypeViews"

interface UserProfile {
  fullName: string
  email: string
  phoneNumber: string
  address?: string
  accountType: string
  storeName?: string
  storeAddress?: string
  storePhone?: string
}

export default function Profile() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getProfile()
        setUserProfile({
          fullName: profileData.name,
          email: profileData.email,
          phoneNumber: profileData.phone,
          address: profileData.address || "No especificada",
          accountType: profileData.account_type,
          storeName: profileData.store_name,
          storeAddress: profileData.store_address,
          storePhone: profileData.store_phone
        })
      } catch (error) {
        console.error("Error al obtener el perfil:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F3E9] flex items-center justify-center">
        <div className="text-[#D05A44]">Cargando...</div>
      </div>
    )
  }

  // Renderizar la vista según el tipo de cuenta
  const renderProfileView = () => {
    if (!userProfile) return null

    switch (userProfile.accountType) {
      case "TIENDA":
        return <StoreOwnerView userProfile={userProfile} />
      case "DELIVERY":
        return <DeliveryUserView userProfile={userProfile} />
      case "ADMIN":
        return <AdminUserView userProfile={userProfile} />
      default:
        return <NormalUserView userProfile={userProfile} />
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F3E9] py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-[#D05A44]">Mi Perfil</h1>
          <p className="text-[#2D2A24]">Gestiona tu información personal</p>
        </header>

        {/* Render the appropriate view based on account type */}
        {renderProfileView()}
      </div>
    </div>
  )
}