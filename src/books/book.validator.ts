import Joi from "joi";
import { celebrate, Segments } from "celebrate";

export const createBookValidatorMiddleware = celebrate({
  [Segments.BODY]: Joi.object().keys({
    authorId: Joi.string().required(),
    genreId: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
    // bookPrice: Joi.object().keys({
    //   currency: Joi.string().required(),
    //   amount: Joi.number().required(),
    // }),
    bookSource: Joi.optional(),
    bookImageCover: Joi.optional(),
    pagesCount: Joi.number().required(),
    language: Joi.string().required(),
    publishYear: Joi.number().required(),
    isPublic: Joi.boolean().optional(),
    status: Joi.string().valid("draft", "review", "published", "rejected"),
    isPublished: Joi.boolean().optional(),
    isDeleted: Joi.boolean().optional(),
    review: Joi.number().optional(),
  }),
});

export const updateBookValidatorMiddleware = celebrate({
  [Segments.BODY]: Joi.object().keys({
    authorId: Joi.string(),
    genreId: Joi.string(),
    bookId: Joi.string(),
    title: Joi.string(),
    description: Joi.string(),
    bookPrice: Joi.object().keys({
      currency: Joi.string(),
      amount: Joi.number(),
    }),
    pagesCount: Joi.number(),
    language: Joi.string(),
    publishYear: Joi.number(),
    isPublic: Joi.boolean(),
    status: Joi.string().valid("draft", "review", "published", "rejected"),
    isPublished: Joi.boolean(),
    isDeleted: Joi.boolean(),
    review: Joi.number(),
  }),
});

export const getPaginatedBooksMiddleware = celebrate({
  [Segments.QUERY]: Joi.object().keys({
    pageNumber: Joi.number(),
    size: Joi.number(),
    status: Joi.string().valid("draft", "review", "published", "rejected"),
    lastObjectId: Joi.string(),
  }),
});
