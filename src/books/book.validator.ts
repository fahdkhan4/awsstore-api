import Joi from "joi";
import { celebrate, Segments } from "celebrate";

export const createBookValidatorMiddleware = celebrate({
  [Segments.BODY]: Joi.object().keys({
    title: Joi.string().required(),
    authorId: Joi.string().required(),
    categoryId: Joi.string().required(),
    description: Joi.string().required(),
    bookAmount: Joi.object()
      .keys({
        price: Joi.number().required(),
        currency: Joi.string().required(),
      })
      .required(),
    bookFormate: Joi.string().optional(),
    bookFileUrl: Joi.string().required(),
    bookImageCoverUrl: Joi.string().required(),
    pagesCount: Joi.number().optional(),
    language: Joi.string().required(),
    publishYear: Joi.number().required(),
    status: Joi.string().valid("draft", "review", "published", "rejected"),
    isPublished: Joi.boolean().optional(),
    review: Joi.number().optional(),
  }),
});

export const updateBookValidatorMiddleware = celebrate({
  [Segments.BODY]: Joi.object().keys({
    authorId: Joi.string(),
    categoryId: Joi.string(),
    title: Joi.string(),
    description: Joi.string(),
    bookAmount: Joi.object().keys({
      currency: Joi.string(),
      price: Joi.number(),
    }),
    bookFormate: Joi.string(),
    bookFileUrl: Joi.string(),
    bookImageCoverUrl: Joi.string(),
    pagesCount: Joi.number(),
    language: Joi.string(),
    publishYear: Joi.number(),
    status: Joi.string().valid("draft", "review", "published", "rejected"),
    isPublished: Joi.boolean(),
    review: Joi.number(),
  }),
});

export const getBooksMiddleware = celebrate({
  [Segments.QUERY]: Joi.object().keys({
    page: Joi.number(),
    limit: Joi.number(),
    query: Joi.object({
      _id: Joi.string(),
      id: Joi.string(),
      title: Joi.string(),
      authorId: Joi.string(),
      categoryId: Joi.string(),
      description: Joi.string(),
      bookAmount: Joi.object().keys({
        price: Joi.number(),
        currency: Joi.string(),
      }),
      bookFormate: Joi.string(),
      bookFileUrl: Joi.string(),
      bookImageCoverUrl: Joi.string(),
      pagesCount: Joi.number(),
      language: Joi.string(),
      publishYear: Joi.number(),
      status: Joi.string().valid("draft", "review", "published", "rejected"),
      isPublished: Joi.boolean(),
      review: Joi.number(),
    }).unknown(true),
  }),
});
