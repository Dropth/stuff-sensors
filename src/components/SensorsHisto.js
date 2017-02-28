/**
 * Created by dropy on 2/23/17.
 */
import React from 'react'
import ReactDOM from 'react-dom';
import { connect } from 'react-redux'

import Value from '../types/Value'
import SensorType from '../types/SensorType'
//import Measure from './Measure'
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

        document.getElementById('histo').innerHTML ="";

        ReactDOM.render(<Measure measures={this.state.listMeasures}/>, document.getElementById('histo'));

    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
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

class Measure extends React.Component {
    constructor(props) {
        super(props);
        console.log('---------------------_____________________@@@@@@@@@@@@@@@@@@@@@@@@@@ : ' + this.afficherProps(this.props))
        var mesure = []
        var obj = this.props;

        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                var objet = obj[i]
                for (var j in objet) {
                    if (objet.hasOwnProperty(j)) {
                        mesure.push(objet[j])
                    }
                }
            }
        }

        mesure.sort(function(a,b){
            return new Date(b.date) - new Date(a.date)
        });

        this.state = {
            measures: mesure,
            deb: 0,
            fin: 9,
            value : 'all',
            inputVal : 0,
            tabInterval : []
        }

        this.handleClick = this.handleClick.bind(this);
        this.handleClickAfter = this.handleClickAfter.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });

        console.log("Je suis en pls help");
    }

    handleSubmit(event) {

        Date.prototype.getWeek = function() {

            // Create a copy of this date object
            var target  = new Date(this.valueOf());

            // ISO week date weeks start on monday, so correct the day number
            var dayNr   = (this.getDay() + 6) % 7;

            // Set the target to the thursday of this week so the
            // target date is in the right year
            target.setDate(target.getDate() - dayNr + 3);

            // ISO 8601 states that week 1 is the week with january 4th in it
            var jan4    = new Date(target.getFullYear(), 0, 4);

            // Number of days between target date and january 4th
            var dayDiff = (target - jan4) / 86400000;

            if(new Date(target.getFullYear(), 0, 1).getDay() < 5) {
                // Calculate week number: Week 1 (january 4th) plus the
                // number of weeks between target date and january 4th
                return 1 + Math.ceil(dayDiff / 7);
            }
            else {  // jan 4th is on the next week (so next week is week 1)
                return Math.ceil(dayDiff / 7);
            }
        };

        if (this.state.value !== 'all') {

            console.log("GOGOGOGGOGOGOGGOGOGO")

            let tabVal = [];

            for (let val of this.state.measures) {
                let date = new Date(val["date"]);
                date.setTime(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
                let formVal = Number(this.state.inputVal);

                switch(this.state.value) {
                    case "hour":
                        console.log("Test : " + typeof(date.getHours()) +" == " + typeof(formVal) + " ---> ");
                        if(date.getHours() === formVal) {
                            tabVal.push(val);
                        }
                        break;
                    case "day":
                        if(date.getDate() === formVal) {
                            tabVal.push(val);
                        }
                        break;
                    case "week":
                        console.log("Test : " + date.getWeek() +" == " + formVal + " ---> ");
                        if(date.getWeek() === formVal) {
                            tabVal.push(val);
                        }
                        break;
                }
            }

            console.log("TEEEEEEEEEEEEEEEEST : " + tabVal)
            console.log("TEEEEEEEEEEEEEEEEST  TAMER PUTAIN : " + tabVal.length)

            //this.setState({tabInterval: tabVal});
            this.state.tabInterval = tabVal;

            console.log("TEEEEEEEEEEEEEEEEST : " + this.state.tabInterval)
            console.log("TEEEEEEEEEEEEEEEEST  TAMER PUTAIN : " + this.state.tabInterval.length)
        }
        else
            this.state.tabInterval = [];


        console.log("TEEEEEEEEEEEEEEEEST NUMMMMMMMMMMMMMBER 2 : " + this.state.tabInterval.length)

        if(this.state.value !== "all")
            if(this.state.tabInterval.length === 0)
                document.getElementById("nothing").innerHTML = "L'intervalle n'a rien donné de concluant";
            else {
                document.getElementById("nothing").innerHTML = "";
                this.state.deb = 0;
                this.state.fin = 9;
            }

        else
            document.getElementById("nothing").innerHTML = "";


        this.forceUpdate();
        event.preventDefault();
    }

    handleChange(event) {

        let select = event.target.value;

        console.log("COUCOU " + select)

        //this.setState({value: select});
        this.state.value = select;
        document.getElementById("testSelect").value = this.state.value;

        console.log("COUCOU ALLLLLLLLLOW " + this.state.value)

        if(select === "all") {
            document.getElementById("inputVal").disabled = true;
        }
        else {

            document.getElementById("inputVal").disabled = false;
        }
        this.forceUpdate();
    }

    handleClick(event) {

        let isOk=0;

        if(this.state.tabInterval.length != 0)
            isOk = this.state.tabInterval.length-1;
        else
            isOk = this.state.measures.length-1;

        if(this.state.fin <= isOk) {

            let temp = this.state.fin;
            this.state.deb = this.state.fin;
            this.state.fin = temp + 9;
            this.forceUpdate();
        }
        //
    }

    handleClickAfter(event) {
        console.log("ALLLLLLLLLLLLLLLOW : " + this.state)

        if(this.state.deb > 0) {

            let temp = this.state.deb;
            this.state.fin = this.state.deb;
            this.state.deb = temp - 9;
            this.forceUpdate();
        }
    }

    afficherProps(obj) {
        var resultat = "";
        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                resultat += "<td>"+ obj[i] + "</td>";
            }
        }
        //resultat+="</tr>"
        return resultat;
    }



    render() {

        if(this.state.deb < 0)
            this.state.deb = 0;

        let cpt=this.state.deb;
        let tabFinal = [];

        console.log("This isn't my final form ----> Deb : " + this.state.deb + " ________  Fin : " + this.state.fin)

        let end =this.state.end;

        if(this.state.tabInterval.length === 0) {

            if (this.state.fin <= this.state.measures.length - 1)
                end = this.state.fin;
            else
                end = this.state.measures.length - 1;

            for (cpt; cpt < end; cpt++) {
                tabFinal[cpt] = this.state.measures[cpt];
            }

        }
        else {
            if (this.state.fin <= this.state.tabInterval.length - 1)
                end = this.state.fin;
            else
                end = this.state.tabInterval.length - 1;

            for (cpt; cpt < end; cpt++) {
                tabFinal[cpt] = this.state.tabInterval[cpt];
            }
        }

        return (

            <div id="test">

                <form onSubmit={this.handleSubmit}>
                    <label>
                        Choix de l'intervalle :
                        <select id="testSelect" value={this.state.value} onChange={this.handleChange}>
                            <option value="all">All</option>
                            <option value="hour">Heure</option>
                            <option value="day">Journée (Jour du mois)</option>
                            <option value="week">Semaine (Semaine de l'année)</option>
                        </select>
                    </label>
                    <label>
                        <input name="inputVal" type="number" disabled="true" id="inputVal" required="true" onChange={this.handleInputChange} />
                    </label>
                    <input type="submit" value="Submit" id="submit"/>
                </form>

                <h2 id="nothing"></h2>

                <table>                    <thead>
                        <tr>
                            <th>_id</th>
                            <th>sensorId</th>
                            <th>Date</th>
                            <th>value</th>
                            <th>v_</th>
                        </tr>
                    </thead>
                    <tbody>
                    {tabFinal.map(function(row, i) {
                        return (
                            <tr key={i}>
                                {Object.keys(row).map(function(key) {
                                    return <td key={key}>{row[key]}</td>;
                                })}
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
                <br/>
                <input type="button" onClick={this.handleClick} value="Retour vers le passé"/> <input type="button" onClick={this.handleClickAfter} value="Retour vers le futur"/>
            </div>

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


