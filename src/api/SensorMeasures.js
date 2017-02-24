/**
 * Created by dropy on 2/23/17.
 */
import axios from 'axios';

function fetch(request, callback) {
    axios.get(request)
        .then(response => {

            console.log("JYCROISAMORT                 _____________ : " + response.data)
            callback(response.data);
        });
}

export function getSensorsMeasures(sensorid, dateMin, dateMax, callback) {
    const request = `/v1/sensors?idSensor=${sensorid}&dateMin=${dateMin}&dateMax=${dateMax}`;
    fetch(request, callback);
}