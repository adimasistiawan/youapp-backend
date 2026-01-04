import { existsSync, unlinkSync } from 'fs';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuid } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

export const profileImageStorage = diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), 'uploads/profiles');
    ensureDir(uploadPath);
    cb(null, uploadPath);
  },
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

export function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}
