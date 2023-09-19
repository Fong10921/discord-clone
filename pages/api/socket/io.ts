import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";

import { NextApiResponseServerIO } from "@/types";
import getCurrentUser from "@/actions/getCurrentUserPage";

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = async (req: NextApiRequest, res: NextApiResponseServerIO) => {
  const user = await getCurrentUser(req);
  if (!res.socket.server.io) {
    const path = "/api/socket/io";
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: path,
      // @ts-ignore
      addTrailingSlash: false,
    });
    res.socket.server.io = io;

    io.on("connection", (socket) => { // Fixed here
      console.log("a user connected");

      socket.broadcast.emit("user-connected", user.id);

      socket.on("disconnect", () => {
        console.log(`User disconnected`);

        socket.broadcast.emit("user-disconnected", user.id);
      })
    })

  };

  res.end();
}

export default ioHandler;