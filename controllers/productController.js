const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const jwt = require("jsonwebtoken");
const Token = require("../models/tokenModel");
const { fileSizeFormatter } = require("../utils/fileUpload");
const cloudinary = require("cloudinary").v2;

// GET PRODUCTS
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ user: req.user.id }).sort("-createdAt");
  res.status(200).json(products);
});

// GET A SINGLE PRODUCT
const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found!");
  }

  if (product.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not Authorized!");
  }
  res.status(200).json(product);
});

// CREATE A PRODUCT
const createProduct = asyncHandler(async (req, res) => {
  const { name, sku, category, quantity, price, description } = req.body;

  // Validations
  if (!name || !category || !quantity || !price || !description) {
    res.status(400);
    throw new Error("Please, fill in all fields!");
  }

  // TO DO: IMAGE UPLOAD
  let fileData = {};

  if (req.file) {
    // Save File to Cloudinary
    let uploadedFile;

    try {
      uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "Inventory App",
        resource_type: "image",
      });
    } catch (error) {
      res.status(500);
      throw new Error("Image could not be uploaded!");
    }

    fileData = {
      fileName: req.file.originalname,
      filePath: uploadedFile.secure_url,
      fileType: req.file.mimetype,
      fileSize: fileSizeFormatter(req.file.size, 2),
    };
  }

  // Create new Product
  const product = await Product.create({
    user: req.user._id,
    name,
    sku,
    category,
    quantity,
    price,
    description,
    image: fileData,
  });

  res.status(201).json(product);
});

// UPDATE A PRODUCT
const updateProduct = asyncHandler(async (req, res) => {
  const { name, category, quantity, price, description } = req.body;
  const { id } = req.params;
  const product = await Product.findById(id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found!");
  }

  if (product.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User is not Authorized to delete this Product!");
  }

  // Validations
  if (!name || !category || !quantity || !price || !description) {
    res.status(400);
    throw new Error("Please, fill in all fields!");
  }

  // TO DO: IMAGE UPLOAD
  let fileData = {};

  if (req.file) {
    // Save File to Cloudinary
    let uploadedFile;

    try {
      uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "Inventory App",
        resource_type: "image",
      });
    } catch (error) {
      res.status(500);
      throw new Error("Image could not be uploaded!");
    }

    fileData = {
      fileName: req.file.originalname,
      filePath: uploadedFile.secure_url,
      fileType: req.file.mimetype,
      fileSize: fileSizeFormatter(req.file.size, 2),
    };
  }

  // Update Product
  const updatedProduct = await Product.findByIdAndUpdate(
    { _id: id },
    {
      name,
      category,
      quantity,
      price,
      description,
      image: Object.keys(fileData).length === 0 ? product?.image : fileData,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json(updatedProduct);
});

// DELETE A PRODUCT
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found!");
  }

  if (product.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User is not Authorized to delete this Product!");
  }

  await product.remove();
  res.status(200).json({ message: "Product deleted successfully!" });
});

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
