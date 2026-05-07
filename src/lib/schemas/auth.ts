import { z } from "zod"

export const loginSchema = z.object({
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(8, "Mật khẩu tối thiểu 8 ký tự"),
})

export const registerSchema = z
    .object({
        email: z.string().email("Email không hợp lệ"),
        password: z.string().min(8, "Mật khẩu tối thiểu 8 ký tự"),
        confirmPassword: z.string().min(8, "Xác nhận mật khẩu tối thiểu 8 ký tự"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Mật khẩu xác nhận không khớp",
        path: ["confirmPassword"],
    })

export const updatePasswordSchema = z.object({
    oldPassword: z.string().min(8, "Mật khẩu cũ tối thiểu 8 ký tự"),
    newPassword: z.string().min(8, "Mật khẩu mới tối thiểu 8 ký tự"),
    confirmPassword: z.string().min(8, "Xác nhận mật khẩu tối thiểu 8 ký tự"),
})

export type LoginFormValues = z.infer<typeof loginSchema>
export type RegisterFormValues = z.infer<typeof registerSchema>
export type UpdatePasswordFormValues = z.infer<typeof updatePasswordSchema>