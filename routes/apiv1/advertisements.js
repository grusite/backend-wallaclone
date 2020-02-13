const express = require('express');
const expressDeliver = require('express-deliver');
const router = express.Router();
const multer = require('multer');
const advertisementController = require('../../controllers/advertisementController');
const userController = require('../../controllers/userController');

expressDeliver(router);

// TODO mirar si necesito este trocito de código para subir imágenes
const storage = multer.diskStorage({
  destination: 'public/images',
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

router.use('/', userController.requireUser);
router.get('/', advertisementController.listAds);
router.get('/tags/', advertisementController.listTags);
router.get('/:id', advertisementController.listAdbyId);
router.post('/', upload.single('picture'), advertisementController.addAd);
router.put('/:id', advertisementController.updateAd);
router.delete('/:id', advertisementController.deleteAd);

module.exports = router;
