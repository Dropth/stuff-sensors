/**
 * Created by dropy on 2/23/17.
 */
import axios from 'axios';

function fetch(request, callback) {
    axios.get(request)
        .then(response => {
            callback(response.data);
        });
}

export function getSensorsMeasures(sensorid, dateMin, dateMax, callback) {

    const request = `/v1/sensors?idSensor=${sensorid}&dateMin=${dateMin}&dateMax=${dateMax}`;
    fetch(request, callback);
}

export function updateSensor(sensorid,name,local, callback) {

    const request = `/v1/senso?id=${sensorid}&nom=${name}&local=${local}`;
    fetch(request, callback);
}