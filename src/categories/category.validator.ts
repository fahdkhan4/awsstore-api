import Joi from "joi";
import { celebrate, Segments } from "celebrate";

export const categoryValidatorMiddleware = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    tags: Joi.array().items(Joi.string()),
  }),
});
