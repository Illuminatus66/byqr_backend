import Cart from "../models/Cart.js";

export const fetchCart = async (req, res) => {
  const { cart_no } = req.params;
  try {
    const cart = await Cart.findOne({ cart_no });
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong..." });
  }
};

// Add to Cart checks if the product already exists in the user's cart and if it does
// then it just increments the qty of the product. If the product doesn't exist in the
// cart then it adds the desired qty to the cart, which is then saved back to the database.
export const addToCart = async (req, res) => {
  const { cart_no, pr_id, qty } = req.body;
  try {
    const cart = await Cart.findOne({ cart_no });
    const existingProduct = cart.products.find(
      (product) => product.pr_id.toString() === pr_id
    );

    if (existingProduct) {
      existingProduct.qty += qty;
    } else {
      cart.products.push({ pr_id: pr_id, qty: qty });
    }

    await cart.save();
    res.status(200).json({ message: "Product added to cart successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong..." });
  }
};

// Remove from Cart filters out the product that the user removes and then saves the cart
// back to the database to ensure data consistency.
export const removeFromCart = async (req, res) => {
  const { cart_no, pr_id } = req.body;
  try {
    const cart = await Cart.findOne({ cart_no });

    cart.products = cart.products.filter(
      (product) => product.pr_id.toString() !== pr_id
    );

    await cart.save();
    res.status(200).json({ message: "Product removed from cart successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong..." });
  }
};

// Update Qty changes the quantity of the concerned product_id in the user's cart_no
export const updateQty = async (req, res) => {
  const { cart_no, pr_id, qty } = req.body;

  try {
    const cart = await Cart.findOne({ cart_no });

    cart.products.forEach((product) => {
      if (product.pr_id.toString() === pr_id) {
        product.qty = qty;
      }
    });

    await cart.save();
    res.status(200).json({ message: "Product quantity updated." });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const clearCart = async (req, res) => {
  const { cart_no } = req.params;
  try {
    const cart = await Cart.findOne({ cart_no });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.products = [];
    await cart.save();
    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong..." });
  }
};
