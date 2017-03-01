import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router';
import { Button } from 'react-bootstrap';

import Value from '../types/Value'
import SensorType from '../types/SensorType'
import * as smApi from '../api/SensorMeasures'

//import d3 from '../d3'
import * as d3 from "d3";

import './Sensor.css'

let tabVal = {"nomSensor":"","local":""};

const Sensor = ({id, name, type, data, noSensor}) =>  {

  const unit = (type) => {
    const units = {}
    units[SensorType.TEMPERATURE] = "°C"
    units[SensorType.PERCENT] = "%"
    return units[type] || ""
  }
  const value  = (v, t) => {
//
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
  
  function test () {

      //var data = [4, 8, 15, 16, 23, 42];

      var x = d3.scaleLinear()
          .domain([0, d3.max(data)])
          .range([0, 420]);

      d3.select(".chart")
          .selectAll("div")
          .data(values)
          .enter().append("div")
          .style("width", function(d) { return x(d.props.children.props.children) + "px"; })
          .text(function(d) { return d.props.children.props.children; });
  }

    function processMeasures(payload) {
        var obj = payload;

        document.getElementById("infoSensor").innerHTML += "<h3>Nouvelle valeur du Sensor</h3>"

        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                var objet = obj[i]
                for (var j in objet) {
                    if (objet.hasOwnProperty(j)) {

                        document.getElementById("infoSensor").innerHTML += "<ul>"
                        document.getElementById("infoSensor").innerHTML += "<li><p>" + j + " : <span class=\"badge\">" + objet[j] + "</span></p></li>"
                        document.getElementById("infoSensor").innerHTML += "</ul>"

                    }
                }
            }
        }

    }

    function handleSubmit(e) {

        smApi.updateSensor(name, tabVal['nomSensor'], tabVal['local'], processMeasures);

        e.preventDefault();
        event.preventDefault();
    }

    function handleInputChange(event) {

        document.getElementById("infoSensor").innerHTML = "";

      const target = event.target;
      const value = target.value;
      const name = target.name;

      tabVal[name] = value;
    }

    browserHistory.listen( location =>  {
        document.getElementById("infoSensor").innerHTML = "";
        document.getElementById("nomSensor").value = "";
        document.getElementById("local").value = "";

    });



    return (
    <div className="Sensor">
      <h1>{name}</h1>

      <h3>Valeur actuelle</h3>
      <p> <span className="badge">{value(data.slice(-1), type)+" "+unit(type)}</span></p>
        <h1>Ajout d'information</h1>
        <form onSubmit={handleSubmit}>
            <label>
                Nom du Sensor : &nbsp;&nbsp;&nbsp;
                <input
                    name="nomSensor"
                    id="nomSensor"
                    type="text"
                    onChange={handleInputChange} />
            </label>
            <br />
            <label>
                Localisation : &nbsp;&nbsp;&nbsp;
                <input
                    name="local"
                    id="local"
                    type="text"
                    onChange={handleInputChange} />
            </label>
            <br />
            <Button bsStyle="primary" type="submit"> Update Sensor </Button>
        </form>

        <div id="infoSensor"></div>

      <h3>Historique</h3>
      <table>
        <tbody>
        <div className="chart"></div>
        <div className="onoff"></div>
        <Content className="comp" test={values}></Content>
        </tbody>
      </table>
    </div>
  )
}

class Content extends React.Component {

    componentWillMount() {
    }

    componentDidMount() {

            var x = d3.scaleLinear()
                .domain([0, 100])
                .range([0, 1000]);

            d3.select(".chart") //
                .selectAll("div")
                .data(this.props.test)
                .enter().append("div")
                .style("width", function (d) {
                    return x(d.props.children.props.children) + "px";
                })
                .text(function (d) {
                    return d.props.children.props.children;
                });
        //}

    }

    componentWillReceiveProps(newProps) {
    }

    shouldComponentUpdate(newProps, newState) {
        return true;
    }

    componentWillUpdate(nextProps, nextState) {
        d3.select(".chart").selectAll("div").remove();
        d3.select(".onoff").selectAll("div").remove();

    }

    componentDidUpdate(prevProps, prevState) {

            var x = d3.scaleLinear()
                .domain([0, 100])
                .range([0, 1000]);

            d3.select(".chart") //
                .selectAll("div")
                .data(this.props.test)
                .enter().append("div")
                .style("width", function(d) { return x(d.props.children.props.children) + "px"; })
                .text(function(d) { return d.props.children.props.children; });


    }

    componentWillUnmount() {
        d3.select(".comp").remove();
    }

    render() {

        return (
            <div>

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


