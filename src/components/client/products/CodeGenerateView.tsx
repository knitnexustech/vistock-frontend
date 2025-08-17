"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import QRCodeSVG from "react-qr-code";
import Barcode from "react-barcode";
import {
  ArrowLeft,
  Download,
  Printer,
  QrCode as QrCodeIcon,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Product } from "@/types/product";
import { useUserProfile } from "@/hooks/useUser";
import LoadingState from "@/components/layout/LoadingState";

interface CodeGenerateViewProps {
  product: Product;
}

type CodeType = "qr" | "barcode";

export default function CodeGenerateView({ product }: CodeGenerateViewProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<CodeType>("qr");
  const [qrGenerated, setQrGenerated] = useState(false);
  const [barcodeGenerated, setBarcodeGenerated] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);
  const barcodeRef = useRef<HTMLDivElement>(null);

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

  const handleGenerateCode = (type: CodeType) => {
    if (type === "qr") {
      setQrGenerated(true);
    } else {
      setBarcodeGenerated(true);
    }
  };

  const handleDownload = (type: CodeType) => {
    const ref = type === "qr" ? qrRef : barcodeRef;
    if (!ref.current) return;

    const element = ref.current.querySelector("svg");
    if (!element) return;

    // Create canvas to convert SVG to PNG
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const svgData = new XMLSerializer().serializeToString(element);
    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });
    const svgUrl = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      // Add padding around the code
      const padding = 40;
      canvas.width = img.width + (padding * 2);
      canvas.height = img.height + (padding * 2);
      
      // Fill with white background
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw the image with padding offset
      ctx.drawImage(img, padding, padding);

      // Create download link
      canvas.toBlob((blob) => {
        if (blob) {
          const downloadUrl = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = downloadUrl;
          link.download = `${product.item_code}_${type}_code.png`;
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

  const handlePrint = (type: CodeType) => {
    const ref = type === "qr" ? qrRef : barcodeRef;
    if (!ref.current) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const codeContent = ref.current.innerHTML;
    const codeTitle = type === "qr" ? "QR Code" : "Barcode";
    
    // Define dimensions for each type
    const dimensions = type === "qr" 
      ? { width: "2in", height: "2in" }  // 2×2 inch for QR code
      : { width: "3in", height: "2in" }; // 3×2 inch for barcode

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${codeTitle} - ${product.name}</title>
          <style>
            @page {
              size: ${dimensions.width} ${dimensions.height};
              margin: 0.1in;
            }
            body {
              font-family: Arial, sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              margin: 0;
              padding: 0;
              width: ${dimensions.width};
              height: ${dimensions.height};
              box-sizing: border-box;
            }
            .print-container {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              width: 100%;
              height: 100%;
              text-align: center;
            }
            .code-container {
              display: flex;
              align-items: center;
              justify-content: center;
              margin-bottom: 0.1in;
            }
            .code-container svg {
              ${type === "qr" ? "width: 1.5in; height: 1.5in;" : "width: 2.5in; height: 0.8in;"}
            }
            .product-info {
              text-align: center;
            }
            .product-name {
              font-size: ${type === "qr" ? "8px" : "10px"};
              font-weight: bold;
              margin-bottom: 2px;
              line-height: 1.2;
            }
            .item-code {
              font-size: ${type === "qr" ? "7px" : "8px"};
              color: #666;
              margin-bottom: 2px;
              line-height: 1.2;
            }
            .code-info {
              font-size: ${type === "qr" ? "6px" : "7px"};
              color: #888;
              word-break: break-all;
              line-height: 1.1;
              max-width: 100%;
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            <div class="code-container">
              ${codeContent}
            </div>
            <div class="product-info">
              <div class="product-name">${product.name}</div>
              <div class="item-code">Item Code: ${product.item_code}</div>
              ${type === "barcode" ? `<div class="code-info">Barcode: ${product.barcode}</div>` : ""}
            </div>
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
              Generate Code
            </h1>
            <p className="text-sm text-gray-600">
              {product.name} - {product.item_code}
            </p>
          </div>
        </div>
      </div>

      {/* Code Generation Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCodeIcon className="h-5 w-5 text-primary" />
            Code Generator
          </CardTitle>
          <CardDescription>
            Generate QR codes or barcodes for this product
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
              <p>
                <span className="font-medium">Barcode:</span> {product.barcode}
              </p>
            </div>
          </div>

          {/* Tabs for QR Code and Barcode */}
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as CodeType)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="qr" className="flex items-center gap-2">
                <QrCodeIcon className="h-4 w-4" />
                QR Code
              </TabsTrigger>
              <TabsTrigger value="barcode" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Barcode
              </TabsTrigger>
            </TabsList>

            {/* QR Code Tab */}
            <TabsContent value="qr" className="space-y-6">
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
                    onClick={() => handleGenerateCode("qr")}
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
                      <QRCodeSVG
                        value={qrCodeUrl}
                        size={256}
                        level="M"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      onClick={() => handleDownload("qr")}
                      variant="outline"
                      className="flex-1 sm:flex-none"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download PNG
                    </Button>
                    <Button
                      onClick={() => handlePrint("qr")}
                      variant="outline"
                      className="flex-1 sm:flex-none"
                    >
                      <Printer className="h-4 w-4 mr-2" />
                      Print Code
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
            </TabsContent>

            {/* Barcode Tab */}
            <TabsContent value="barcode" className="space-y-6">
              {/* Barcode Info */}
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-medium text-green-900 mb-2">Barcode Value</h3>
                <p className="text-sm text-green-700 break-all font-mono">
                  {product.barcode}
                </p>
              </div>

              {/* Generate Button */}
              {!barcodeGenerated && (
                <div className="text-center">
                  <Button
                    onClick={() => handleGenerateCode("barcode")}
                    className="bg-primary hover:bg-primary/90"
                    size="lg"
                  >
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Generate Barcode
                  </Button>
                </div>
              )}

              {/* Barcode Display */}
              {barcodeGenerated && (
                <>
                  <div className="flex justify-center" ref={barcodeRef}>
                    <div className="p-6 bg-white border-2 border-gray-200 rounded-lg">
                      <Barcode
                        value={product.barcode}
                        format="CODE128"
                        width={2}
                        height={100}
                        displayValue={true}
                        fontSize={14}
                        textMargin={10}
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      onClick={() => handleDownload("barcode")}
                      variant="outline"
                      className="flex-1 sm:flex-none"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download PNG
                    </Button>
                    <Button
                      onClick={() => handlePrint("barcode")}
                      variant="outline"
                      className="flex-1 sm:flex-none"
                    >
                      <Printer className="h-4 w-4 mr-2" />
                      Print Code
                    </Button>
                  </div>

                  {/* Regenerate Button */}
                  <div className="text-center pt-4 border-t">
                    <Button
                      onClick={() => setBarcodeGenerated(false)}
                      variant="ghost"
                      size="sm"
                    >
                      Generate New Barcode
                    </Button>
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}