/**
 * Created by dropy on 2/23/17.
 */
import React from 'react'
import { connect } from 'react-redux'

import Value from '../types/Value'
import SensorType from '../types/SensorType'
import * as smApi from '../api/SensorMeasures'

//import d3 from '../d3'

import './Sensor.css'

let valnul = "";

const Sensor = ({id, name, type, data, noSensor}) =>  {

    const unit = (type) => {
        const units = {}
        units[SensorType.TEMPERATURE] = "°C"
        units[SensorType.PERCENT] = "%"
        return units[type] || ""
    }
    const value  = (v, t) => {

        /*if(t == SensorType.ON_OFF)
         valnul ="onoff";
         else
         valnul="";*/

        if(v instanceof Value ){
            return v.toString()
        }

        switch(t){
            case SensorType.PERCENT: return (v*100).toFixed(2);
            case SensorType.TEMPERATURE: return (v*1).toFixed(1);
            default : return v;
        }
    }
    const values = data.map(((datum,index) => (<tr key={index}><td>{value(datum, type)+" "+unit(type)}</td></tr>)));
    if(noSensor) {
        return (<div className="Sensor">nope</div>)
        //{values}
    }

    return (
        <div className="Sensor">
            <h1>{name}</h1>

            <h3>Valeur actuelle</h3>
            <p> <span className="badge">{value(data.slice(-1), type)+" "+unit(type)}</span></p>
            <h3>Historique</h3>
            <HistoForm sensorId={name}/>
            <div id="histo"></div>
        </div>
    )
}

class HistoForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listMeasures : [],
            sensorId : this.props.sensorId,
            dateMin: "",
            dateMax: ""
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.processMeasures = this.processMeasures.bind(this);
    }

    processMeasures(payload) {
        console.log("Dans la fonction callback comme jaja : " + payload)
        this.setState({
            listMeasures: payload
        });

        console.log("mamène je comprends rien c de la chiasse : " + this.state.listMeasures)
        var monArraySeria = '';
        for (var i in this.state.listMeasures)
        {
            monArraySeria += this.afficherProps(this.state.listMeasures[i],i);
        }
        alert(monArraySeria);

    }

    afficherProps(obj, nomObjet) {
        var resultat = "";
        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                resultat += nomObjet + "." + i + " = " + obj[i] + "\n";
            }
        }
        return resultat;
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    handleSubmit(event) {
        //alert('A name was submitted: ' + this.state.sensorId + ' -> ' + this.state.dateMin + ' -> ' + this.state.dateMax);
        smApi.getSensorsMeasures(this.state.sensorId, this.state.dateMin, this.state.dateMax, this.processMeasures);
        event.preventDefault();
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    SensorId :
                    <input
                        name="sensorId"
                        type="text"
                        value={this.state.sensorId}
                        onChange={this.handleInputChange} />
                </label>
                <br />
                <label>
                    Date Min :
                    <input
                        name="dateMin"
                        type="text"
                        onChange={this.handleInputChange} />
                </label>
                <br />
                <label>
                    Date Max :
                    <input
                        name="dateMax"
                        type="text"
                        onChange={this.handleInputChange} />
                </label>
                <br />
                <input type="submit" value="Submit" />
            </form>
        );
    }
}

export default connect(
    (state, ownProp) => {
        const sensor = state.sensors.filter((s) => (s.id === ownProp.params.id))
        if(sensor.length === 1){
            return { ...sensor[0], noSensor: false}
        }
        return {noSensor:true}
    }
)(Sensor)


