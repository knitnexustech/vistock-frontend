"use client";

import { ArrowLeft, Edit, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileActionButtonsProps {
  onBack: () => void;
  onEdit: () => void;
  onCodeGenerate: () => void;
}

export default function MobileActionButtons({
  onBack,
  onEdit,
  onCodeGenerate,
}: MobileActionButtonsProps) {
  return (
    <div className="fixed bottom-16 left-0 right-0 p-4 bg-white border-t border-gray-200">
      <div className="flex flex-col gap-3 max-w-sm mx-auto">
        <div className="flex gap-3">
          <Button
            onClick={onCodeGenerate}
            variant="outline"
            className="flex-1"
          >
            <QrCode className="h-4 w-4 mr-2" />
            Generate Code
          </Button>
          <Button
            onClick={onEdit}
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
        <Button variant="outline" onClick={onBack} className="w-full">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>
    </div>
  );
}
