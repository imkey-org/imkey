import { z } from "zod";

export const createCategorySchema = z.object({
  nameCategory: z.string({
    required_error: "Name Category is required",
  }),
})

export const paramsId = z.object({
  categoryId: z.string(),
});

export const updateCategorySchema = z.object({
  params: paramsId,
  body: createCategorySchema,
});

export type ParamsInput = z.infer<typeof paramsId>
export type CreateCategory = z.infer<typeof createCategorySchema>
export type UpdateCategory = z.infer<typeof updateCategorySchema>
