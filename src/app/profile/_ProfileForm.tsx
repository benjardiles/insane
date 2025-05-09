"use client"
import { useEffect, useState } from "react"
import { StoreOwnerView } from "./AccountTypeViews/StoreOwnerView"
import { NormalUserView } from "./AccountTypeViews/NormalUserView"
import { DeliveryUserView } from "./AccountTypeViews/DeliveryUserView"
import { AdminUserView } from "./AccountTypeViews/AdminUserView"
import { useAuth } from "@/contexts/AuthContext"

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
  const { user, loading } = useAuth()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)

  useEffect(() => {
    if (user) {
      setUserProfile({
        fullName: user.name,
        email: user.email,
        phoneNumber: user.phone,
        address: user.address || "No especificada",
        accountType: user.account_type,
        storeName: user.store_name,
        storeAddress: user.store_address,
        storePhone: user.store_phone
      })
    }
  }, [user])

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
      case "tienda":
        return <StoreOwnerView userProfile={userProfile} />
      case "delivery":
        return <DeliveryUserView userProfile={userProfile} />
      case "admin":
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