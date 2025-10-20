const { Device, Hazard, Log, Report } = require('../models');
const validator = require('../validation');

const addHazard = ((req, res, next) => {
res.send("<h1>welcome to add hazard</h1>");
});

const documentHazard = ((req, res, next) => {
res.send("<h1>welcome to document hazard</h1>");

});

const reportHazard = ((req, res, next) => {
res.send("<h1>welcome to report hazard</h1>");

});

const endHazard = ((req, res, next) => {
res.send("<h1>welcome to end hazard</h1>");

});


module.exports = {
    addHazard,
    documentHazard,
    reportHazard,
    endHazard
}