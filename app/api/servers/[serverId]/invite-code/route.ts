import { currentProfile } from "@/lib/current-profile";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

import { prisma } from "@/lib/prisma";

export const PATCH = async (
  req: Request,
  { params }: { params: { serverId: string } },
) => {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.serverId) {
      return new NextResponse("Server ID Missing", { status: 400 });
    }

    const server = await prisma.server.update({
      where: {
        id: params.serverId,
        profileId: profile.id,
      },
      data: {
        invitedCode: uuidv4(),
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
