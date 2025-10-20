const Joi = require('joi');
const { model } = require('mongoose');
const schema= Joi.object({
    geometry: Joi.object({
        type: Joi.string().valid('Point').required(),
        coordinates: Joi.array().items(Joi.number()).length(2).required()
    }).required(),
    colorCode: Joi.string().required(),
    relatedReports: Joi.array().items(Joi.string().hex().length(24).required()),
    updatedAt: Joi.date()
});

model.exports = function validateHazard(data) {
    return schema.validate(data);
}