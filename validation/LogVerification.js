const Joi = require('joi');
const { model } = require('mongoose');
const schema= Joi.object({
    reportId: Joi.string().hex().length(24).required(),
    verifyingDevice: Joi.string().hex().length(24).required(),
    verificationType: Joi.string().valid('approve', 'reject').required(),
    timestamp: Joi.date(),
    ipAddress: Joi.string().ip({ version: ['ipv4', 'ipv6'] }).required()
});

model.exports = function validateLog(data) {
    return schema.validate(data);
}