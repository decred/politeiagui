import * as Joi from "@hapi/joi";

const commentValidationSchema = Joi.object({
  comment: Joi.string().required()
});

export default commentValidationSchema;
