const areAllKeysEmpty = (obj: { [x: string]: any; }): boolean => {
  // Check if every key in the object is empty
  return Object.keys(obj).every((key) => {
    const value = obj[key];
    // Check for undefined, null, or empty string
    if (value === undefined || value === null || value === "") {
      return true;
    }
    // Check for empty array
    if (Array.isArray(value) && value.length === 0) {
      return true;
    }
    // Check for empty object
    if (typeof value === "object" && Object.keys(value).length === 0) {
      return true;
    }
    // If none of the conditions are met, the key is not empty
    return false;
  });
};

export default areAllKeysEmpty