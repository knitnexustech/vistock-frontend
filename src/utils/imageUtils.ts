import Compressor from "compressorjs";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

export interface UploadImageResult {
  success: boolean;
  imageUrl?: string;
  error?: string;
}

export const compressAndUploadImage = async (
  file: File,
  fileLocation: string
): Promise<UploadImageResult> => {
  const s3Client = new S3Client({
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY!,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_KEY!,
    },
    region: process.env.NEXT_PUBLIC_AWS_REGION!,
  });

  try {
    // Compress the image
    const compressedFile = await new Promise<File | Blob>((resolve, reject) => {
      new Compressor(file, {
        quality: 0.9, // High quality compression
        maxWidth: 1500, // Max width limit
        maxHeight: 2000, // Max height limit
        success: resolve,
        error: reject,
      });
    });

    // Convert the compressed file to Uint8Array for upload
    const arrayBuffer = await compressedFile.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Upload to AWS S3
    const command = new PutObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET!,
      Key: fileLocation,
      Body: uint8Array,
      ContentType: compressedFile.type,
    });

    await s3Client.send(command);

    // Construct the public URL for AWS S3
    const imageUrl = `https://${process.env.NEXT_PUBLIC_AWS_BUCKET}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${fileLocation}`;

    return {
      success: true,
      imageUrl,
    };
  } catch (error) {
    console.error("Image upload error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
};

// Helper function to delete an image from S3
export const deleteImageFromS3 = async (fileLocation: string): Promise<boolean> => {
  const s3Client = new S3Client({
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY!,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_KEY!,
    },
    region: process.env.NEXT_PUBLIC_AWS_REGION!,
  });

  try {
    const deleteCommand = new DeleteObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET!,
      Key: fileLocation,
    });

    await s3Client.send(deleteCommand);
    return true;
  } catch (error) {
    console.error("Image deletion error:", error);
    return false;
  }
};

// Helper function to generate a unique file location
export const generateImageLocation = (file: File, tenantId: string): string => {
  const uniqueId = uuidv4();
  const fileExtension = file.name.split(".").pop() || "jpg";

  return `${tenantId}/products/${uniqueId}.${fileExtension}`;
};

