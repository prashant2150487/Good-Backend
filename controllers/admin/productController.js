import Product from "../../models/Product.js";

// @desc    Add a new product
// @route   POST /api/products
// @access  Private
const addProduct = async (req, res) => {
 
  const productData = req.body;
  const product = new Product(productData);
  const createProduct = await product.save();
  res.status(201).json({
    success: true,
    data: createProduct,
    message: "Product created successfully",
  });
};
const getAllProducts = async (req, res) => {
  const { page = 1, limit = 10, category, search } = req.query;
  const query = {};
  if (category) {
    query.category = { $in: [category] };
  }
  if (search) {
    query.title = { $regex: search, $options: "i" };
  }
  const products = await Product.find(query)
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit))
    .sort({ createdAt: -1 });

  const total = await Product.countDocuments(query);

  res.status(200).json({
    success: true,
    data: products,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
  });
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  const product = await Product.findOne({ id: req.params.id });

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.status(200).json({
    success: true,
    data: product,
  });
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private
const updateProduct = async (req, res) => {
  const product = await Product.findOne({ id: req.params.id });

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const updatedProduct = await Product.findOneAndUpdate(
    { id: req.params.id },
    { $set: req.body },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    data: updatedProduct,
    message: "Product updated successfully",
  });
}

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private
const deleteProduct = async (req, res) => {
  const product = await Product.findOne({ id: req.params.id });

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  await Product.deleteOne({ id: req.params.id });

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
};

export {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
