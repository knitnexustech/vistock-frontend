"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Package,
  FileText,
  Tag,
  Ruler,
  Palette,
  Calculator,
  Building,
  MapPin,
  Barcode,
  MessageSquare,
  IndianRupee,
  Hash,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useGet, useMutate } from "@/hooks/core/useApi";
import {
  PRODUCT_API_ENDPOINTS,
  CLIENT_ROUTES,
  UOM_OPTIONS,
  ITEM_GROUPS,
  FLOOR_OPTIONS,
} from "@/constants/product";
import {
  Product,
  UpdateProductRequest,
  ProductDetailResponse,
} from "@/types/product";
import { queryKeys } from "@/lib/api/apiClient";
import { useQueryClient } from "@tanstack/react-query";
import FormInput from "@/components/shared/FormInput";
import FormSelect from "@/components/shared/FormSelect";
import FormTextarea from "@/components/shared/FormTextarea";
import ImageUpload from "@/components/client/products/ImageUpload";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/api";
import createProductSchema from "@/schemas/createProductSchema";
import {
  compressAndUploadImage,
  generateImageLocation,
  deleteImageFromS3,
} from "@/utils/imageUtils";
import LoadingState from "@/components/layout/LoadingState";
import ErrorState from "@/components/layout/ErrorState";
import { formatFieldName } from "@/utils/formatFieldName";

type EditProductFormData = z.infer<typeof createProductSchema>;

interface EditProductFormProps {
  productId: string;
}

export default function EditProductForm({ productId }: EditProductFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImageLocation, setUploadedImageLocation] = useState<
    string | null
  >(null);

  // Fetch product data
  const {
    data: productResponse,
    isLoading: isLoadingProduct,
    error: productError,
  } = useGet<ProductDetailResponse>(
    queryKeys.products.detail(productId),
    PRODUCT_API_ENDPOINTS.GET_BY_ID(productId)
  );

  const product = productResponse?.product;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<EditProductFormData>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      item_code: "",
      name: "",
      description: "",
      item_group: "",
      image: "",
      size: "",
      colour: "",
      quantity: 0,
      UOM: "",
      warehouse: "",
      floor: "",
      rack_no: "",
      MRP: 0,
      barcode: "",
      comment: "",
    },
  });

  // Pre-populate form when product data is loaded
  useEffect(() => {
    if (product) {
      const formData = {
        item_code: product.item_code || "",
        name: product.name || "",
        description: product.description || "",
        item_group: product.item_group || "",
        image: product.image || "",
        size: product.size || "",
        colour: product.colour || "",
        quantity: product.quantity !== null ? Number(product.quantity) : 0,
        UOM: product.UOM || "",
        warehouse: product.warehouse || "",
        floor: product.floor !== null ? String(product.floor) : "",
        rack_no: product.rack_no !== null ? String(product.rack_no) : "",
        MRP: product.MRP !== null ? Number(product.MRP) : 0,
        barcode: product.barcode || "",
        comment: product.comment || "",
      };

      reset(formData);

      // Set image preview if product has an image
      if (product.image) {
        setImagePreview(product.image);
      }
    }
  }, [product, reset]);

  const updateProductMutation = useMutate<Product, UpdateProductRequest>(
    PRODUCT_API_ENDPOINTS.UPDATE(productId),
    "PUT",
    {
      onSuccess: () => {
        toast.success("Product updated successfully!");
        queryClient.invalidateQueries({ queryKey: queryKeys.products.all() });
        queryClient.invalidateQueries({
          queryKey: queryKeys.products.detail(productId),
        });
        setUploadedImageLocation(null);
        router.push(CLIENT_ROUTES.ALL_PRODUCTS);
      },
      onError: async (error: ApiError) => {
        // If image was uploaded but product update failed, delete the image
        if (uploadedImageLocation) {
          await deleteImageFromS3(uploadedImageLocation);

          setUploadedImageLocation(null);
        }

        // Handle structured validation errors from backend
        if (error?.message === "Validation failed" && error?.data?.details) {
          const details = error.data.details;

          if (Array.isArray(details) && details.length > 0) {
            // Show each validation error with user-friendly field names
            details.forEach((detail: { field: string; message: string }) => {
              const friendlyFieldName = formatFieldName(detail.field);
              toast.error(`${friendlyFieldName}: ${detail.message}`);
            });
          } else {
            toast.error("Validation failed. Please check your input.");
          }
        } else {
          // Handle other types of errors
          toast.error(
            error?.message || "Failed to update product. Please try again."
          );
        }
      },
    }
  );

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);

    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Helper function to extract S3 key from full image URL
  const extractS3KeyFromUrl = (imageUrl: string): string | null => {
    try {
      const url = new URL(imageUrl);
      // Remove the leading slash from pathname to get the S3 key
      return url.pathname.substring(1);
    } catch {
      return null;
    }
  };

  const removeImage = async () => {
    // If user had selected a new image, delete it from S3 and revert to original
    if (selectedImage) {
      // Delete the uploaded image from S3 if it was uploaded
      if (uploadedImageLocation) {
        toast.info("Deleting uploaded image...");
        const deleted = await deleteImageFromS3(uploadedImageLocation);
        if (deleted) {
          toast.success("Uploaded image deleted from storage");
        }
        setUploadedImageLocation(null);
      }
      
      setSelectedImage(null);
      // Revert to original product image
      setImagePreview(product?.image || null);
      toast.info("Reverted to original product image");
    } else {
      // Allow removing original image so user can select a new one
      setSelectedImage(null);
      setImagePreview(null);
      toast.info("Image removed. Please select a new image before saving.");
    }
  };

  const onSubmit = async (data: EditProductFormData) => {
    try {
      setIsUploading(true);
      
      // Validate that an image is present (either selected or existing)
      if (!selectedImage && !imagePreview) {
        toast.error("Product image is required. Please select an image.");
        setIsUploading(false);
        return;
      }

      let imageUrl = data.image || undefined;

      // If there's a new selected image, upload it first
      if (selectedImage) {
        toast.info("Uploading image...");
        const fileLocation = generateImageLocation(selectedImage, "products");
        const uploadResult = await compressAndUploadImage(
          selectedImage,
          fileLocation
        );

        if (uploadResult.success) {
          imageUrl = uploadResult.imageUrl;
          setUploadedImageLocation(fileLocation);
          toast.success("Image uploaded successfully!");
        } else {
          toast.error(`Image upload failed: ${uploadResult.error}`);
          return;
        }
      }

      // Send all fields except item_code and barcode (non-editable fields)
      const updateData: UpdateProductRequest = {
        name: data.name,
        description: data.description,
        item_group: data.item_group,
        image: imageUrl,
        size: data.size,
        colour: data.colour,
        quantity: data.quantity,
        UOM: data.UOM,
        warehouse: data.warehouse,
        floor: data.floor,
        rack_no: data.rack_no,
        MRP: data.MRP,
        comment: data.comment,
      };

      updateProductMutation.mutate(updateData);
    } catch (error) {
      toast.error("Failed to process image upload");
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoadingProduct) {
    return <LoadingState />;
  }

  if (productError || !product) {
    return (
      <ErrorState
        title="Failed to load product"
        description="There was an error loading the product details. Please try again."
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Package className="h-6 w-6 text-primary" />
            <span>Edit Product</span>
          </CardTitle>
          <CardDescription>
            Update product information and save changes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  id="item_code"
                  label="Item Code"
                  type="text"
                  placeholder="e.g. COTTON-001"
                  icon={Hash}
                  error={errors.item_code?.message}
                  register={register("item_code")}
                  required
                  disabled
                />

                <FormInput
                  id="name"
                  label="Product Name"
                  type="text"
                  placeholder="e.g. Cotton Premium"
                  icon={Package}
                  error={errors.name?.message}
                  register={register("name")}
                  required
                />

                <FormSelect
                  id="item_group"
                  label="Item Group"
                  placeholder="Select item group"
                  icon={Tag}
                  options={ITEM_GROUPS.map((itemGroup) => ({
                    value: itemGroup,
                    label: itemGroup,
                  }))}
                  error={errors.item_group?.message}
                  control={control}
                  name="item_group"
                  required
                />

                <div className="md:col-span-2">
                  <FormTextarea
                    id="description"
                    label="Description (optional)"
                    placeholder="High-quality cotton fabric suitable for shirts and dresses."
                    icon={FileText}
                    error={errors.description?.message}
                    register={register("description")}
                    rows={3}
                  />
                </div>

                <div className="md:col-span-2">
                  <ImageUpload
                    label="Product Image"
                    onImageSelect={handleImageSelect}
                    onImageRemove={removeImage}
                    imagePreview={imagePreview}
                    maxSizeMB={5}
                    acceptedFormats={["PNG", "JPG", "JPEG"]}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Product Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormInput
                  id="size"
                  label="Size"
                  type="text"
                  placeholder="e.g. 2m x 1.5m"
                  icon={Ruler}
                  error={errors.size?.message}
                  register={register("size")}
                  required
                />

                <FormInput
                  id="colour"
                  label="Color (optional)"
                  type="text"
                  placeholder="e.g. Blue"
                  icon={Palette}
                  error={errors.colour?.message}
                  register={register("colour")}
                />

                <FormInput
                  id="quantity"
                  label="Quantity"
                  type="number"
                  placeholder="100"
                  icon={Calculator}
                  error={errors.quantity?.message}
                  register={register("quantity", { valueAsNumber: true })}
                  required
                />

                <FormSelect
                  id="UOM"
                  label="Unit of Measurement"
                  placeholder="Select UOM"
                  icon={Calculator}
                  options={UOM_OPTIONS.map((uom) => ({
                    value: uom,
                    label: uom,
                  }))}
                  error={errors.UOM?.message}
                  control={control}
                  name="UOM"
                  required
                />

                <FormInput
                  id="barcode"
                  label="Barcode"
                  type="text"
                  placeholder="1234567890123"
                  icon={Barcode}
                  error={errors.barcode?.message}
                  register={register("barcode")}
                  disabled
                />

                <FormInput
                  id="MRP"
                  label="MRP (₹) (optional)"
                  type="number"
                  step="0.01"
                  placeholder="450.00"
                  icon={IndianRupee}
                  error={errors.MRP?.message}
                  register={register("MRP", { valueAsNumber: true })}
                />
              </div>
            </div>

            {/* Location & Storage */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Location & Storage
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormInput
                  id="warehouse"
                  label="Warehouse"
                  type="text"
                  placeholder="Main Warehouse"
                  icon={Building}
                  error={errors.warehouse?.message}
                  register={register("warehouse")}
                  required
                />

                <FormSelect
                  id="floor"
                  label="Floor"
                  placeholder="0 for ground floor"
                  icon={MapPin}
                  options={FLOOR_OPTIONS.map((floor) => ({
                    value: floor,
                    label: floor === "0" ? "0 (Ground Floor)" : floor,
                  }))}
                  error={errors.floor?.message}
                  control={control}
                  name="floor"
                  required
                />

                <FormInput
                  id="rack_no"
                  label="Rack Number"
                  type="text"
                  placeholder="R12"
                  icon={MapPin}
                  error={errors.rack_no?.message}
                  register={register("rack_no")}
                  required
                />
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                Additional Information
              </h3>
              <FormTextarea
                id="comment"
                label="Comments (optional)"
                placeholder="Seasonal stock. Handle with care."
                icon={MessageSquare}
                register={register("comment")}
                rows={3}
              />
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateProductMutation.isPending || isUploading}
                className="bg-primary hover:bg-primary/90"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading Image...
                  </>
                ) : updateProductMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating Product...
                  </>
                ) : (
                  "Update Product"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
