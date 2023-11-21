function findUnavailableValues(valuesObj: { [key: string]: any }): string[] {
  return Object.entries(valuesObj)
    .filter(([key, value]) => value === undefined || value === null)
    .map(([key]) => key);
}

function areAllValuesAvailable(values: any[]) {
  
  const result = values.every(value => value !== undefined && value !== null);

  if (result === true) {
    return true
  } else {
    return findUnavailableValues(values)
  }
}

export default areAllValuesAvailable


