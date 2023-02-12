const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const protectRoute = require("../middleWare/authMiddleware");
const { upload } = require("../utils/fileUpload");

router.get("/", protectRoute, getProducts);
router.get("/:id", protectRoute, getProduct);
router.post("/", protectRoute, upload.single("image"), createProduct); // Option: upload.array("image")
router.patch("/:id", protectRoute, upload.single("image"), updateProduct); // Option: upload.array("image")
router.delete("/:id", protectRoute, deleteProduct);

module.exports = router;
