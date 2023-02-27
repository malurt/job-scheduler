import { stringToBoolean } from '@/util/text';

export const uploadOptions = {
  inputName: process.env.INPUT_NAME || 'file',
  filter: {
    filterEnabled: stringToBoolean(process.env.FILTER_ENABLED) || false,
    validExts: ['js'],
  },
  storage: {
    folderName: process.env.FOLDER_NAME || 'uploads',
    keepOriginalFilename:
      stringToBoolean(process.env.KEEP_ORIGINAL_FILENAME) || false,
  },
};
