import { DirectoryService } from "./services/directory.service";
import { FileService } from "./services/file.service";
import { ControllerOptions } from "./index";

export class RocketService {
  readonly File: FileService;
  readonly Directory: DirectoryService;

  constructor(options: ControllerOptions) {
    this.File = new FileService(options);
    this.Directory = new DirectoryService(options);
  }
}
