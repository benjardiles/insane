"use client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Mail, Lock, CheckCircle2, AlertCircle, } from "lucide-react"
import { login, getProfile } from "@/services/api/auth"
import { useAuth } from "@/contexts/AuthContext"


const formSchema = z.object({
  email: z.string().email({ message: "Por favor ingresa un correo electrónico válido." }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres." }),
})

type FormValues = z.infer<typeof formSchema>

export default function LoginForm() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { refreshUserData } = useAuth()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true)
    setError(null)
    try {
      const user = await login(data.email, data.password)
      setSubmitSuccess(true)

      // Actualizar los datos del usuario en el contexto
      await refreshUserData()

      // Redirigir según el tipo de cuenta
      if (user.account_type === "tienda" || user.account_type === "store" || user.account_type === "seller") {
        router.push("/menu/store/dashboard")
      } else if (user.account_type === "delivery") {
        router.push("/menu/delivery/available")
      } else {
        router.push("/menu/catalog")
      }

      setTimeout(() => {
        form.reset()
        setSubmitSuccess(false)
      }, 3000)
    } catch (error:any) {
      console.error('Error:', error)
      setError(error.response?.data?.error || "Error al iniciar sesión")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto border-0 shadow-2xl bg-[#F7F3E9] text-[#2D2A24] relative overflow-hidden m-4 sm:m-6 md:m-8">
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#D05A44]" />
      {/* Elementos decorativos responsivos */}
      <div className="absolute -top-16 -right-16 sm:-top-20 sm:-right-20 md:-top-24 md:-right-24 w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full bg-[#F9C7C7] opacity-20" />
      <div className="absolute -bottom-16 -left-16 sm:-bottom-20 sm:-left-20 md:-bottom-24 md:-left-24 w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full bg-[#A0C1B8] opacity-20" />

      <CardHeader className="pb-4 sm:pb-5 md:pb-6 relative z-10 px-4 sm:px-6 pt-4 sm:pt-6">
        <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-[#D05A44] leading-tight">
          Login
        </CardTitle>
        <CardDescription className="text-center text-[#2D2A24] font-medium mt-1 text-sm sm:text-base px-2 sm:px-0">
          Ingresa tus credenciales para continuar
        </CardDescription>
      </CardHeader>

      <CardContent className="relative z-10 px-4 sm:px-6 pb-4 sm:pb-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#2D2A24] font-medium text-sm sm:text-base">
                    Correo electrónico
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#D05A44] h-4 w-4" />
                      <Input
                        placeholder="correo@ejemplo.com"
                        type="email"
                        {...field}
                        className="pl-10 bg-white text-[#2D2A24] border-[#A0C1B8] focus:border-[#D05A44] focus:ring-[#D05A44] placeholder:text-[#2D2A24]/50 h-10 sm:h-11 text-sm sm:text-base"
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-[#D05A44] font-medium text-xs sm:text-sm" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#2D2A24] font-medium text-sm sm:text-base">
                    Contraseña
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#D05A44] h-4 w-4" />
                      <Input
                        placeholder="••••••••"
                        type="password"
                        {...field}
                        className="pl-10 bg-white text-[#2D2A24] border-[#A0C1B8] focus:border-[#D05A44] focus:ring-[#D05A44] placeholder:text-[#2D2A24]/50 h-10 sm:h-11 text-sm sm:text-base"
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-[#D05A44] font-medium text-xs sm:text-sm" />
                </FormItem>
              )}
            />

            <div className="text-center mt-3 sm:mt-4">
              <a
                href="/forgot-password"
                className="text-[#D05A44] hover:text-[#B84A37] text-xs sm:text-sm font-medium transition-colors duration-200"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#D05A44] hover:bg-[#B84A37] transition-all duration-300 text-white font-medium py-2.5 sm:py-3 rounded-md shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm sm:text-base h-10 sm:h-11"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Iniciando sesión..." : "Login"}
            </Button>

            {submitSuccess && (
              <div className="p-3 bg-[#A0C1B8] text-[#2D2A24] rounded-md text-center flex items-center justify-center space-x-2 animate-fadeIn text-sm sm:text-base">
                <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-[#2D2A24] flex-shrink-0" />
                <span className="break-words">¡Inicio de sesión exitoso!</span>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-100 text-red-700 rounded-md text-center flex items-center justify-center space-x-2 animate-fadeIn text-sm sm:text-base">
                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-700 flex-shrink-0" />
                <span className="break-words">{error}</span>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
