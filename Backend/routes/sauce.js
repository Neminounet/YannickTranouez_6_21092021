// Importations
const express = require("express");
const router = express.Router();
const sauceCtrl = require("../controllers/sauce");

// MiddleWare
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

// Routes
router.post("/", auth, multer, sauceCtrl.createSauce);
router.post("/:id/like", auth, sauceCtrl.rateSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.get('/', auth, sauceCtrl.getAllSauces);

// Exportation
module.exports = router;