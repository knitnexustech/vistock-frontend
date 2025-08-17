"use client";

import { MessageSquare } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AdditionalInformationCardProps {
  comment: string;
}

export default function AdditionalInformationCard({ comment }: AdditionalInformationCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          Additional Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <MessageSquare className="h-4 w-4" />
            Comments
          </div>
          <p className="text-gray-900 break-words">{comment}</p>
        </div>
      </CardContent>
    </Card>
  );
}