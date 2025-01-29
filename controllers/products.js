import Product from "../models/Product.js";

export const fetchAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products." });
  }
};

export const addProduct = async (req, res) => {
  const {
    name,
    price,
    thumbnail,
    imgs,
    description,
    category,
    stock,
    brand,
    frameMaterial,
    weight,
    wheelSize,
    gearSystem,
    brakeType,
    suspension,
    tyreType,
    warranty,
  } = req.body;

  try {
    const newProduct = new Product({
      name,
      price,
      thumbnail,
      imgs,
      description,
      category,
      stock,
      brand,
      frameMaterial,
      weight,
      wheelSize,
      gearSystem,
      brakeType,
      suspension,
      tyreType,
      warranty,
    });

    await newProduct.save();
    res
      .status(201)
      .json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    res.status(500).json({ message: "Failed to add product." });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product." });
  }
};

export const editProduct = async (req, res) => {
  const { _id, name, price, thumbnail, imgs, description, category, stock } =
    req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      _id,
      {
        name,
        price,
        thumbnail,
        imgs,
        description,
        category,
        stock,
      },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update product." });
  }
};
