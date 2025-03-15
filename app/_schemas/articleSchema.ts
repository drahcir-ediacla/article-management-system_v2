import { z } from 'zod'

const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB in bytes

export const articleSchema = z.object({
    company: z
        .string().min(1, 'Please select a company.')
        .trim(),
    title: z
        .string().min(5, 'Title must be at least 5 characters.')
        .trim(),
    link: z
        .string().min(1, 'Customize the last part of the URL.')
        .trim(),
    date: z
        .string().min(1, 'Date is required.')
        .trim(),
    image: z
        .any()
        .refine((file) => file && file.type.startsWith("image/"), "Image must be a PNG, JPG, or JPEG.")
        .refine((file) => file && file.size <= MAX_IMAGE_SIZE, "Image must be less than 2MB."),
    content: z
        .string().min(10, 'Content must be at least 10 characters.')
        .trim(),
})

