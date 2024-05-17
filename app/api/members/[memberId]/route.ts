import { currentProfile } from "@/lib/current-profile";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const DELETE = async (
  req: Request,
  {
    params,
  }: {
    params: {
      memberId: string;
    };
  },
) => {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);

    const serverId = searchParams.get("serverId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("Server ID missing", { status: 400 });
    }

    if (!params.memberId) {
      return new NextResponse("Member Id Missing", { status: 400 });
    }

    const server = await prisma.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },

      data: {
        members: {
          deleteMany: {
            id: params.memberId,
            profileId: {
              not: profile.id,
            },
          },
        },
      },

      include: {
        members: {
          include: {
            profile: true,
          },

          orderBy: { role: "asc" },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[MEMBERS_ID_DELETED]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};

export const PATCH = async (
  req: Request,
  { params }: { params: { memberId: string } },
) => {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);
    const { role } = await req.json();

    const serverId = searchParams.get("serverId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("Server ID missing", { status: 400 });
    }

    if (!params.memberId) {
      return new NextResponse("Member ID missing", { status: 400 });
    }

    const server = await prisma.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          update: {
            where: {
              id: params.memberId,
              profileId: {
                not: profile.id,
              },
            },
            data: {
              role,
            },
          },
        },
      },

      include: {
        members: {
          include: {
            profile: true,
          },

          orderBy: {
            role: "asc",
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[MEMBERS_ID_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
