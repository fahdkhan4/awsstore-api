import Joi from "joi";
import { celebrate, Segments } from "celebrate";

export const addProductCategoryValidatorMiddleware = celebrate({
  [Segments.BODY]: Joi.object({
    name: Joi.string().required(),
    description: Joi.string().allow(""),
    tags: Joi.array().items(Joi.string()).required(),
    status: Joi.string().valid("publish", "draft", "deleted").required(),
  }),
});
