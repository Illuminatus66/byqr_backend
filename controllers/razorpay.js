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

  // Format date and time: YYYYMMDDHHMM
  const dateTime = now.toISOString().replace(/[-:T]/g, "").slice(0, 12);

  // Generate random number between 1 and 1000
  const randomNumber = Math.floor(Math.random() * 1000) + 1;

  return `${dateTime}${randomNumber.toString().padStart(3, "0")}`;
};

export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: generateReceiptNumber(),
      partial_payment: false,
    };

    const order = await razorpay.orders.create(options);

    return res.json({
      status: order.status,
      order_id: order.id,
      amount: amount,
      receipt: order.receipt,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create order" });
  }
};

export const saveOrderToDatabaseAfterVerification = async (req, res) => {
  try {
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
      return res.status(400).json({ message: "Invalid data" });
    }

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

    if (isPaymentVerified) {
      const newOrder = {
        receipt,
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
        products,
        total_amount: totalAmount,
      };

      const userOrder = await Order.findOneAndUpdate(
        { user_id },
        { $push: { orders: newOrder } },
        { new: true, upsert: true }
      );

      const latestOrder = userOrder.orders[userOrder.orders.length - 1];

      const {
        razorpay_order_id: _,
        razorpay_payment_id: __,
        razorpay_signature: ___,
        ...filteredOrder
      } = latestOrder;

      return res.status(201).json(filteredOrder);
    } else {
      return res.status(400).json({
        message: "We were unable to verify the validity of razorpay_signature",
      });
    }
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getOrdersByUser = async (req, res) => {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const userOrders = await Order.findOne({ user_id });

    if (!userOrders || userOrders.orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    const orders = userOrders.orders.map((order) => {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        ...filteredOrder
      } = order.toObject();
      return filteredOrder;
    });

    return res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
