import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

export const currentProfile = async () => {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  const profile = await prisma.profile.findUnique({
    where: { userId },
  });

  return profile;
};
