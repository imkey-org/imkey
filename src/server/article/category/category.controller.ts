import { TRPCError } from "@trpc/server";
import type { CreateCategory, ParamsInput, UpdateCategory } from "./category.schema";
import { Prisma } from "@prisma/client";
import { prisma } from "@/server/db";

export async function createCategoryController({
  input
}: {
  input: CreateCategory
}) {
  try {
    const category = await prisma.category.create({
      data: {
        nameCategory: input.nameCategory,
      },
    });

    return {
      status: "success",
      data: category,
    };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Name category already exists",
        });
      }
    }
    throw e;
  }
}

export async function updateCategoryController({
  paramsId,
  input,
}: {
  paramsId: ParamsInput,
  input: UpdateCategory["body"],
}) {
  try {
    const category = await prisma.category.update({
      where: {
        id: paramsId.categoryId,
      },
      data: {
        nameCategory: input.nameCategory,
      },
    });

    return {
      status: "success",
      data: category,
    };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Name category already exists",
        });
      }
    }
    throw e;
  }
}

export async function deleteCategoryController({
  paramsId,
}: {
  paramsId: ParamsInput,
}) {
  try {
    const category = await prisma.category.delete({
      where: {
        id: paramsId.categoryId,
      },
    });

    return {
      status: "success",
      data: category,
    };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Category not found",
        });
      }
    }
    throw e;
  }
}
