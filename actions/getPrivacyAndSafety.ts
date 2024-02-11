import prismadb from "@/lib/prismadb";
import getCurrentUser from "./getCurrentUser";
import desensitizeDatabaseData from "@/utils/desensitizationDatabaseData";

const getPrivacyAndSafety = async () => {
  const { user } = await getCurrentUser();

  const privacyAndSafety = await prismadb.userDetails.findFirst({
    where: {
      userId: user?.id,
    },
  });

  const desensitizatedPrivacyAndSafety = desensitizeDatabaseData("UserDetails", [], privacyAndSafety);

  return desensitizatedPrivacyAndSafety
};

export default getPrivacyAndSafety;
