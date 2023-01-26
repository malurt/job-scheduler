import { FileUploadOptions } from '@/main/protocols';
import multer, { Multer } from 'multer';
import path, { resolve } from 'node:path';

export function fileUploaderAdapter(options: FileUploadOptions): Multer {
  const repoPath = resolve(
    __dirname,
    '..',
    '..',
    '..',
    '..',
    `${options.storage.folderName}`
  );

  const storage = multer.diskStorage({
    destination: (_req, _file, callbackFun) => {
      callbackFun(null, repoPath);
    },
    filename: (_req, file, callbackFun) => {
      callbackFun(
        null,
        options.storage.keepOriginalFilename
          ? Date.now() + file.originalname.trim().replaceAll(' ', '')
          : Date.now().toString() + path.extname(file.originalname)
      );
    },
  });

  const multerUploaderMiddleware = (() => {
    if (options.filter.filterEnabled) {
      const filter = (req: any, file: any, cb: Function) => {
        const isValidFile = options.filter.validTypes?.filter(
          (validType) => file.mimetype === validType
        );

        if (isValidFile?.length !== 0) {
          cb(null, true);
        } else {
          req.fileValidationError = `Files of type ${file.mimetype} not allowed`;
          return cb(
            null,
            false,
            new Error(`Files of type ${file.mimetype} not allowed`)
          );
        }
      };
      return multer({ storage, fileFilter: filter });
    }
    return multer({ storage });
  })();

  return multerUploaderMiddleware;
}
