/**
 * Converts backend field names to user-friendly labels
 */
export function formatFieldName(fieldName: string): string {
  const fieldMap: Record<string, string> = {
    item_code: "Item Code",
    item_group: "Item Group",
    rack_no: "Rack Number",
    UOM: "Unit of Measurement",
    MRP: "MRP",
  };

  // Return mapped name or convert snake_case to Title Case
  if (fieldMap[fieldName]) {
    return fieldMap[fieldName];
  }

  // Convert snake_case to Title Case
  return fieldName
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}