import { BannerColor, Member, Server, User } from "@prisma/client";
import { Server as NetServer, Socket } from "net";
import { NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";

export type ServerWithMembersWithUsers = Server & {
  members: (Member & {
    user: User;
  })[];
};

export type NextApiResponseServerIO = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};

export type UsersWithBannerColor = User & {
  bannerColor: (BannerColor)[];
};
