import { createCategorySchema, paramsId, updateCategorySchema } from "@/server/article/category/category.schema";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { createCategoryController, deleteCategoryController, updateCategoryController } from "@/server/article/category/category.controller";

export const categoryRouter = createTRPCRouter({
  createCategory: protectedProcedure
    .input(createCategorySchema)
    .mutation(({ input }) => {
      return createCategoryController({ input });
    }),

  updateCategory: protectedProcedure
    .input(updateCategorySchema)
    .mutation(({ input }) => {
      return updateCategoryController({ paramsId: input.params, input: input.body });
    }),

  deleteCategory: protectedProcedure
    .input(paramsId)
    .mutation(({ input }) => {
      return deleteCategoryController({ paramsId: input });
    }),

  findAll: publicProcedure
    .query(({ ctx }) => {
      return ctx.prisma.category.findMany({
        select: {
          id: true,
          nameCategory: true,
        },
      });
    }),

  findOne: publicProcedure
    .input(paramsId)
    .query(({ ctx, input }) => {
      return ctx.prisma.category.findUnique({
        where: {
          id: input.categoryId,
        },
      });
    }),
})
