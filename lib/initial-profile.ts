import { auth, currentUser } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";

export const initialProfile = async () => {
  const user = await currentUser();

  if (!user) {
    return auth().redirectToSignIn();
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: user.id },
  });

  if (profile) {
    return profile;
  }

  const newProfile = await prisma.profile.create({
    data: {
      userId: user.id,
      name: `${user.firstName} ${user.lastName}`,
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress,
    },
  });

  return newProfile;
};
