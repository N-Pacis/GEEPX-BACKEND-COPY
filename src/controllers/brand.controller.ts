import { ICategory } from './../types/category';
import { IBrand } from "./../types/brand";
import { Request, Response } from "express";
import Brand from "../models/brand.model";
import {
  errorResponse,
  notFoundResponse,
  serverErrorResponse,
  successResponse,
} from "../util/api.response";
import { uploadFile } from "../util/firebase.config";
import Product from "../models/products.model";
import { IProduct } from "../types/product";
import mongoose from "mongoose";
import Category from "../models/category.model";


export const getSomeBrands = async (req: Request, res: Response) => {
  const limit = 5;
  try {
    let page = Number(req.query.page);
    if (page > 0) {
      const brands: IBrand[] = await Brand.find(
        {},
        { coverPhoto: 1, name: 1, logo: 1 }
      )
        .skip(limit * (page - 1))
        .limit(limit);
      return successResponse("Brands got successfully", brands, res);
    } else {
      return serverErrorResponse("Enter a valid page number", res);
    }
  } catch (error) {
    return serverErrorResponse(error, res);
  }
};
export const getProductsByBrandAndCategory = async (
  req: Request,
  res: Response
) => {
  try {
    const {categoryId } = req.query;
    let page = Number(req.query.page);
    let limit = 10;
    if (!categoryId) {
      return serverErrorResponse("Enter your category id", res);
    }
    let category:ICategory|null = await Category.findById(categoryId);
    if (!category)
      return notFoundResponse("id", req.params.id, "Category", res);
      
    if (page > 0) {
      // convert id to object id mongo db

      const products: IProduct[] = await Product.aggregate([
        {
          $match: {
            category: new mongoose.Types.ObjectId(categoryId as string),
            coverPhoto: { $exists: true, $ne: null },
          },
        },
        {
          $skip: limit * (page - 1),
        },
        {
          $limit: limit,
        },
        {
          $project: {
            name: 1,
            coverPhoto: 1,
            price: 1,
            discount: 1,
          },
        },
        // check if the user has added it to favorites then return addedToFavorites
      ]);

      return successResponse(
        "Products by brand and category got successfully",
        products,
        res
      );
    } else {
      return serverErrorResponse("Enter a valid page number", res);
    }
  } catch (error) {
    return serverErrorResponse(error, res);
  }
};

export const getCategoriesByBrand = async (req: Request, res: Response) => {
  try {
    const brandCategories = await Brand.findById(req.query.id, {
      categories: 1,
      _id: 0,
    }).populate("categories", "name");
    return successResponse(
      "Categories by brand got successfully",
      brandCategories?.categories !== undefined
        ? brandCategories.categories
        : [],
      res
    );
  } catch (error) {
    return serverErrorResponse(error, res);
  }
};

export const getProductsByBrand = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    let page = Number(req.query.page);
    let limit = 5;
    if (!id) {
      return serverErrorResponse("Enter your product id", res);
    }
    if (page > 0) {
      // convert id to object id mongo db

      const products: IProduct[] = await Product.aggregate([
        {
          $match: {
            brand: new mongoose.Types.ObjectId(id as string),
            status: "Active",
            coverPhoto: { $exists: true, $ne: null },
          },
        },
        {
          $skip: limit * (page - 1),
        },
        {
          $limit: limit,
        },
        {
          $project: {
            name: 1,
            coverPhoto: 1,
            price: 1,
            discount: 1,
          },
        },
        // check if the user has added it to favorites then return addedToFavorites
      ]);
      return successResponse(
        "Products by brand got successfully",
        products,
        res
      );
    } else {
      return serverErrorResponse("Enter a valid page number", res);
    }
  } catch (error) {
    serverErrorResponse(error, res);
  }
};

export const getBrands = async (req: Request, res: Response) => {
  try {
    let brands = await Brand.find({});
    return successResponse("Brands", brands, res);
  } catch (ex) {
    return serverErrorResponse(ex, res);
  }
};

export const getBrandById = async (req: Request, res: Response) => {
  try {
    let brand = await Brand.findById(req.params.id);
    if (!brand) return notFoundResponse("id", req.params.id, "Brand", res);

    return successResponse("Brand", brand, res);
  } catch (ex) {
    return serverErrorResponse(ex, res);
  }
};

export const saveBrand = async (req: Request, res: Response) => {
  try {
    const body = req.body as IBrand;
    const brand: IBrand = new Brand({
      name: body.name,
      description: body.description,
      countryOrigin: body.countryOrigin,
      categories: body.categories,
    });

    let result = await brand.save();
    return successResponse("Saved Brand", result, res);
  } catch (ex) {
    return serverErrorResponse(ex, res);
  }
};

export const updateBrand = async (req: Request, res: Response) => {
  try {
    const body = req.body as IBrand;

    const brand: IBrand | null = await Brand.findByIdAndUpdate(
      req.params.id,
      {
        name: body.name,
        description: body.description,
        countryOrigin: body.countryOrigin,
      },
      { new: true }
    );
    if (!brand) return notFoundResponse("id", req.params.id, "Brand", res);

    return successResponse("Updated Brand", brand, res);
  } catch (ex) {
    return serverErrorResponse(ex, res);
  }
};

export const activateBrand = async (req: Request, res: Response) => {
  try {
    const brand: IBrand | null = await Brand.findByIdAndUpdate(
      req.params.id,
      {
        status: "Active",
      },
      { new: true }
    );
    if (!brand) return notFoundResponse("id", req.params.id, "Brand", res);

    return successResponse("Updated Brand", brand, res);
  } catch (ex) {
    return serverErrorResponse(ex, res);
  }
};

export const deactivateBrand = async (req: Request, res: Response) => {
  try {
    const brand: IBrand | null = await Brand.findByIdAndUpdate(
      req.params.id,
      {
        status: "Deactivated",
      },
      { new: true }
    );
    if (!brand) return notFoundResponse("id", req.params.id, "Brand", res);
    await Product.findOneAndUpdate(
      { brand: req.params.id },
      { status: "Deactivated" }
    );
    return successResponse("Updated Brand", brand, res);
  } catch (ex) {
    return serverErrorResponse(ex, res);
  }
};

export const addBrandCoverPhoto = async (req: Request, res: Response) => {
  try {
    if (req.file) {
      const coverPhoto = await uploadFile(req.file);
      const brand: IBrand | null = await Brand.findByIdAndUpdate(
        req.params.id,
        {
          coverPhoto,
        },
        { new: true }
      );
      if (!brand) return notFoundResponse("id", req.params.id, "Brand", res);
      return successResponse("Added Brand Cover photo", brand, res);
    } else {
      return errorResponse("Please provide brand cover photo please!", res);
    }
  } catch (ex) {
    return serverErrorResponse(ex, res);
  }
};

export const addBrandLogo = async (req: Request, res: Response) => {
  try {
    if (req.file) {
      const coverPhoto = await uploadFile(req.file);

      const brand: IBrand | null = await Brand.findByIdAndUpdate(
        req.params.id,
        {
          logo: coverPhoto,
        },
        { new: true }
      );
      if (!brand) return notFoundResponse("id", req.params.id, "Brand", res);
      return successResponse("Added Brand Logo", brand, res);
    } else {
      return errorResponse("Please provide a file!", res);
    }
  } catch (ex) {
    return serverErrorResponse(ex, res);
  }
};
