"use client"

import { useState } from "react"
import Image from "next/image"
import {
  Package,
  ShoppingBag,
  Truck,
  Star,
  Home,
  Settings,
  LogOut,
  Bell,
  Search,
  Plus,
  Edit,
  Trash2,
  Filter,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function StoreDashboard() {
  const [activeTab, setActiveTab] = useState("products")
  const [showAddProduct, setShowAddProduct] = useState(false)

  return (
    <div className="flex min-h-screen bg-[#F7F3E9]">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-white border-r border-[#A0C1B8]/20">
        <div className="p-4 border-b border-[#A0C1B8]/20">
          <h2 className="text-xl font-bold flex items-center gap-2 text-[#D05A44]">
            <ShoppingBag className="h-5 w-5" />
            Mercado Primavera
          </h2>
        </div>
        <nav className="flex-1 p-4">
          <div className="space-y-1">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-[#2D2A24] hover:text-[#D05A44] hover:bg-[#F7F3E9]" 
              onClick={() => setActiveTab("dashboard")}
            >
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-[#2D2A24] hover:text-[#D05A44] hover:bg-[#F7F3E9]" 
              onClick={() => setActiveTab("products")}
            >
              <Package className="mr-2 h-4 w-4" />
              Productos
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-[#2D2A24] hover:text-[#D05A44] hover:bg-[#F7F3E9]" 
              onClick={() => setActiveTab("orders")}
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Pedidos
              <Badge className="ml-auto bg-[#D05A44] text-white">5</Badge>
            </Button>
            {/* More buttons... */}
          </div>
        </nav>
        <div className="p-4 border-t border-[#A0C1B8]/20">
          <Button variant="ghost" className="w-full justify-start text-[#2D2A24] hover:text-[#D05A44] hover:bg-[#F7F3E9]">
            <Settings className="mr-2 h-4 w-4" />
            Configuración
          </Button>
          <Button variant="ghost" className="w-full justify-start text-[#D05A44]">
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="border-b bg-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#2D2A24]">Panel de Locatario</h1>
          </div>
          {/* Header content... */}
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          <Tabs defaultValue="products" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4 bg-white">
              <TabsTrigger value="dashboard" className="data-[state=active]:bg-[#D05A44] data-[state=active]:text-white">Dashboard</TabsTrigger>
              <TabsTrigger value="products" className="data-[state=active]:bg-[#D05A44] data-[state=active]:text-white">Productos</TabsTrigger>
              <TabsTrigger value="orders" className="data-[state=active]:bg-[#D05A44] data-[state=active]:text-white">Pedidos</TabsTrigger>
              <TabsTrigger value="suppliers" className="data-[state=active]:bg-[#D05A44] data-[state=active]:text-white">Proveedores</TabsTrigger>
              <TabsTrigger value="reviews" className="data-[state=active]:bg-[#D05A44] data-[state=active]:text-white">Valoraciones</TabsTrigger>
            </TabsList>

            {/* Tab contents... */}
            <TabsContent value="dashboard" className="space-y-4">
              {/* Dashboard cards... */}
            </TabsContent>

            <TabsContent value="products">
              {/* Products content... */}
            </TabsContent>

            {/* Other tab contents... */}
          </Tabs>
        </main>
      </div>
    </div>
  )
}