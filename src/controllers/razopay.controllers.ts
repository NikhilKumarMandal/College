import { Request, Response } from "express";
import Razorpay from "razorpay";
import { Course } from "../models/course.model";
import { CoursePurchase } from "../models/coursePurchase.model";
import crypto from "crypto";
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createRazorpayOrder = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      throw new Error("Course not found!");
    }
    const newPurchase = new CoursePurchase({
      course: courseId,
      user: userId,
      amount: course.price,
      status: "pending",
    });

    const options = {
      amount: course.price * 100, // amount in paise,
      currency: "INR",
      receipt: `course_${courseId}`,
      notes: {
        courseId: courseId,
        userId: userId,
      },
    };

    const order = await razorpay.orders.create(options);

    newPurchase.paymentId = order.id;
    await newPurchase.save();

    res.status(200).json({
      success: true,
      order,
      course: {
        name: course.title,
        description: course.description,
      },
    });
  } catch (error) {
    console.error("Error while payment", error);
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;
    if (!isAuthentic) {
      throw new Error("Payement verification failed");
    }

    const purchase = await CoursePurchase.findOne({
      paymentId: razorpay_order_id,
    });
    if (!purchase) {
      throw new Error("Purchase record not found");
    }
    purchase.status = "completed";
    await purchase.save();

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (error) {
    console.error("Failed verification", error);
  }
};
