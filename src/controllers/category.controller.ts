import { ICategory } from "./../types/category";
import { Request, Response } from "express";
import {
  notFoundResponse,
  serverErrorResponse,
  successResponse,
} from "../util/api.response";
import Category from "../models/category.model";
import brandModel from "../models/brand.model";
import Product from "../models/products.model";

export const getCategories = async (req: Request, res: Response) => {
  try {
    let categories = await Category.find({});
    return successResponse("Categories", categories, res);
  } catch (ex) {
    return serverErrorResponse(ex, res);
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    let category = await Category.findById(req.params.id);
    if (!category)
      return notFoundResponse("id", req.params.id, "Category", res);

    return successResponse("Category", category, res);
  } catch (ex) {
    return serverErrorResponse(ex, res);
  }
};

export const saveCategory = async (req: Request, res: Response) => {
  try {
    const body = req.body as ICategory;

    const category: ICategory = new Category({
      name: body.name,
      description: body.description,
    });

    let result = await category.save();
    return successResponse("Saved Category", result, res);
  } catch (ex) {
    return serverErrorResponse(ex, res);
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const body = req.body as ICategory;

    const category: ICategory | null = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name: body.name,
        description: body.description,
      },
      { new: true }
    );
    if (!category)
      return notFoundResponse("id", req.params.id, "Category", res);

    return successResponse("Updated Category", category, res);
  } catch (ex) {
    return serverErrorResponse(ex, res);
  }
};

export const activateCategory = async (req: Request, res: Response) => {
  try {
    const category: ICategory | null = await Category.findByIdAndUpdate(
      req.params.id,
      {
        status: "Active",
      },
      { new: true }
    );
    if (!category)
      return notFoundResponse("id", req.params.id, "Category", res);

    return successResponse("Updated Category", category, res);
  } catch (ex) {
    return serverErrorResponse(ex, res);
  }
};

export const deactivateCategory = async (req: Request, res: Response) => {
  try {
    const category: ICategory | null = await Category.findByIdAndUpdate(
      req.params.id,
      {
        status: "Deactivated",
      },
      { new: true }
    );
    if (!category)
      return notFoundResponse("id", req.params.id, "Category", res);
    await brandModel.updateMany(
      // where category include the id
      { categories: { $in: [req.params.id] } },
      // pull that category from the array
      { $pull: { categories: req.params.id } }
    );
    await Product.updateMany(
      { category: req.params.id },
      { status: "Deactivated" }
    );
    return successResponse("Updated Category", category, res);
  } catch (ex) {
    return serverErrorResponse(ex, res);
  }
};
