
import prisma from "@/lib/prismadb";

async function populateDB() {
  await prisma.userDetails.create({
    data: {
      userId: "bea13c9e-b608-41bd-a510-4993354ca97a",
    },
  });
}

export default populateDB