
import prismadb from "./prismadb";
import getCurrentUser from "@/actions/getCurrentUser";
import { redirect } from "next/navigation";

export const initialProfile = async () => {
  const { user } = await getCurrentUser();

  if (!user) {
    return redirect("/")
  };

  const profile = await prismadb.user.findUnique({
    where: {
      id: user.id
    }
  })
}