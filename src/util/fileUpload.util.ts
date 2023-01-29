import multer, { diskStorage } from "multer";

export function uploadHandler() {
  const storage = diskStorage({});

  const fileFilter = (req: any, file: any, cb: Function) => {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "application/pdf"
    ) {
      cb(null, true);
    } else {
      cb("File Type not supported", false);
    }
  };

  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 10,
    },
    fileFilter: fileFilter,
  });

  return upload;
}
