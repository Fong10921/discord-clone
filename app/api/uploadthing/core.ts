import getCurrentUser from "@/actions/getCurrentUser";
import toast from "react-hot-toast";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

const handleAuth = async () => {
  const { user } = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  return { userId: user.id };
};

export const ourFileRouter = {
  serverImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
  .middleware(() => handleAuth())
  .onUploadComplete(() => {
    toast.success("Upload Image Successfully");
  }),

  messageFile: f(["image", "pdf"]).middleware(() => handleAuth()).onUploadComplete(() => {
    toast.success("Upload image or pdf Successfully");
  }),

  profileImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
  .middleware(() => handleAuth())
  .onUploadComplete(() => {
    toast.success("Upload Image Successfully");
  }),

} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
