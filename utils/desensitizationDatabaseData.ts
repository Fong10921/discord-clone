export const desensitizationArrayforUser = [
  "id",
  "email",
  "emailVerified",
  "hashedPassword",
  "phoneNumber",
  "disable",
] as const;
export const desensitizationArrayforBannerColor = [
  'id',
  "userId",
  "userServerId",
] as const;
export const desensitizationArrayforUserServerData = [
  "userId",
  "serverId",
  "id",
] as const;
export const desensitizationArrayforServer = [
  "id",
  'inviteCode',
  'userId',
] as const
export const desensitizationArrayForUserDetails = [
  "id",
  "userId",
] as const

const sensitiveFieldConfig = {
  User: desensitizationArrayforUser,
  BannerColor: desensitizationArrayforBannerColor,
  UserServerData: desensitizationArrayforUserServerData,
  Server: desensitizationArrayforServer,
  UserDetails: desensitizationArrayForUserDetails,
  PrivateMessage: ["messageContent"] as const,
};
type SensitiveFieldsUnion =
  (typeof sensitiveFieldConfig)[keyof typeof sensitiveFieldConfig][number];

const desensitizeDatabaseData = <T extends Record<string, any> | null>(
  mainModel: keyof typeof sensitiveFieldConfig,
  subModels: Array<keyof typeof sensitiveFieldConfig> = [],
  modelData: T
): T => {
  // Accumulate all sensitive fields from the specified models
  const allSensitiveFields: SensitiveFieldsUnion[] = [
    mainModel,
    ...subModels,
  ].flatMap((modelName) => sensitiveFieldConfig[modelName] ?? []);

  // Define a recursive function to desensitize the data
  const desensitize = (data: any): any => {
    if (Array.isArray(data)) {
      return data.map((item) => desensitize(item));
    } else if (data && typeof data === "object") {
      const entries = Object.entries(data);

      // Checking if it's a special non-plain object (like Date, etc.).
      // If it has no own enumerable properties, we return it as-is.
      if (entries.length === 0) {
        return data;
      }

      // Process each field, specifically handling sensitive ones.
      return entries.reduce((newData, [key, value]) => {
        // If the key is in our list of sensitive fields, we do not add it to the new object.
        if (allSensitiveFields.includes(key as SensitiveFieldsUnion)) {
          return newData; // Skip this key-value pair, effectively removing it from the resulting object.
        }

        // For other fields, we continue the desensitization process if necessary.
        newData[key] = desensitize(value);
        return newData;
      }, {} as Record<string, any>); // Initialize with an empty object for reduction.
    }

    return data; // If it's not an object or array, return the data as-is.
  };

  // Start the desensitization process.
  return desensitize(modelData);
};

export default desensitizeDatabaseData;