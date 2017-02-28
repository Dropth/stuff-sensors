/**
 * Created by dropy on 2/23/17.
 */
import axios from 'axios';

function fetch(request, callback) {
    axios.get(request)
        .then(response => {

            console.log("JYCROISAMORT                 _____________ : " + JSON.stringify(response.data))
            var millisecondsToWait = 3000;
            setTimeout(function() {
                callback(response.data);
            }, millisecondsToWait);
        });
}

export function getSensorsMeasures(sensorid, dateMin, dateMax, callback) {

    const request = `/v1/sensors?idSensor=${sensorid}&dateMin=${dateMin}&dateMax=${dateMax}`;
    fetch(request, callback);
}

export function updateSensor(sensorid,name,local, callback) {

    var millisecondsToWait = 3000;
    setTimeout(function() {
    }, millisecondsToWait);

    const request = `/v1/senso?id=${sensorid}&nom=${name}&local=${local}`;
    fetch(request, callback);
}