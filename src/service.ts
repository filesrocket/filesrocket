import { DirectoryService } from "./services/directory.service";
import { FileService } from "./services/file.service";

export class RocketService {
  readonly File: FileService;
  readonly Directory: DirectoryService;

  constructor(options: { path: string }) {
    this.File = new FileService(options.path);
    this.Directory = new DirectoryService(options.path);
  }
}
