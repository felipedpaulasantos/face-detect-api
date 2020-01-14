import multer from 'multer';
import fs from 'fs';
import uuidv4 from 'uuid/v4';

const path = require('path');

function configureUpload() {

    const uploadDir = 'uploads';
    if (!fs.existsSync(uploadDir)){
        fs.mkdirSync(uploadDir);
        fs.mkdirSync(uploadDir + '/imgs');
    }
    
    const storage = multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'uploads/imgs');
        },
        filename: function (req, file, cb) {
            let now = Date.now(),
                uniqueId = uuidv4(),
                fileOriginalName = path.extname(file.originalname),
                newFileName = now + uniqueId + fileOriginalName;

            cb(null, newFileName);
        }
    });
    
    const upload = multer({
        storage,
        fileFilter(req, file, cb) {
            console.info("Recebendo o arquivo de imagem...");
            cb(null, true);
        }
    });

    return upload;
}

const upload = configureUpload();
export { upload };