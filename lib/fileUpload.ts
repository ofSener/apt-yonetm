// Simple file upload utility (placeholder)
// In a real implementation, this would upload to a cloud storage service like S3

export const uploadFile = async (file: File, folder: string): Promise<{ success: boolean; url?: string; error?: string }> => {
  try {
    // For now, this is just a mock implementation
    // In a real app, you would upload to a storage service and return the URL
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create a unique filename based on timestamp and original name
    const timestamp = Date.now();
    const uniqueFilename = `${timestamp}-${file.name}`;
    
    // Return a mock URL that would point to the file
    const url = `/uploads/${folder}/${uniqueFilename}`;
    
    return { success: true, url };
  } catch (error) {
    console.error('Error uploading file:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Helper to get file extension
export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

// Helper to check if file type is allowed
export const isAllowedFileType = (file: File, allowedTypes: string[]): boolean => {
  if (!file.name) return false;
  const extension = getFileExtension(file.name);
  return allowedTypes.includes(extension);
};

// Helper to check if file size is within limit (in MB)
export const isFileSizeValid = (file: File, maxSizeMB: number): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
}; 