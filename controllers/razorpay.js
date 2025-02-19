import Razorpay from "razorpay";
import { validatePaymentVerification } from "../node_modules/razorpay/dist/utils/razorpay-utils.js";
import Order from "../models/Order.js";
import dotenv from "dotenv";
dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const generateReceiptNumber = () => {
  const now = new Date();

  // The server is located in the US so I had to add an offset of
  //  5 and a half hours to get the time in IST
  now.setMinutes(now.getMinutes() + 330);

  // Format date and time: YYYYMMDDHHMM
  const dateTime = now.toISOString().replace(/[-:T]/g, "").slice(0, 12);

  // Generate random number between 1 and 1000
  const randomNumber = Math.floor(Math.random() * 1000).toString().padStart(3, "0");

  return `${dateTime}${randomNumber}`;
};

export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    console.log("[INFO] Received request to create Razorpay order", {
      amount,
      type: typeof amount,
    });
    if (!amount || amount <= 0) {
      console.log("[ERROR] Invalid amount received");
      return res.status(400).json({ message: "Invalid amount" });
    }
    console.log("[SUCCESS] Amount validation passed");
    const options = {
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: generateReceiptNumber(),
      partial_payment: false,
    };
    console.log("[INFO] Creating order with options:", options);
    const order = await razorpay.orders.create(options);
    console.log("[SUCCESS] Order created:", order);
    return res.json({
      status: order.status,
      order_id: order.id,
      amount: amount,
      receipt: order.receipt,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("[ERROR] Failed to create Razorpay order:", error);
    res.status(500).json({ message: "Failed to create order" });
  }
};

export const saveOrderToDatabaseAfterVerification = async (req, res) => {
  try {
    console.log(
      "[INFO] Received request to save order after payment verification"
    );
    const {
      user_id,
      receipt,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      products,
      totalAmount,
      backend_order_id,
    } = req.body;

    console.log("[INFO] Extracted order details:", {
      user_id,
      receipt,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      totalAmount,
      backend_order_id,
      productCount: products?.length,
    });

    if (
      !user_id ||
      !receipt ||
      !razorpay_payment_id ||
      !razorpay_order_id ||
      !razorpay_signature ||
      !products ||
      !totalAmount ||
      !backend_order_id ||
      products.length === 0
    ) {
      console.log("[ERROR] Invalid data received");
      return res.status(400).json({ message: "Invalid data" });
    }

    console.log("[INFO] Validating Razorpay signature...");
    // This took a lot of time because the documentation on Razorpay's Node.js
    // integration is not clear on how razorpay_signature should be verified
    // It seems like they have an easier way to verify the signature using this
    // custom function they have in their utilities. They have also kept the block
    // of code that would've been used prior to the creation of the razorpay-utils.js
    // file which makes it confusing as to what is expected from developers.
    const isPaymentVerified = validatePaymentVerification(
      { order_id: backend_order_id, payment_id: razorpay_payment_id },
      razorpay_signature,
      process.env.RAZORPAY_KEY_SECRET
    );

    console.log(`[INFO] Payment verification result: ${isPaymentVerified}`);

    if (!isPaymentVerified) {
      console.log("[ERROR] Razorpay signature verification failed");
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    console.log("[SUCCESS] Payment verified, updating database...");

    const newOrder = {
      receipt,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      products,
      total_amount: totalAmount,
    };

    console.log("[INFO] Creating/updating order in database for user:", user_id);

    const userOrder = await Order.findOneAndUpdate(
      { user_id },
      { $push: { orders: newOrder } },
      { new: true, upsert: true }
    );
    console.log("[SUCCESS] Order saved successfully:", userOrder);
    const latestOrder = userOrder.orders[userOrder.orders.length - 1];

    const {
      razorpay_order_id: _,
      razorpay_payment_id: __,
      razorpay_signature: ___,
      ...filteredOrder
    } = latestOrder;
    console.log("[SUCCESS] Order being passed to frontend:", filteredOrder);
    return res.status(201).json(filteredOrder);
  } catch (error) {
    console.error("[ERROR] Failed to save order after verification:", error)
    return res.status(500).json({ message: "Server error" });
  }
};

export const getOrdersByUser = async (req, res) => {
  try {
    console.log("[INFO] Fetching orders for user:", req.params.user_id);
    const { user_id } = req.params;

    if (!user_id) {
      console.log("[ERROR] Missing user ID");
      return res.status(400).json({ message: "User ID is required" });
    }

    console.log("[INFO] Querying database for user orders...");

    const userOrders = await Order.findOne({ user_id });

    if (!userOrders || userOrders.orders.length === 0) {
      console.log("[INFO] No orders found for user:", user_id);
      return res.status(404).json({ message: "No orders found for this user" });
    }
    console.log("[SUCCESS] Orders retrieved successfully, filtering sensitive data...");
    const orders = userOrders.orders.map((order) => {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        ...filteredOrder
      } = order.toObject();
      return filteredOrder;
    });
    console.log("[SUCCESS] Orders being passed to frontend:", orders);
    return res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
