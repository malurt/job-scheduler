import { stringToBoolean } from '@/util/text';

export const uploadOptions = {
  inputName: 'file',
  filter: {
    filterEnabled: stringToBoolean(process.env.FILTER_ENABLED) || false,
    validExts: ['js'],
  },
  storage: {
    folderName: process.env.FOLDER_NAME || 'uploads',
    keepOriginalFilename: true,
  },
};
