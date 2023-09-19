import getCurrentUserPage from "@/actions/getCurrentUserPage";
import prismadb from "@/lib/prismadb";
import { NextApiResponseServerIO } from "@/types";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed "});
  };

  try {
    const { user } = await getCurrentUserPage(req);
    const { content, fileUrl } = req.body;
    const { serverId, channelId } = req.query;

    if (!user) {
      return res.status(401).json({ error: "Unauthrozied" });
    }

    if (!content) {
      return res.status(401).json({ error: "Content missing" });
    }

    if (!serverId) {
      return res.status(401).json({ error: "Server ID missing" });
    }

    if (!channelId) {
      return res.status(401).json({ error: "Channel ID missing" });
    }

    const server = await prismadb.server.findFirst({
      where: {
        id: serverId as string,
        members: {
          some: {
            userId: user.id
          }
        }
      },
      include: {
        members: true,
      }
    });

    if (!server) {
      return res.status(404).json({ messages: "Server not found "});
    }

    const channel = await prismadb.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: serverId as string
      }
    });

    if (!channel) {
      return res.status(404).json({ messages: "Channel not found "});
    };

    const member = server.members.find((member) => member.userId === user.id);

    if (!member) {
      return res.status(404).json({ messages: "Member in server not found "});
    };

    const message = await prismadb.message.create({
      data: {
        content,
        fileUrl,
        channelId: channelId as string,
        memberId: member.id,
      },
      include: {
        member: {
          include: {
            user: true
          }
        }
      }
    });

    const channelKey = `chat:${channelId}:messages`;

    res?.socket?.server?.io?.emit(channelKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log("[MESSAGES_POST]", error);
    return res.status(500).json({messages: "Internal Error"})
  }
}