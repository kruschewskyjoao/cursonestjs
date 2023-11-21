import { Injectable } from '@nestjs/common';
import { writeFile } from 'fs/promises';

@Injectable()
export class FileService {
  async upload(file: Express.Multer.File, path: string) {
    // caso tenha um banco basta mudar a const result. ex amazon
    const result = await writeFile(path, file.buffer);
    return result;
  }
}
