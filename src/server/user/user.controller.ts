import { TRPCError } from "@trpc/server";
import { prisma } from "../db";
import type { CreateUserInput, UpdatePasswordInput, UpdateRoleInput, UpdateUserInput, ForgotPasswordInput, CreateForgotPasswordInput, ParamsInput, ParamsVerifyForgotPasswordInput, VerifyForgotPasswordInput, ParamsVerifyEmailInput } from "./user.schema";
import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
import { decrypt, encrypt } from "@/crypto/crypto";
import { addHours } from "date-fns";
import { HOURS_TO_VERIFY, PASSWORD_HASH_SALT } from "@/constants";
import { type PaginationQueryInput } from "../pagination/pagination.schema";
import { type Pagination } from "../pagination/pagination.interface";

interface VerifyToken {
  id: string;
  email: string;
  expires: Date;
}

export async function createUserController({
  input,
}: {
  input: CreateUserInput
}) {
  try {
    const { name, email, username, password, role } = input;
    await isEmailCheckUnique(email);
    await isUsernameCheckUnique(username);

    const passwordEnc = await bcrypt.hash(password, PASSWORD_HASH_SALT);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        username,
        password: passwordEnc,
        role,
      },
    });

    const expiresToken: Date = addHours(new Date(), HOURS_TO_VERIFY);
    const token: string = encrypt(JSON.stringify({
      id: user.id,
      email: user.email,
      expires: expiresToken,
    }));

    const verify = await prisma.verificationEmailToken.create({
      data: {
        token,
        email,
        expires: expiresToken,
      }
    });

    return {
      status: "success",
      data: {
        id: user.id,
        name: user.name,
        verification: verify.token,
        verificationExpires: verify.expires,
      },
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Email or username already exists",
        });
      }
    }
    throw error;
  }
}

export async function findAllUser({
  query,
}: {
  query: PaginationQueryInput,
}) {
  try {
    const { page, limit, filter, orderColumn, orderMethod, status } = query;

    const filterFind: object = {
      name: (filter ? { search: filter } : undefined),
      isActive: status === "active"
    }

    const user = await prisma.user.findMany({
      select: { password: false, loginAttempts: false },
      where: filterFind,
      orderBy: {
        [orderColumn || 'id']: orderMethod || 'asc',
      },
      skip: page * limit,
      take: limit,
    });

    if (user) {
      const total = await prisma.user.count();

      const pagination: Pagination = {
        total,
        page,
        limit,
        next: (page + 1) * limit >= total ? undefined : page + 1,
        prev: page == 0 ? undefined : page - 1,
      };

      return {
        status: "success",
        data: user,
        pagination,
      }
    }

    return undefined;
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

export async function verifyEmail({
  params
}: {
  params: ParamsVerifyEmailInput,
}) {
  try {
    const user = await findByVerification(params.verificationEmail);

    if (user) {
      const update = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          isActive: true,
          emailVerified: new Date(),
        },
      });

      return {
        status: "success",
        data: update.email,
      }
    }

    return undefined;
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

export async function updateInfo({
  params,
  updateInput
}: {
  params: ParamsInput,
  updateInput: UpdateUserInput["body"],
}) {
  try {
    await isUsernameCheckUnique(updateInput.username, params.userId);

    const updateResult = await prisma.user.update({
      where: {
        id: params.userId
      },
      data: updateInput,
    });

    if (!updateResult) throw new TRPCError({
      code: "NOT_FOUND",
      message: "User Not Found",
    });

    return {
      status: "success",
      data: {
        name: updateResult.name,
        username: updateResult.username,
      },
    }
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

export async function updatePassword({
  params,
  updateInput,
}: {
  params: ParamsInput,
  updateInput: UpdatePasswordInput["body"],
}) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: params.userId,
      },
    });

    if (!user) throw new TRPCError({
      code: "NOT_FOUND",
      message: "User Not Found",
    });

    const isMatch = await bcrypt.compare(updateInput.oldPassword, user.password);
    if (!isMatch) throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Old password is incorrect",
    });

    const passwordEnc = await bcrypt.hash(updateInput.newPassword, PASSWORD_HASH_SALT);
    await prisma.user.update({
      where: {
        id: params.userId,
      },
      data: {
        password: passwordEnc,
      },
    });

    return {
      status: "success",
    }
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

export async function updateRole({
  params,
  updateInput,
}: {
  params: ParamsInput,
  updateInput: UpdateRoleInput["body"],
}) {
  const updateResult = await prisma.user.update({
    where: {
      id: params.userId
    },
    data: updateInput,
  });

  if (!updateResult) throw new TRPCError({
    code: "NOT_FOUND",
    message: "User Not Found",
  });

  return {
    status: "success",
    data: {
      role: updateResult.role,
    },
  }
}

export async function removeAccount({
  params,
}: {
  params: ParamsInput,
}) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: params.userId,
      },
    });

    if (!user) throw new TRPCError({
      code: "NOT_FOUND",
      message: "User Not Found",
    });

    await prisma.user.delete({
      where: {
        id: params.userId,
      },
    });

    return {
      status: "success",
    }
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

export async function createForgotPassword({
  createForgotInput,
}: {
  createForgotInput: CreateForgotPasswordInput
}) {
  try {
    const forgotPassword = await prisma.user.findUnique({
      where: {
        email: createForgotInput.email,
      }
    })

    if (!forgotPassword) throw new TRPCError({
      code: "NOT_FOUND",
      message: "User Not Found",
    });

    const token = encrypt(JSON.stringify({
      id: forgotPassword.id,
      email: forgotPassword.email,
    }));

    await prisma.forgotPassword.create({
      data: {
        token,
        email: forgotPassword.email,
        expires: addHours(new Date(), HOURS_TO_VERIFY),
        ipRequest: createForgotInput.ipRequest,
        browserRequest: createForgotInput.browserRequest,
        countryRequest: createForgotInput.countryRequest,
      },
    });

    return {
      status: "success",
      data: createForgotInput.email,
    }
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

export async function verifyForgotPassword({
  params,
  input,
}: {
  params: ParamsVerifyForgotPasswordInput,
  input: VerifyForgotPasswordInput["body"],
}) {
  try {
    const forgotPassword = await findByVerification(params.verification);

    const user = await prisma.user.findFirst({
      where: {
        id: forgotPassword?.id,
      }
    });

    if (!user) throw new TRPCError({
      code: "NOT_FOUND",
      message: "User Not Found",
    });

    await prisma.forgotPassword.update({
      where: {
        token: params.verification,
      },
      data: {
        firstUsed: true,
        ipChanged: input.ipChanged,
        browserChanged: input.browserChanged,
        countryChanged: input.countryChanged,
      }
    });

    return {
      status: "success",
      data: user.email,
    }
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

export async function resetPassword({
  params,
  input
}: {
  params: ParamsVerifyForgotPasswordInput,
  input: ForgotPasswordInput["body"],
}) {
  try {
    const forgotPassword = await prisma.forgotPassword.findFirst({
      where: {
        token: params.verification,
        email: input.email,
        firstUsed: { not: null },
        finalUsed: null,
        expires: { gte: new Date() }
      }
    });

    if (!forgotPassword) throw new TRPCError({
      code: "NOT_FOUND",
      message: "The code was not found or has been used before or has expired",
    });

    await prisma.forgotPassword.update({
      where: {
        token: params.verification,
      },
      data: {
        finalUsed: true,
      }
    });

    const passwordEnc = await bcrypt.hash(input.password, PASSWORD_HASH_SALT);
    const updateResult = await prisma.user.update({
      where: {
        email: input.email,
      },
      data: {
        password: passwordEnc,
      },
    });

    return {
      status: "success",
      data: updateResult.email,
    }
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

export async function findOneByUserId({
  params,
}: {
  params: ParamsInput,
}) {
  try {
    const user = await prisma.user.findUnique({
      select: { id: false, password: false, loginAttempts: false },
      where: {
        id: params.userId,
      },
    });

    if (!user) throw new TRPCError({
      code: "NOT_FOUND",
      message: "User Not Found",
    });

    return {
      status: "success",
      data: user,
    }
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

// Private function
async function findByVerification(verification: string) {
  try {
    const verify = await prisma.verificationEmailToken.findFirst({
      where: {
        token: verification,
        expires: { gt: new Date() },
      }
    });

    if (!verify) throw new TRPCError({
      code: "NOT_FOUND",
      message: "User Not Found",
    });

    let decrypted: VerifyToken;
    try {
      decrypted = JSON.parse(decrypt(verification));
    } catch (e) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Error parsing decrypted token",
      })
    }

    const user = await prisma.user.findFirst({
      where: {
        id: decrypted?.id,
      }
    });

    if (user?.isActive) throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Account has been verified",
    });

    return user;
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

async function isEmailCheckUnique(email: string) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    select: { email: true },
  });

  if (user) throw new TRPCError({
    code: "CONFLICT",
    message: "Email already exists",
  })

  return true;
}

async function isUsernameCheckUnique(username: string, userId?: string) {
  const user = await prisma.user.findUnique({
    where: {
      username,
      id: userId ? userId : undefined,
    },
    select: { email: true },
  });

  if (user) throw new TRPCError({
    code: "CONFLICT",
    message: "Username already exists",
  })

  return true;
}
