import * as z from "zod";

const createProductSchema = z.object({
  item_code: z
    .string()
    .min(1, "Item code is required")
    .max(50, "Item code must not exceed 50 characters"),
  name: z
    .string()
    .min(1, "Product name is required")
    .max(100, "Product name must not exceed 255 characters"),
  description: z
    .string()
    .max(100, "Description must not exceed 1000 characters")
    .optional(),
  item_group: z.string().min(1, "Category is required"),
  image: z.string().optional(),
  size: z.string().min(1, "Size is required"),
  colour: z.string().max(50, "Color must not exceed 50 characters").optional(),
  quantity: z
    .number()
    .min(0, "Quantity must be 0 or greater")
    .max(1000000, "Quantity must not exceed 1,000,000"),
  UOM: z.string().min(1, "Unit of measurement is required"),
  warehouse: z
    .string()
    .min(1, "Warehouse is required")
    .max(100, "Warehouse name must not exceed 100 characters"),
  floor: z
    .string()
    .min(0, "Floor is required")
    .max(10, "Floor must not exceed 10"),
  rack_no: z
    .string()
    .min(1, "Rack number is required")
    .max(20, "Rack number must not exceed 20 characters"),
  MRP: z
    .number()
    .max(999999.99, "MRP must not exceed ₹999,999.99")
    .optional()
    .or(z.nan().transform(() => undefined)),
  barcode: z
    .string()
    .max(50, "Barcode must not exceed 50 characters")
    .optional(),
  comment: z
    .string()
    .max(500, "Comment must not exceed 500 characters")
    .optional(),
});

export default createProductSchema;
