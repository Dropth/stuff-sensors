'use strict';
var mongoose = require('mongoose');

exports.sensorsGET = function(args, res, next) {
  /**
   * Product Types
   * permet de voir l'intervalle de temps des sensors 
   *
   * idSensor String idSensor
   * dateMin date date Intervalle
   * dateMax date date Intervalle
   * returns List
   **/

    // schéma pour faire des requêtes via mongoose sur notre type de donnée "measure"
    try{
        var measureSchema  = mongoose.Schema(
            {
                sensor_id: String,
                date: Date,
                value: String
            },{collection:'measures'}
        );
        var measure = mongoose.model('measure',measureSchema);
    }catch(e){
        var measure = mongoose.model('measure');
    }

  measure
      .find()
      .where('date').lt(args.dateMax.value).gt(args.dateMin.value)
      .where('sensor_id').equals(args.idSensor.value)
      .exec(function (err, measures) {
      if (err) console.log("QueryError");
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(measures || {}));
  });
}

exports.sensorsPOST = function(args, res, next) {
  /**
   * Sensor Types
   * C'est un senseur mamène 
   *
   * id String Id du sensor
   * nom String nom du sensor
   * local String localisation du sensor
   * returns List
   **/

  /*var examples = {};
  examples['application/json'] = [ {
  "date" : "2000-01-23",
  "SensorId" : "aeiou",
  "value" : 123
} ];

  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end("Allow");
  }*/

try{
        var sensorSchema  = mongoose.Schema(
            {
                _id: String,
		updatedAt: String,
		createdAt: String,
                type: String,
		__v: Number,
            },{collection:'sensors'}
        );
        var sensor = mongoose.model('sensor',sensorSchema);
    }catch(e){
        var sensor = mongoose.model('sensor');
    }

 /*sensor
      .find()
      .where('_id').equals(args.id.value)
      .exec(function (err, sensors) {
      if (err) console.log("QueryError");
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(sensors || {}));
  });*/

/*sensor.findOneAndUpdate({ _id: args.id.value }, { name:args.nom.value }, {}, function(err, doc){
    if (err) return res.end(500, { error: err });
    return res.end("succesfully saved");
});*/

sensor.collection.update({"_id":args.id.value}, {$set : {"name":args.nom.value, "location":args.local.value}}, {}, function (err, users) {

 sensor
      .find()
      .where('_id').equals(args.id.value)
      .exec(function (err, sensors) {
      if (err) console.log("QueryError");
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(sensors || {}));
  });
});



//res.end("Denver le dernier tamer aaa Izi " + args.id.value + " mais aussi " + args.nom.value + " et pour finir " + args.local.value);

/*.exec(function (err, sensor) {
      if (err) console.log("QueryError");
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(sensor || {}));
	
  });*/
}

