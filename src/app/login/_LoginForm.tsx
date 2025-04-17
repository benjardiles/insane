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
import { login } from "@/services/api/auth"


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
      await login(data.email, data.password)
      setSubmitSuccess(true)
      router.push("/profile") // Cambiado de "/menu" a "/profile"
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
    <Card className="w-full max-w-md mx-auto border-0 shadow-2xl bg-[#F7F3E9] text-[#2D2A24] relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#D05A44]" />
      <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-[#F9C7C7] opacity-20" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-[#A0C1B8] opacity-20" />

      <CardHeader className="pb-6 relative z-10">
        <CardTitle className="text-3xl font-bold text-center text-[#D05A44]">Login</CardTitle>
        <CardDescription className="text-center text-[#2D2A24] font-medium mt-1">
          Ingresa tus credenciales para continuar
        </CardDescription>
      </CardHeader>

      <CardContent className="relative z-10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#2D2A24] font-medium">Correo electrónico</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#D05A44] h-4 w-4" />
                      <Input
                        placeholder="correo@ejemplo.com"
                        type="email"
                        {...field}
                        className="pl-10 bg-white text-[#2D2A24] border-[#A0C1B8] focus:border-[#D05A44] focus:ring-[#D05A44] placeholder:text-[#2D2A24]/50"
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-[#D05A44] font-medium" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#2D2A24] font-medium">Contraseña</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#D05A44] h-4 w-4" />
                      <Input
                        placeholder="••••••••"
                        type="password"
                        {...field}
                        className="pl-10 bg-white text-[#2D2A24] border-[#A0C1B8] focus:border-[#D05A44] focus:ring-[#D05A44] placeholder:text-[#2D2A24]/50"
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-[#D05A44] font-medium" />
                </FormItem>
              )}
            />

            <div className="text-center mt-4">
              <a
                href="/forgot-password"
                className="text-[#D05A44] hover:text-[#B84A37] text-sm font-medium"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#D05A44] hover:bg-[#B84A37] transition-all duration-300 text-white font-medium py-2.5 rounded-md shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Iniciando sesión..." : "Login"}
            </Button>

            {submitSuccess && (
              <div className="p-3 bg-[#A0C1B8] text-[#2D2A24] rounded-md text-center flex items-center justify-center space-x-2 animate-fadeIn">
                <CheckCircle2 className="h-5 w-5 text-[#2D2A24]" />
                <span>¡Inicio de sesión exitoso!</span>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-100 text-red-700 rounded-md text-center flex items-center justify-center space-x-2 animate-fadeIn">
                <AlertCircle className="h-5 w-5 text-red-700" />
                <span>{error}</span>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
