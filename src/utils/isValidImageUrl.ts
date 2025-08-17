const isValidImageUrl = (url: string): boolean => {
  if (!url) return false;
  try {
    const urlObj = new URL(url);
    // Check if it's an AWS S3 URL (as configured in next.config.ts)
    return urlObj.hostname.includes("amazonaws.com");
  } catch {
    return false;
  }
};

export default isValidImageUrl;
