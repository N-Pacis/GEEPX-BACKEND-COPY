import { errorResponse, notFoundResponse } from "../util/api.response";
import { Response, Request } from "express";
import Product from "../models/products.model";
import { serverErrorResponse, successResponse } from "../util/api.response";
import { IProduct } from "../types/product";
import { uploadFile } from "../util/firebase.config";

export const addProduct = async (req: Request, res: Response) => {
  try {
    const body: IProduct = req.body as IProduct;

    let product: IProduct = await Product.create(body);

    return successResponse("Product", product, res);
  } catch (error) {
    return serverErrorResponse(error, res);
  }
};

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products: IProduct[] = await Product.find({ status: "Active" });
    return successResponse("Products", products, res);
  } catch (error) {
    return serverErrorResponse(error, res);
  }
};

export const searchProducts = async (req: Request, res: Response) => {
  const { search } = req.query;
  try {
    // we are going to suggesst him some texts from country, product name, brand name, category name, description, store
    const suggestions = await Product.aggregate([
      {
        $limit: 10,
      },
      {
        $project: {
          name: 1,
          origin: 1,
          store: 1,
          description: 1,
          brand: 1,
          category: 1,
          status: 1,
        },
      },
      {
        $lookup: {
          from: "brands",
          localField: "brand",
          foreignField: "_id",
          as: "brand",
          pipeline: [
            {
              $project: {
                name: 1,
                _id: 0,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
          pipeline: [
            {
              $project: {
                name: 1,
                _id: 0,
              },
            },
          ],
        },
      },
      {
        $unwind: `$brand`,
      },
      {
        $unwind: `$category`,
      },
      {
        $match: {
          $and: [
            {
              status: "Active",
              $or: [
                {
                  name: {
                    $regex: `^.*${search}.*$`,
                    $options: "x",
                  },
                },
                {
                  origin: {
                    $regex: `^.*${search}.*$`,
                    $options: "x",
                  },
                },
                {
                  store: {
                    $regex: `^.*${search}.*$`,
                    $options: "x",
                  },
                },
                {
                  description: {
                    $regex: `^.*${search}.*$`,
                    $options: "x",
                  },
                },
                {
                  "brand.name": {
                    $regex: `^.*${search}.*$`,
                    $options: "x",
                  },
                },
                {
                  "category.name": {
                    $regex: `^.*${search}.*$`,
                    $options: "x",
                  },
                },
              ],
            },
          ],
        },
      },
      {
        $project: {
          status: 0,
        },
      },
    ]);
    return successResponse("Suggesstions got successfully", suggestions, res);
  } catch (error) {
    return serverErrorResponse(error, res);
  }
};

export const getSomeProducts = async (req: Request, res: Response) => {
  try {
    let page = Number(req.query.page);
    let limit = 5;
    if (page > 0) {
      const someProducts: IProduct[] = await Product.aggregate([
        {
          $match: {
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
            brand: 1,
          },
        },
        {
          $lookup: {
            from: "brands",
            localField: "brand",
            foreignField: "_id",
            as: "brand",
            pipeline: [
              {
                $project: {
                  logo: 1,
                  name: 1,
                },
              },
            ],
          },
        },
        {
          $unwind: `$brand`,
        },
        // {
        //   $project: {
        //     name: 1,
        //     coverPhoto: 1,
        //     brand: 1,
        //   },
        // },
      ]);
      return successResponse(
        "Some Products got successfully",
        someProducts,
        res
      );
    } else {
      return serverErrorResponse("Enter a valid page number", res);
    }
  } catch (error) {
    return serverErrorResponse(error, res);
  }
};

export const addDiscountToProduct = async (req: Request, res: Response) => {
  try {
    const { discount, productId } = req.query;
    let updateProduct = await Product.findByIdAndUpdate(productId, {
      discount,
    });
    return successResponse("Discount added successfully", updateProduct, res);
  } catch (error) {
    return serverErrorResponse(error, res);
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    let product: IProduct | null = await Product.findById(
      req.params.id
    ).populate("brand", "name logo");
    if (!product) return notFoundResponse("id", req.params.id, "Product", res);
    return successResponse("Product", product, res);
  } catch (ex) {
    return serverErrorResponse(ex, res);
  }
};

export const editProductDetails = async (req: Request, res: Response) => {
  try {
    const body: IProduct = req.body as IProduct;

    let product: IProduct | null = await Product.findByIdAndUpdate(
      req.params.id,
      body,
      { new: true }
    );
    if (!product) return notFoundResponse("id", req.params.id, "Product", res);
    return successResponse("Updated product", product, res);
  } catch (error) {
    return serverErrorResponse(error, res);
  }
};

export const activateProduct = async (req: Request, res: Response) => {
  try {
    const product: IProduct | null = await Product.findByIdAndUpdate(
      req.params.id,
      {
        status: "Active",
      },
      { new: true }
    );
    if (!product) return notFoundResponse("id", req.params.id, "Product", res);

    return successResponse("Updated Product", product, res);
  } catch (ex) {
    return serverErrorResponse(ex, res);
  }
};

export const deactivateProduct = async (req: Request, res: Response) => {
  try {
    const product: IProduct | null = await Product.findByIdAndUpdate(
      req.params.id,
      {
        status: "Deactivated",
      },
      { new: true }
    );
    if (!product) return notFoundResponse("id", req.params.id, "Product", res);

    return successResponse("Updated Product", product, res);
  } catch (ex) {
    return serverErrorResponse(ex, res);
  }
};

export const addProductCoverPhoto = async (req: Request, res: Response) => {
  try {
    if (req.file) {
      const coverPhoto = await uploadFile(req.file);

      const product: IProduct | null = await Product.findByIdAndUpdate(
        req.params.id,
        {
          coverPhoto: coverPhoto,
          status: "Active",
        },
        { new: true }
      );
      if (!product)
        return notFoundResponse("id", req.params.id, "Product", res);
      return successResponse("Added Product Cover Photo", product, res);
    } else {
      return errorResponse("Please provide a file!", res);
    }
  } catch (ex) {
    return serverErrorResponse(ex, res);
  }
};
