"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Product } from "@/types/product";
import {
  ArrowUpDown,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  QrCode,
} from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Image from "next/image";
import ServerDataTable from "@/components/shared/ServerDataTable";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ImageNotAvailable from "@/assets/images/image-not-available.jpeg";
import isValidImageUrl from "@/utils/isValidImageUrl";

interface ProductsTableProps {
  products: Product[];
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  onView?: (product: Product) => void;
  onGenerateQR?: (product: Product) => void;
  enableRowSelection?: boolean;
  isLoading?: boolean;
  // Server-side pagination props (required)
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalProducts: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  onPageChange: (page: number) => void;
  onNextPage: () => void;
  onPreviousPage: () => void;
  // Search props (required)
  searchValue: string;
  onSearchChange: (search: string) => void;
}

export default function ProductsTable({
  products,
  onEdit,
  onDelete,
  onView,
  onGenerateQR,
  enableRowSelection = false,
  isLoading = false,
  pagination,
  onPageChange,
  onNextPage,
  onPreviousPage,
  searchValue,
  onSearchChange,
}: ProductsTableProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);



  // Prepare images for lightbox
  const images = products.map((product) => ({
    src:
      product.image && isValidImageUrl(product.image)
        ? product.image
        : ImageNotAvailable,
    alt: product.name,
  }));

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const columns: ColumnDef<Product>[] = [
    ...(enableRowSelection
      ? [
          {
            id: "select",
            header: ({ table }) => (
              <Checkbox
                checked={
                  table.getIsAllPageRowsSelected() ||
                  (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) =>
                  table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
              />
            ),
            cell: ({ row }) => (
              <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
              />
            ),
            enableSorting: false,
            enableHiding: false,
            size: 50,
          } as ColumnDef<Product>,
        ]
      : []),
    {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => {
        const productIndex = products.findIndex(
          (p) => p.item_code === row.original.item_code
        );
        const imageUrl = row.getValue("image") as string;
        const validImageUrl = imageUrl && isValidImageUrl(imageUrl);

        return validImageUrl ? (
          <div
            className="w-12 h-12 border border-gray-300 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => openLightbox(productIndex)}
          >
            <Image
              src={imageUrl}
              alt={row.original.name}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-12 h-12 border border-gray-300 rounded-lg overflow-hidden">
            <Image
              src={ImageNotAvailable}
              alt={row.original.name}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
        );
      },
    },
    {
      accessorKey: "item_code",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          Item Code
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("item_code")}</div>
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => {
        const description = row.getValue("description") as string;
        const truncatedDescription =
          description?.length > 50
            ? `${description.substring(0, 50)}...`
            : description;

        return description && description.length > 50 ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-sm text-gray-600 max-w-xs truncate cursor-help">
                {truncatedDescription}
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <p className="text-xs">{description}</p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <div className="text-sm text-gray-600">{description || "-"}</div>
        );
      },
    },
    {
      accessorKey: "item_group",
      header: "Item Group",
      cell: ({ row }) => (
        <Badge variant="secondary">{row.getValue("item_group")}</Badge>
      ),
    },
    {
      accessorKey: "quantity",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          Quantity
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-center font-medium">
          {row.getValue("quantity")}
        </div>
      ),
    },
    {
      accessorKey: "colour",
      header: "Color",
      cell: ({ row }) => (
        <span className="text-sm">{row.getValue("colour")}</span>
      ),
    },
    {
      accessorKey: "warehouse",
      header: "Location",
      cell: ({ row }) => (
        <div className="text-sm text-gray-600">
          <div>{row.getValue("warehouse")}</div>
          <div className="text-xs">
            Floor {row.original.floor}, Rack {row.original.rack_no}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "MRP",
      header: ({ column }) => (
        <div className="text-right">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2"
          >
            MRP
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ),
      cell: ({ row }) => {
        const mrp = row.getValue("MRP") as number;
        return (
          <div className="text-right font-medium">
            {mrp > 0 ? `₹${mrp.toFixed(2)}` : "N/A"}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onView && (
              <DropdownMenuItem onClick={() => onView(row.original)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
            )}
            {onEdit && (
              <DropdownMenuItem onClick={() => onEdit(row.original)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
            )}
            {onGenerateQR && (
              <DropdownMenuItem onClick={() => onGenerateQR(row.original)}>
                <QrCode className="mr-2 h-4 w-4" />
                Generate Code
              </DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem
                onClick={() => onDelete(row.original)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <>
      <ServerDataTable
        data={products}
        columns={columns}
        searchPlaceholder="Search products..."
        emptyMessage="No products found! Go to previous page or create a new product."
        itemName="product"
        enableColumnVisibility={true}
        enableRowSelection={enableRowSelection}
        isLoading={isLoading}
        pagination={pagination}
        onPageChange={onPageChange}
        onNextPage={onNextPage}
        onPreviousPage={onPreviousPage}
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        searchMinLength={3}
      />

      {/* Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={images}
      />
    </>
  );
}
