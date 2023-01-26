export interface FileUploadOptions {
  storage: {
    folderName: string;
    keepOriginalFilename: boolean;
  };
  filter: {
    filterEnabled: boolean;
    validTypes?: string[];
  };
}
