import axiosInstance from './axios';

interface PresignedUrlResponse {
  success: boolean;
  data: {
    url: string;
    fields: Record<string, string>;
    key: string;
    finalUrl: string;
  };
}

/**
 * Get a presigned URL from the backend
 */
export async function getPresignedUrl(
  fileName: string,
  fileType: string,
): Promise<PresignedUrlResponse['data']> {
  const params: Record<string, string> = { fileName, fileType };

  const response = await axiosInstance.get<PresignedUrlResponse>('/api/assets/presigned-url', {
    params,
  });

  return response.data.data;
}

/**
 * Upload file to S3 using the presigned URL
 */
export async function uploadToS3(
  file: File,
  presignedData: { url: string; fields: Record<string, string> },
): Promise<void> {
  const formData = new FormData();

  // The policy requires Content-Type, so we must add it as a field
  formData.append('Content-Type', file.type);

  // Append all fields from the presigned response
  Object.entries(presignedData.fields).forEach(([key, value]) => {
    formData.append(key, value);
  });

  // Append the file last
  formData.append('file', file);

  // Use standard fetch or axios without default headers (to avoid Authorization header issues with S3)
  await fetch(presignedData.url, {
    method: 'POST',
    body: formData,
  });
}

/**
 * Orchestrator: Handle the full upload flow
 * Returns the final URL of the uploaded asset
 */
export async function handleFileUpload(file: File): Promise<string> {
  // 1. Get presigned URL
  const presignedData = await getPresignedUrl(file.name, file.type);

  // 2. Upload to S3
  await uploadToS3(file, presignedData);

  // 3. Return the final public URL
  return presignedData.finalUrl;
}
