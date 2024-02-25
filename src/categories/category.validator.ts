import Joi from "joi";
import { celebrate, Segments } from "celebrate";

export const addProductCategoryValidatorMiddleware = celebrate({
  [Segments.BODY]: Joi.object({
    name: Joi.string().required(),
    adminId: Joi.string().required(),
    description: Joi.string().allow(""),
    tags: Joi.array().items(Joi.string()).required(),
    status: Joi.string().valid("publish", "draft", "deleted").required(),
  }),
});

export const updateProductCategoryValidatorMiddleware = celebrate({
  [Segments.BODY]: Joi.object({
    name: Joi.string(),
    description: Joi.string().allow(""),
    tags: Joi.array().items(Joi.string()),
    status: Joi.string().valid("publish", "draft", "deleted"),
  }),
});

export const getPaginatedProductCategoriesMiddleware = celebrate({
  [Segments.QUERY]: Joi.object().keys({
    pageNumber: Joi.number(),
    size: Joi.number(),
    name: Joi.string(),
    tags: Joi.string(),
    status: Joi.string().valid("publish", "draft", "deleted"),
    lastObjectId: Joi.string(),
  }),
});
