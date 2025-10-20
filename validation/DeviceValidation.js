const Joi = require('joi');
const { model } = require('mongoose');
const schema= Joi.object({
    ipAddress: Joi.string().ip({ version: ['ipv4', 'ipv6'] }).required(),
    deviceType: Joi.string().required(),
    visitorId: Joi.string().required(),
    lastActive: Joi.date().required(),
    location: Joi.object({
        type: Joi.string().valid('Point').required(),
        coordinates: Joi.array().items(Joi.number()).length(2).required()
    }).required()
});

model.exports = function validateDevice(data) {
    return schema.validate(data);
}