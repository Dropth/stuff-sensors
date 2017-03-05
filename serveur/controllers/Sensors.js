'use strict';

var url = require('url');

var Sensors = require('./SensorsService');

module.exports.sensorsGET = function sensorsGET (req, res, next) {
  Sensors.sensorsGET(req.swagger.params, res, next);
};

module.exports.sensorsPOST = function sensorsPOST (req, res, next) {
  Sensors.sensorsPOST(req.swagger.params, res, next);
};
