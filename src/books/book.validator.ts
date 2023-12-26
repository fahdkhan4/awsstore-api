import Joi from "joi";
import { celebrate, Segments } from "celebrate";

export const createBookValidatorMiddleware = celebrate({
  [Segments.BODY]: Joi.object().keys({
    authorId: Joi.string().required(),
    genreId: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
    bookPrice: Joi.object().keys({
      currency: Joi.string().required(),
      amount: Joi.number().required(),
    }),
    pagesCount: Joi.number().required(),
    language: Joi.string().required(),
    publishYear: Joi.number().required(),
    isPublic: Joi.boolean().optional(),
    status: Joi.string()
      .valid("draft", "review", "published", "deleted")
      .optional(),
    isPublished: Joi.boolean().optional(),
    isDeleted: Joi.boolean().optional(),
    review: Joi.number().optional(),
  }),
});
