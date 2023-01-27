export interface FileUploadOptions {
  inputName: string;
  storage: {
    folderName: string;
    keepOriginalFilename: boolean;
  };
  filter: {
    filterEnabled: boolean;
    validExts?: string[];
  };
}
