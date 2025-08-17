"use client";

import { useRouter } from "next/navigation";
import { Product } from "@/types/product";
import { CLIENT_ROUTES } from "@/constants/product";
import ProductHeader from "@/components/client/products/productDetails/ProductHeader";
import ProductImageCard from "@/components/client/products/productDetails/ProductImageCard";
import LocationStorageCard from "@/components/client/products/productDetails/LocationStorageCard";
import BasicInformationCard from "@/components/client/products/productDetails/BasicInformationCard";
import ProductDetailsCard from "@/components/client/products/productDetails/ProductDetailsCard";
import AdditionalInformationCard from "@/components/client/products/productDetails/AdditionalInformationCard";
import MobileActionButtons from "@/components/client/products/productDetails/MobileActionButtons";
import { isMobile, isTablet } from "react-device-detect";

interface ProductDetailsViewProps {
  product: Product;
}

export default function ProductDetailsView({
  product,
}: ProductDetailsViewProps) {
  const router = useRouter();

  const handleEdit = () => {
    router.push(CLIENT_ROUTES.EDIT_PRODUCT(product.item_code));
  };

  const handleCodeGenerate = () => {
    router.push(CLIENT_ROUTES.CODE_GENERATE(product.item_code));
  };

  const handleBack = () => {
    router.push(CLIENT_ROUTES.ALL_PRODUCTS);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-6">
      {/* Header */}
      <ProductHeader
        product={product}
        onBack={handleBack}
        onEdit={handleEdit}
        onCodeGenerate={handleCodeGenerate}
      />

      {/* Image & Location Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProductImageCard imageUrl={product.image} productName={product.name} />

        <LocationStorageCard
          warehouse={product.warehouse}
          floor={product.floor}
          rackNo={product.rack_no}
        />
      </div>

      {/* Basic Information */}
      <BasicInformationCard
        name={product.name}
        itemGroup={product.item_group}
        description={product.description}
      />

      {/* Product Details */}
      <ProductDetailsCard
        size={product.size}
        colour={product.colour}
        quantity={product.quantity}
        uom={product.UOM}
        barcode={product.barcode}
        mrp={product.MRP}
      />

      {/* Additional Information */}
      {product.comment && (
        <AdditionalInformationCard comment={product.comment} />
      )}

      {/* Mobile Action Buttons */}
      {(isMobile || isTablet) && (
        <MobileActionButtons onBack={handleBack} onEdit={handleEdit} onCodeGenerate={handleCodeGenerate} />
      )}
    </div>
  );
}

