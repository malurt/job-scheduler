import { FileUploadOptions } from '@/main/protocols';
import { badRequest } from '@/presentation/utils';
import { logger } from '@/util';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import multer from 'multer';
import path, { resolve } from 'node:path';

export function fileUploaderAdapter(
  options: FileUploadOptions
): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
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
            ? Date.now() + file.originalname.replaceAll(' ', '').toLowerCase()
            : Date.now().toString() +
                path.extname(file.originalname).toLowerCase()
        );
      },
    });
    const multerUploaderMiddleware = (() => {
      if (options.filter.filterEnabled) {
        const filter = (req: Request, file: any, cb: Function) => {
          const fileChunks = file.originalname.split('.');
          const originalFileExt =
            fileChunks.length === 1 ? 'No extension found' : fileChunks.at(-1);
          const isValidFile = options.filter.validExts?.filter(
            (validExt) =>
              originalFileExt.toUpperCase() === validExt.toUpperCase()
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

    const requestHandler = multerUploaderMiddleware.single(options.inputName);

    requestHandler(req, res, (err) => {
      const errorMessage = (() => {
        if (err) {
          return 'Unknown input name!';
        }
        if (req.fileValidationError) {
          return req.fileValidationError;
        }
        if (!req.file) {
          return 'No file found';
        }
        return undefined;
      })();

      if (errorMessage) {
        const bad = badRequest({
          body: {
            message: errorMessage,
            payload: {},
          },
        });

        logger.log({ level: 'error', message: bad.body.error });
        return res.status(bad.statusCode).json(bad.body);
      }
      return next();
    });
  };
}
