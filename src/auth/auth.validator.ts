import Joi from "joi";
import { celebrate, Segments } from "celebrate";

export const loginValidatorMiddleware = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
});

export const registerValidatorMiddleware = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
    fullName: Joi.string().required(),
    username: Joi.string().required(),
    role: Joi.string().default("user"),
    accountType: Joi.string().required(),
  }),
});

export const tokenUserValidatorMiddleware = celebrate({
  [Segments.BODY]: Joi.object().keys({
    accessToken: Joi.string().required(),
    refreshToken: Joi.string().required(),
  }),
});
