import { existsSync, unlinkSync } from 'fs';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuid } from 'uuid';

export const profileImageStorage = diskStorage({
  destination: './uploads/profiles',
  filename: (_, file, cb) => {
    const uniqueName = `${uuid()}${extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

export function deleteFile(filePath?: string) {
  if (!filePath) return;

  const fullPath = join(process.cwd(), filePath);

  if (existsSync(fullPath)) {
    unlinkSync(fullPath);
  }
}
