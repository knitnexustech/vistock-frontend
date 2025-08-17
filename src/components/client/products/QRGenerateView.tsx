"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import QRCodeSVG from "react-qr-code";
import {
  ArrowLeft,
  Download,
  Printer,
  QrCode as QrCodeIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Product } from "@/types/product";
import { useUserProfile } from "@/hooks/useUser";
import LoadingState from "@/components/layout/LoadingState";

interface QRGenerateViewProps {
  product: Product;
}

export default function QRGenerateView({ product }: QRGenerateViewProps) {
  const router = useRouter();
  const [qrGenerated, setQrGenerated] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  // Get user profile to use user ID as tenant ID
  const { data: user, isLoading: userLoading } = useUserProfile();

  const clientBaseUrl =
    process.env.NEXT_PUBLIC_CLIENT_BASE_URL || "localhost:3000";

  // Generate QR code URL using user ID as tenant ID
  const tenantId = user?.id || "default";
  const qrCodeUrl = `${clientBaseUrl}/${tenantId}/products/${product.barcode}`;

  const handleBack = () => {
    router.back();
  };

  const handleGenerateQR = () => {
    setQrGenerated(true);
  };

  const handleDownload = () => {
    if (!qrRef.current) return;

    const svg = qrRef.current.querySelector("svg");
    if (!svg) return;

    // Create canvas to convert SVG to PNG
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });
    const svgUrl = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Create download link
      canvas.toBlob((blob) => {
        if (blob) {
          const downloadUrl = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = downloadUrl;
          link.download = `${product.item_code}_qr_code.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(downloadUrl);
        }
      });

      URL.revokeObjectURL(svgUrl);
    };
    img.src = svgUrl;
  };

  const handlePrint = () => {
    if (!qrRef.current) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const qrContent = qrRef.current.innerHTML;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>QR Code - ${product.name}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              padding: 20px;
              margin: 0;
            }
            .qr-container {
              text-align: center;
              margin-bottom: 20px;
            }
            .product-info {
              text-align: center;
              margin-top: 20px;
            }
            .product-name {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .item-code {
              font-size: 14px;
              color: #666;
              margin-bottom: 10px;
            }
            .qr-url {
              font-size: 10px;
              color: #888;
              word-break: break-all;
            }
          </style>
        </head>
        <body>
          <div class="qr-container">
            ${qrContent}
          </div>
          <div class="product-info">
            <div class="product-name">${product.name}</div>
            <div class="item-code">Item Code: ${product.item_code}</div>
            <div class="qr-url">${qrCodeUrl}</div>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  // Show loading if user data is still loading
  if (userLoading) {
    return <LoadingState message="Loading user profile..." />;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBack}
            className="flex-shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Generate QR Code
            </h1>
            <p className="text-sm text-gray-600">
              {product.name} - {product.item_code}
            </p>
          </div>
        </div>
      </div>

      {/* QR Generation Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCodeIcon className="h-5 w-5 text-primary" />
            QR Code Generator
          </CardTitle>
          <CardDescription>
            Generate a QR code that links to this product&#39;s details page
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Product Info */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">
              Product Information
            </h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p>
                <span className="font-medium">Name:</span> {product.name}
              </p>
              <p>
                <span className="font-medium">Item Code:</span>{" "}
                {product.item_code}
              </p>
              <p>
                <span className="font-medium">Item Group:</span>{" "}
                {product.item_group}
              </p>
            </div>
          </div>

          {/* QR URL Info */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">QR Code URL</h3>
            <p className="text-sm text-blue-700 break-all font-mono">
              {qrCodeUrl}
            </p>
          </div>

          {/* Generate Button */}
          {!qrGenerated && (
            <div className="text-center">
              <Button
                onClick={handleGenerateQR}
                className="bg-primary hover:bg-primary/90"
                size="lg"
              >
                <QrCodeIcon className="h-5 w-5 mr-2" />
                Generate QR Code
              </Button>
            </div>
          )}

          {/* QR Code Display */}
          {qrGenerated && (
            <>
              <div className="flex justify-center" ref={qrRef}>
                <div className="p-6 bg-white border-2 border-gray-200 rounded-lg">
                  <QRCodeSVG value={qrCodeUrl} size={256} level="M" />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={handleDownload}
                  variant="outline"
                  className="flex-1 sm:flex-none"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download as PNG
                </Button>
                <Button
                  onClick={handlePrint}
                  variant="outline"
                  className="flex-1 sm:flex-none"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print QR Code
                </Button>
              </div>

              {/* Regenerate Button */}
              <div className="text-center pt-4 border-t">
                <Button
                  onClick={() => setQrGenerated(false)}
                  variant="ghost"
                  size="sm"
                >
                  Generate New QR Code
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

