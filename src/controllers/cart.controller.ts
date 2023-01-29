import { IProduct } from "./../types/product";
import {
  serverErrorResponse,
  notFoundResponse,
  errorResponse,
} from "./../util/api.response";
import { ICart } from "./../types/cart";
import { Response, Request } from "express";
import Cart from "../models/cart.model";
import { successResponse } from "../util/api.response";
import Product from "../models/products.model";

export async function getCart(req: any, res: Response) {
  try {
    let cart: ICart[] = await Cart.find({
      addedBy: req.user._id,
      checkedOut: false,
    }).populate("productId", "name price coverPhoto description");

    let totalPrice: number = 0;
    for (var i = 0; i < cart.length; i++) {
      totalPrice += cart[i].price;
    }

    let resultObj: object = {
      items: cart,
      totalPrice: totalPrice,
    };
    return successResponse("Cart", resultObj, res);
  } catch (ex) {
    return serverErrorResponse(ex, res);
  }
}

export async function addToCart(req: any, res: Response) {
  try {
    let body = req.body as ICart;
    let product: IProduct | null = await Product.findOne({
      _id: body.productId,
      status: "Active",
    });
    if (!product) return notFoundResponse("id", req.params.id, "Product", res);
    let alreadyAdded = await Cart.findOne({
      productId: body.productId,
      addedBy: req.user._id,
    });
    if (alreadyAdded) {
      return errorResponse("You have already added to cart", res);
    }
    let cart: ICart = new Cart();
    cart.productId = body.productId;
    cart.quantity = body.quantity;
    cart.price = product.price * body.quantity;
    cart.addedBy = req.user._id;
    await cart.save();
    return successResponse("Cart saved", cart, res);
  } catch (ex) {
    console.log(ex);
    return serverErrorResponse(ex, res);
  }
}

export async function updateCart(req: Request, res: Response) {
  try {
    let cart: ICart | null = await Cart.findById(req.params.id);
    if (!cart) return notFoundResponse("id", req.params.id, "Cart", res);

    let initialPrice: number = cart.price / cart.quantity;
    cart.quantity = req.body.quantity;
    cart.price = initialPrice * cart.quantity;
    await cart.save();
    return successResponse("Cart updated", cart, res);
  } catch (ex) {
    return serverErrorResponse(ex, res);
  }
}

export async function deleteCart(req: Request, res: Response) {
  try {
    let cart: ICart | null = await Cart.findByIdAndRemove(req.params.id);
    if (!cart) return notFoundResponse("id", req.params.id, "Cart", res);

    return successResponse("Cart deleted", {}, res);
  } catch (ex) {
    return serverErrorResponse(ex, res);
  }
}
