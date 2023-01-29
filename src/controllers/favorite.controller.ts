import { IFavorite } from './../types/favorite';
import { IProduct } from "./../types/product";
import { serverErrorResponse, notFoundResponse } from "./../util/api.response";
import { Response, Request } from "express";
import { successResponse } from "../util/api.response";
import Product from "../models/products.model";
import Favorite from '../models/favorite.model';

export async function getFavorites(req: any, res: Response) {
  try {
    let favorites: IFavorite[] = await Favorite.find({
      addedBy: req.user._id
    });

    return successResponse("Favorites", favorites, res);
  } catch (ex) {
    return serverErrorResponse(ex, res);
  }
}

export async function addToFavorites(req: any, res: Response) {
  try {
    let body = req.body as IFavorite;

    let product: IProduct | null = await Product.findById(body.productId);
    if (!product) return notFoundResponse("id", req.params.id, "Product", res);
    
    let favoriteExists: IFavorite | null = await Favorite.findOne({productId: body.productId,addedBy: req.user._id});
    let favorite: IFavorite = new Favorite();
    if(!favoriteExists){
      favorite.productId = body.productId;
      favorite.addedBy = req.user._id;
  
      await favorite.save();
    }

    return successResponse("Favorite added", favorite, res);
  } catch (ex) {
    return serverErrorResponse(ex, res);
  }
}


export async function removeFromFavorites(req: Request, res: Response) {
  try {
    let favorite: IFavorite | null = await Favorite.findByIdAndRemove(req.params.id);
    if (!favorite) return notFoundResponse("id", req.params.id, "Favorite", res);

    return successResponse("Favolite removed", {}, res);
  } catch (ex) {
    return serverErrorResponse(ex, res);
  }
}
