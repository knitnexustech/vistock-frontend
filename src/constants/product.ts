export const PRODUCT_API_ENDPOINTS = {
  GET_ALL: "/products",
  CREATE: "/products", 
  UPDATE: (id: string) => `/products/${id}`,
  DELETE: (id: string) => `/products/${id}`,
  GET_BY_ID: (id: string) => `/products/${id}`,
  GET_PUBLIC_BY_BARCODE: (tenantId: string, barcode: string) => `/products/public/${tenantId}/products/${barcode}`,
} as const;

export const CLIENT_ROUTES = {
  DASHBOARD: "/client",
  ALL_PRODUCTS: "/client/products",
  ADD_PRODUCT: "/client/products/add",
  EDIT_PRODUCT: (id: string) => `/client/products/edit/${id}`,
  PRODUCT_DETAILS: (id: string) => `/client/products/${id}`,
  CODE_GENERATE: (id: string) => `/client/products/code-generate/${id}`,
} as const;

// Unit of Measurement (UOM) options
export const UOM_OPTIONS = [
  "Kg",
  "Yard", 
  "Inch",
  "Foot",
  "Centimeter",
  "Meter",
  "Set",
  "Pair",
  "Nos",
  "Box",
  "Unit"
] as const;

export type UOM = typeof UOM_OPTIONS[number];

// Item Groups
export const ITEM_GROUPS = [
  "Cotton Fabric",
  "Foil/Printed Fabric",
  "GPO Fabric",
  "Lycra Fabric",
  "Mesh Fabric",
  "Nylon Fabric",
  "Polyester Fabric",
  "Schiffili Fabric",
  "Schiffili Mesh Fabric",
  "ST Lycra Fabric",
  "Cotton GPO Lace",
  "Cotton Lace",
  "Crochet Lace",
  "Eyelash Lace",
  "Lycra Lace",
  "Nylon Lace",
  "Polyester GPO Lace",
  "Schiffili Lace",
  "Schiffili Mesh Lace",
  "ST Lycra Lace",
  "Tussel/Vanki Lace",
  "Satin Tape",
  "Cross-grain Tape",
  "Bow",
  "Embroidery Patch",
  "GPO Patch",
  "Flower Patch",
  "Imported Samples",
  "Velcro"
] as const;

export type ItemGroup = typeof ITEM_GROUPS[number];

// Floor options (0 for ground floor, 1-10 for upper floors)
export const FLOOR_OPTIONS = [
  "0",
  "1", 
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10"
] as const;

export type Floor = typeof FLOOR_OPTIONS[number];