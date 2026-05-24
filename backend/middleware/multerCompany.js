import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({ storage });

// ✅ accept BOTH image + qrImage
export const uploadCompanyFiles = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "qrImage", maxCount: 1 },
]);