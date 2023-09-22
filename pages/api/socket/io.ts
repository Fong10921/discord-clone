import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";
import { NextApiResponseServerIO } from "@/types";

export const config = {
  api: {
    bodyParser: false,
  },
};

let userStatus: { [key: string]: string } = {};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: "/api/socket/io",
      //@ts-ignore
      addTrailingSlash: false,
    });

    res.socket.server.io = io;

     io.on("connection", (socket) => {
      const userId = socket.handshake.query.userId;

      if (typeof userId !== 'string' || typeof userId === "undefined") {
        // Log error or handle this situation
        console.error("userId must be a string");
        return;
      }

      io.emit('userStatusChanged', { userId, type: "add" }); 

      socket.on("disconnect", () => {
        io.emit('userStatusChanged', { userId, type: 'remove' }); 
      });
    }); 
  }

  res.end(); 
}

export default ioHandler;
