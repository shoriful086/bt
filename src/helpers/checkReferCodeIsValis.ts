import { ReferStatus } from "@prisma/client";
import { prisma } from "../shared/prisma";

const checkReferCodeAndCreateRefer = async (payload: any) => {
  if (payload?.appUser?.refererBy) {
    const checkReferCode = await prisma.appUser.findFirst({
      where: {
        referrelCode: payload.appUser.refererBy,
      },
    });

    if (!checkReferCode) {
      throw new Error("Invalid refer code");
    }

    await prisma.refer.create({
      data: {
        referUsedUserNumber: checkReferCode.phoneNumber,
        referCode: checkReferCode.referrelCode,
        status: ReferStatus.PENDING,
      },
    });
  }
};

export default checkReferCodeAndCreateRefer;
