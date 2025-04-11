"use client"
import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Mail, CheckCircle2 } from "lucide-react"
import { sendResetPasswordEmail } from "@/services/api/auth"

const formSchema = z.object({
  email: z.string().email({ message: "Por favor ingresa un correo electrónico válido." }),
})

type FormValues = z.infer<typeof formSchema>

export default function ForgotPasswordForm() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true)
    try {
      await sendResetPasswordEmail(data.email);
      setSubmitSuccess(true)
      setTimeout(() => {
        form.reset()
        setSubmitSuccess(false)
      }, 3000)
    } catch (error: any) {
      console.error('Error:', error)
      //agregar un tipo correo no existe
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
        <CardTitle className="text-3xl font-bold text-center text-[#D05A44]">Recuperar Contraseña</CardTitle>
        <CardDescription className="text-center text-[#2D2A24] font-medium mt-1">
          Ingresa tu correo electrónico para recuperar tu contraseña
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

            <Button
              type="submit"
              className="w-full bg-[#D05A44] hover:bg-[#B84A37] transition-all duration-300 text-white font-medium py-2.5 rounded-md shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enviando..." : "Enviar instrucciones"}
            </Button>

            {submitSuccess && (
              <div className="p-3 bg-[#A0C1B8] text-[#2D2A24] rounded-md text-center flex items-center justify-center space-x-2 animate-fadeIn">
                <CheckCircle2 className="h-5 w-5 text-[#2D2A24]" />
                <span>¡Revisa tu correo electrónico!</span>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}