import { ITrackingOrderData } from "./../types/data";
import { IUser } from "./../types/user";
import { ICart } from "./../types/cart";
import { IProduct } from "./../types/product";
import {
  errorResponse,
  notFoundResponse,
  serverErrorResponse,
} from "./../util/api.response";
import { IOrder } from "./../types/order";
import { Request, Response } from "express";
import Order from "../models/orders.model";
import { successResponse } from "../util/api.response";
import axios from "axios";
import { config } from "dotenv";
import path from "path";
import Product from "../models/products.model";
import Cart from "../models/cart.model";
import User from "../models/user.model";
config({ path: path.resolve(__dirname, "../../.env") });

export const createOrder = async (req: any, res: Response) => {
  try {
    const body = req.body as IOrder;

    let user: IUser | null = await User.findById(req.user._id);
    if (!user) return notFoundResponse("id", req.user._id, "User", res);

    let cart: ICart[] = await Cart.find({
      addedBy: req.user._id,
      checkedOut: false,
    });
    if (cart.length == 0)
      return errorResponse("You have not added any item to your cart", res);

    let items: any[] = [];
    let totalPrice = 0;

    for (let i = 0; i < cart.length; i++) {
      let product: IProduct | null = await Product.findById(cart[i].productId);
      if (!product)
        return notFoundResponse("id", cart[i].productId, "Product", res);
      await Cart.findByIdAndUpdate(cart[i]._id, { checkedOut: true });

      totalPrice += cart[i].price;
      let obj = {
        quantity: cart[i].quantity,
        sku: product.sku,
      };

      items.push(obj);
    }
    if (items.length == 0)
      return errorResponse("Failed to make the order", res);

    let order: IOrder = new Order();
    order.createdBy = req.user._id;
    order.items = items;
    order.orderRef = "GEEPX_" + Math.floor(Math.random() * 1000000000000 + 1);
    order.totalPrice = totalPrice;
    order.otherDetails = body.otherDetails;
    order.shipping = body.shipping;

    let tracking: ITrackingOrderData = await createTrackingOrder(user, order);
    if (!tracking.success) return errorResponse("Unable to create tracking", res);

    order.asyad.order_number = tracking.data?.order_number 
    order.asyad.order_awb_number = tracking.data?.order_awb_number

    await order.save();

    return successResponse("Created Order", order, res);
  } catch (error) {
    return serverErrorResponse(error, res);
  }
};

const createTrackingOrder = async (
  user: IUser,
  order: IOrder
): Promise<ITrackingOrderData> => {
  let token = "Bearer " + process.env.ASYAD_TOKEN;
  let options = {
    method: "POST",
    url: "https://apix.stag.asyadexpress.com/v2/orders/fulfillment",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    data: {
      ClientOrderRef: order.orderRef,
      Description: "GEEPX Orders",
      PaymentType:
        order.shipping.country.toUpperCase() == "OMAN" ? "COD" : "PREPAID",
      TotalAmount:
        order.shipping.country.toUpperCase() == "OMAN"
          ? Number(order.totalPrice)
          : 0,
      TotalShipmentValue:
        order.shipping.country.toUpperCase() == "OMAN"
          ? Number(order.totalPrice)
          : 0,
      comments: "",
      ShipmentProduct: "EXPRESS",
      ShipmentService: "ALL_DAY",
      JourneyOptions: {
        AdditionalInfo: "",
        NOReturn: false,
        Extra: {
          Instructions: "Please process returns to asyad wh",
        },
      },
      Consignee: {
        Name: user.firstname + " " + user.lastname,
        MobileNo: user.phoneNumber,
        PhoneNo: user.phoneNumber,
        Email: user.email,
        What3Words: "",
        NationalId: "N/A",
        ReferenceNo: "N/A",
        CompanyName: "",
        AddressLine1: user.address,
        AddressLine2: "",
        Area: order.shipping.area,
        City: order.shipping.city,
        Region: order.shipping.region,
        Country: order.shipping.country,
        ZipCode: order.shipping.zipcode,
        Latitude: order.shipping.latitude,
        Longitude: order.shipping.longitude,
        Instruction: order.otherDetails,
        Vattaxcode: "",
        Eorinumber: "",
      },
      items: order.items,
    },
  };

  let response: Promise<ITrackingOrderData> = axios
    .request(options)
    .then(function (response) {
      let result: ITrackingOrderData = {
        success: true,
        data: {
          order_number: response.data.data.order_number,
          order_awb_number: response.data.data.order_awb_number
        }
      };
      return result;
    })
    .catch(function (error) {
      let result: ITrackingOrderData = {
        success: false,
      };
      return result;
    });

  return response;
};

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders: IOrder[] = await Order.find({});

    return successResponse("Orders", orders, res);
  } catch (error) {
    return serverErrorResponse(error, res);
  }
};
