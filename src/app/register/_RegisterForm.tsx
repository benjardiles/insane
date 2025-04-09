"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Mail, User, Phone, MapPin, UserCircle, CheckCircle2 } from "lucide-react"

const formSchema = z.object({
  email: z.string().email({ message: "Por favor ingresa un correo electrónico válido." }),
  fullName: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres." })
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, {
      message: "El nombre no debe contener caracteres especiales o números.",
    }),
  phoneNumber: z.string().min(8, { message: "El número de teléfono debe tener al menos 8 dígitos." }).regex(/^\d+$/, {
    message: "El número de teléfono solo debe contener dígitos.",
  }),
  address: z.string().min(5, { message: "La dirección debe tener al menos 5 caracteres." }),
  accountType: z.enum(["normal", "delivery", "seller"], {
    required_error: "Por favor selecciona un tipo de cuenta.",
  }),
})

type FormValues = z.infer<typeof formSchema>

export default function RegisterForm() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      fullName: "",
      phoneNumber: "",
      address: "",
    },
  })

  function onSubmit(data: FormValues) {
    setIsSubmitting(true)
    setTimeout(() => {
      console.log("Datos del formulario:", data)
      setIsSubmitting(false)
      setSubmitSuccess(true)
      setTimeout(() => {
        form.reset()
        setSubmitSuccess(false)
      }, 3000)
    }, 1500)
  }

  return (
    <Card className="w-full max-w-md mx-auto border-0 shadow-2xl bg-[#F7F3E9] text-[#2D2A24] relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#D05A44]" />
      <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-[#F9C7C7] opacity-20" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-[#A0C1B8] opacity-20" />

      <div className="absolute top-4 right-4 w-16 h-16">
        <svg viewBox="0 0 100 100" className="w-full h-full text-[#D05A44] opacity-10">
          <circle cx="50" cy="50" r="40" fill="currentColor" />
          <circle cx="50" cy="50" r="30" fill="#F7F3E9" />
          <circle cx="50" cy="50" r="20" fill="currentColor" />
        </svg>
      </div>

      <CardHeader className="pb-6 relative z-10">
        <CardTitle className="text-3xl font-bold text-center text-[#D05A44]">新規登録</CardTitle>
        <CardDescription className="text-center text-[#2D2A24] font-medium mt-1">
          Completa el formulario para disfrutar de nuestra cocina
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
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#2D2A24] font-medium">Nombre completo</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#D05A44] h-4 w-4" />
                      <Input
                        placeholder="Juan Pérez"
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
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#2D2A24] font-medium">Número de teléfono</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#D05A44] h-4 w-4" />
                      <Input
                        placeholder="912345678"
                        type="tel"
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
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#2D2A24] font-medium">Dirección de entrega</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#D05A44] h-4 w-4" />
                      <Input
                        placeholder="Calle Ejemplo 123"
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
              name="accountType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#2D2A24] font-medium">Tipo de cuenta</FormLabel>
                  <div className="relative">
                    <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#D05A44] h-4 w-4 z-10" />
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="pl-10 bg-white text-[#2D2A24] border-[#A0C1B8] focus:border-[#D05A44] focus:ring-[#D05A44]">
                          <SelectValue placeholder="Selecciona un tipo de cuenta" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-[#F7F3E9] text-[#2D2A24] border-[#A0C1B8]">
                        <SelectItem value="normal" className="focus:bg-[#A0C1B8]/20">
                          Usuario normal
                        </SelectItem>
                        <SelectItem value="delivery" className="focus:bg-[#A0C1B8]/20">
                          Repartidor
                        </SelectItem>
                        <SelectItem value="seller" className="focus:bg-[#A0C1B8]/20">
                          Vendedor
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <FormMessage className="text-[#D05A44] font-medium" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-[#D05A44] hover:bg-[#B84A37] transition-all duration-300 text-white font-medium py-2.5 rounded-md shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Registrando..." : "登録する"}
            </Button>

            {submitSuccess && (
              <div className="p-3 bg-[#A0C1B8] text-[#2D2A24] rounded-md text-center flex items-center justify-center space-x-2 animate-fadeIn">
                <CheckCircle2 className="h-5 w-5 text-[#2D2A24]" />
                <span>¡Registro completado con éxito!</span>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

