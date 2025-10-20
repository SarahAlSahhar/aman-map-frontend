const Joi = require("joi");
const { model } = require("mongoose");
const schema = Joi.object({
  dangerType: Joi.string()
    .required()
    .valid("evacuation", "incursion", "fire_control", "hard_to_reach"),
  coordinates: Joi.object({
    type: Joi.string().valid("Point").required(),
    coordinates: Joi.array().items(Joi.number()).length(2).required(),
  }).required(),
  reportedByDevice: Joi.string().hex().length(24).required(),
  status: Joi.string().valid("pending", "verified", "rejected"),
  confirmations: Joi.array().items(
    Joi.object({
      deviceId: Joi.string().hex().length(24).required(),
      reportType: Joi.string().valid("document", "report", "end").required(),
    })
  ),
  createdAt: Joi.date(),
});

model.exports = function validateReport(data) {
  return schema.validate(data);
};
