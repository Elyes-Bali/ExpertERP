// middleware/uploadExcel.js
import multer from "multer";

const storage = multer.memoryStorage();

const uploadExcel = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only Excel files allowed"), false);
    }
  },
});

export default uploadExcel;