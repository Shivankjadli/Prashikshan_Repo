import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: function (req, file, cb) {
    // Generate unique filename: userId_timestamp_originalname
    const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const basename = path.basename(file.originalname, extension);
    cb(null, `${req.user.id}_${uniqueSuffix}_${basename}${extension}`);
  }
});

// File filter to allow only PDF files
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

// Middleware for single resume upload
export const uploadResume = upload.single('resume');

// Middleware for offer letter upload (PDF only, same config)
export const uploadOfferLetter = upload.single('offerLetter');

// Generic error handling middleware for PDF uploads (resume & offer letter)
export const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum size is 5MB.',
      });
    }
  }

  if (error.message === 'Only PDF files are allowed') {
    return res.status(400).json({
      success: false,
      message: 'Only PDF files are allowed.',
    });
  }

  next(error);
};

// File filter to allow PDF and document files
const documentFileFilter = (req, file, cb) => {
  const allowedMimes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC, DOCX, and TXT files are allowed'), false);
  }
};

// Configure multer for documents
const uploadDocument = multer({
  storage: storage,
  fileFilter: documentFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit for assignments
  }
});

// Middleware for single document upload
export const uploadDocumentFile = uploadDocument.single('file');

// Error handling middleware for document upload
export const handleDocumentUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum size is 10MB.',
      });
    }
  }


  if (error.message === 'Only PDF, DOC, DOCX, and TXT files are allowed') {
    return res.status(400).json({
      success: false,
      message: 'Only PDF, DOC, DOCX, and TXT files are allowed for assignment submission.',
    });
  }

  next(error);
};

export default upload;
