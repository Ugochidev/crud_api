import Joi from "joi";

const validateSignUP = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  phone_number: Joi.string().min(10).max(15).required(),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  password: Joi.string().min(8).required(),
});

const validateSignIn = Joi.object({
  email: Joi.string().email(),
  password: Joi.string().min(8).required(),
});

export default { validateSignUP, validateSignIn };
