export interface Product {
  item_code: string;
  name: string;
  description: string;
  item_group: string;
  image: string;
  size: string;
  colour: string;
  quantity: number;
  UOM: string;
  warehouse: string;
  floor: string;
  rack_no: string;
  MRP: number;
  barcode: string;
  comment: string;
}

export interface ProductsResponse {
  products: Product[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export interface ProductDetailResponse {
  product: Product;
}

export interface CreateProductRequest {
  item_code: string;
  name: string;
  description: string;
  item_group: string;
  image?: string;
  size: string;
  colour: string;
  quantity: number;
  UOM: string;
  warehouse: string;
  floor: string;
  rack_no: string;
  MRP: number;
  barcode: string;
  comment: string;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  item_group?: string;
  image?: string;
  size?: string;
  colour?: string;
  quantity?: number;
  UOM?: string;
  warehouse?: string;
  floor?: string;
  rack_no?: string;
  MRP?: number;
  barcode?: string;
  comment?: string;
}