const deviceValidator = require('./DeviceValidation');
const reportValidator = require('./ReportValidation');
const hazardValidator = require('./HazardValidation');
const logValidator = require('./LogVerification');

module.exports = {
    validateDevice: deviceValidator,     
    validateReport: reportValidator,
    validateHazard: hazardValidator,
    validateLog: logValidator
};