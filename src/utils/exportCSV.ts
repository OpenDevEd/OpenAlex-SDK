import fs from 'fs';

type FlattenedObject = { [key: string]: any };

// Enhanced helper function to flatten an object, including arrays and deeper nesting
function flattenObject(obj: any, parentKey = '', depth = 0): FlattenedObject {
  const flattened: FlattenedObject = {};

  for (const [key, value] of Object.entries(obj)) {
    const newKey = parentKey ? `${parentKey}.${key}` : key;

    if (key === 'counts_by_year' && Array.isArray(value)) {
      // Handle counts_by_year array specifically
      value.forEach((item) => {
        if (typeof item === 'object' && item !== null && 'year' in item) {
          const yearKey = `${newKey}.${item.year}`;

          Object.entries(item).forEach(([itemKey, itemValue]) => {
            if (itemKey !== 'year') {
              // Exclude the year from being a nested key
              flattened[`${yearKey}.${itemKey}`] = itemValue?.toString();
            }
          });
        }
      });
    } else if (typeof value === 'object' && value !== null) {
      if (Array.isArray(value)) {
        // General array handling
        value.forEach((item, index) => {
          if (typeof item === 'object' && item !== null) {
            Object.assign(
              flattened,
              flattenObject(item, `${newKey}[${index}]`, depth + 1),
            );
          } else {
            flattened[`${newKey}[${index}]`] = item.toString();
          }
        });
      } else {
        // Recursively flatten nested objects
        Object.assign(flattened, flattenObject(value, newKey, depth + 1));
      }
    } else {
      flattened[newKey] = value?.toString();
    }
  }

  return flattened;
}

// Main function to convert an array of objects to CSV remains the same
export function convertToCSV(data: any[], filename: string): string {
  if (data.length === 0) return '';

  // Flatten each object in the data array using the enhanced function
  const flattenedData = data.map((item) => flattenObject(item));

  // Extract headers
  const headers = Object.keys(flattenedData[0]);

  // Create CSV rows from flattened data
  const rows = flattenedData.map((item) => {
    return headers.map((header) => `"${item[header] ?? ''}"`).join(',');
  });

  // Combine headers and rows into a CSV string
  const csvString = [headers.join(','), ...rows].join('\n');
  fs.writeFileSync(`${filename}.csv`, csvString);

  return csvString;
}

// // Example usage
// const data = [
//   { id: 1, name: 'John Doe', address: { city: 'CityX', street: 'StreetY' } },
//   { id: 2, name: 'Jane Doe', address: { city: 'CityZ', street: 'StreetA' } },
// ];

// const csvString = convertToCSV(data);
// fs.writeFileSync('test.csv', csvString);
