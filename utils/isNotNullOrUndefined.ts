function isNotNullOrUndefined(value: any): boolean {
  // Base case for recursion: if value is an object or array, recurse
  if (value && typeof value === 'object') {
    return Object.keys(value).every(key => isNotNullOrUndefined(value[key]));
  }
  // If value is neither null nor undefined, return true
  return value !== null && value !== undefined;
}

export default isNotNullOrUndefined