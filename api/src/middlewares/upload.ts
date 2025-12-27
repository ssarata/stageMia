import multer from 'multer';

// Configuration de multer pour stocker les fichiers en mémoire
const storage = multer.memoryStorage();

// Filtrer uniquement les fichiers Excel
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Seuls les fichiers Excel (.xls, .xlsx) sont autorisés'));
  }
};

// Configuration de l'upload
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // Limite de 5MB
  }
});
