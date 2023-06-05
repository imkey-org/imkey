import { Prisma, Publish } from "@prisma/client";
import type { ParamsAuthorInput, CreateArticleInput, ParamsArticleInput, UpdateArticleInput, UpdatePublishInput, ParamsSlugInput } from "./article.schema";
import { TRPCError } from "@trpc/server";
import { prisma } from "@/server/db";
import { type PaginationQueryInput } from "../pagination/pagination.schema";
import { type Pagination } from "../pagination/pagination.interface";

export async function createArticleController({
  params,
  input,
}: {
  params: ParamsAuthorInput,
  input: CreateArticleInput["body"]
}) {
  try {
    const { titleArticle, contentArticle, thumbnailArticle, categoryId, publish } = input;

    const article = await prisma.article.create({
      data: {
        titleArticle,
        slugArticle: titleArticle.toLowerCase().replace(/ /g, "-"),
        contentArticle,
        thumbnailArticle,
        author: params.authorId,
        categoryId,
        publish,
        datePublish: publish === Publish.Publish ? new Date() : null,
      },
    });

    return {
      status: "success",
      data: article,
    };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Title article already exists",
        });
      } else if (e.code === "P2025") {
        if (
          e?.meta.target.includes("author") ||
          e?.meta.target.includes("category")
        ) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Author or category not found",
          })
        }
      }
    }

    throw e;
  }
}

export async function updateArticleController({
  paramsId,
  input,
}: {
  paramsId: ParamsArticleInput,
  input: UpdateArticleInput["body"]
}) {
  try {
    const { titleArticle, contentArticle, thumbnailArticle, categoryId, publish } = input;

    const article = await prisma.article.update({
      where: {
        id: paramsId.articleId,
      },
      data: {
        titleArticle,
        slugArticle: titleArticle.toLowerCase().replace(/ /g, "-"),
        contentArticle,
        thumbnailArticle,
        categoryId,
        publish,
        datePublish: publish === Publish.Publish ? new Date() : null,
      },
    });

    return {
      status: "success",
      data: article,
    };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Title article already exists",
        });
      } else if (e.code === "P2025") {
        if (e?.meta.target.includes("category")) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Category not found",
          })
        }
      }
    }

    throw e;
  }
}

export async function updatePublishArticleController({
  paramsId,
  input,
}: {
  paramsId: ParamsArticleInput,
  input: UpdatePublishInput["body"],
}) {
  try {
    const article = await prisma.article.findUnique({
      where: {
        id: paramsId.articleId,
      },
      select: {
        publish: true,
        datePublish: true,
      },
    });

    const articleUpdate = await prisma.article.update({
      where: {
        id: paramsId.articleId,
      },
      data: {
        publish: input.publish,
        datePublish: article?.datePublish ? article?.datePublish : (input.publish === Publish.Publish ? new Date() : null),
      },
    });

    return {
      status: "success",
      data: {
        title: articleUpdate.titleArticle,
        publish: articleUpdate.publish,
      },
    };
  } catch (e) {
    throw e;
  }
}

export async function deleteArticleController({
  paramsId,
}: {
  paramsId: ParamsArticleInput,
}) {
  try {
    const article = await prisma.article.delete({
      where: {
        id: paramsId.articleId,
      },
    });

    return {
      status: "success",
      data: article,
    };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Article not found",
        })
      }
    }
    throw e;
  }
}

export async function findOneSlug({
  params
}: {
  params: ParamsSlugInput,
}) {
  try {
    const article = await prisma.article.findFirst({
      where: {
        slugArticle: params.slug,
      },
      include: {
        user: true,
        category: true,
      }
    });

    return {
      status: "success",
      data: article,
    };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Article not found",
        })
      }
    }

    throw e;
  }
}

export async function findOneArticle({
  params,
}: {
  params: ParamsArticleInput,
}) {
  try {
    const article = await prisma.article.findUnique({
      where: {
        id: params.articleId,
      },
      include: {
        user: true,
        category: true,
      }
    });

    return {
      status: "success",
      data: article,
    };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Article not found",
        })
      }
    }

    throw e;
  }
}

export async function findAllArticle({
  query,
}: {
  query: PaginationQueryInput,
}) {
  try {
    const { page, limit, filter, orderColumn, orderMethod, status } = query;

    const filterFind: object = {
      titleArticle: (filter ? { search: filter } : undefined),
      Publish: (status === "publish" ? Publish.Publish : (status === "draft" ? Publish.Draft : undefined)),
    }

    const articles = await prisma.article.findMany({
      skip: page * limit,
      where: filterFind,
      orderBy: {
        [orderColumn || 'id']: orderMethod || 'asc',
      },
      take: limit,
      include: {
        user: true,
        category: true,
      },
    });

    const total = await prisma.article.count();

    const pagination: Pagination = {
      total,
      page,
      limit,
      next: (page + 1) * limit >= total ? undefined : page + 1,
      prev: page == 0 ? undefined : page - 1,
    };

    return {
      status: "success",
      data: articles,
      pagination,
    };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: e.message,
      });
    }

    throw e;
  }
}
