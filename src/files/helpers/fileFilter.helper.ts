import { Logger } from '@nestjs/common';
export const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callBack: Function,
) => {
  const log = new Logger();
  if (!file) return callBack(new Error('No File Added'), false);
  const fileExtension = file.mimetype.split('/')[1];
  const validExtensions = ['jpg', 'gif', 'jpeg', 'webp', 'png'];
  if (validExtensions.includes(fileExtension)) {
    log.debug(`file ${file.originalname} allowed`);
    return callBack(null, true);
  }
  callBack(null, validExtensions);
  log.error(`file ${file.originalname} not allowed`);
};
