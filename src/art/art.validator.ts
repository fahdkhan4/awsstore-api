import Joi from "joi";
import { celebrate, Segments } from "celebrate";

export const createArtValidatorMiddleware = celebrate({
  [Segments.BODY]: Joi.object().keys({
    title: Joi.string().required(),
    authorId: Joi.string().required(),
    categoryId: Joi.string().required(),
    description: Joi.string().required(),
    artAmount: Joi.object()
      .keys({
        price: Joi.number().required(),
        currency: Joi.string().required(),
      })
      .required(),
    artImage: Joi.array().items(Joi.string()).required(),
    status: Joi.string().valid("draft", "review", "published", "rejected"),
  }),
});

export const updateArtValidatorMiddleware = celebrate({
  [Segments.BODY]: Joi.object().keys({
    title: Joi.string(),
    authorId: Joi.string(),
    categoryId: Joi.string(),
    description: Joi.string(),
    artAmount: Joi.object().keys({
      price: Joi.number(),
      currency: Joi.string(),
    }),
    artImage: Joi.array().items(Joi.string()),
    status: Joi.string().valid("draft", "review", "published", "rejected"),
    review: Joi.number(),
  }),
});

export const getArtsMiddleware = celebrate({
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
      artAmount: Joi.object().keys({
        price: Joi.number(),
        currency: Joi.string(),
      }),
      artImage: Joi.array().items(Joi.string()),
      status: Joi.string().valid("draft", "review", "published", "rejected"),
      review: Joi.number(),
    }).unknown(true),
  }),
});

export const deleteArtMiddleware = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().required(),
  }),
});
