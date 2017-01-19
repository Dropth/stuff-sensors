import React from 'react'
import { connect } from 'react-redux'

import Value from '../types/Value'
import SensorType from '../types/SensorType'

//import d3 from '../d3'
import * as d3 from "d3";

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
  
  function test () {

      console.log(values[0].props.children.props.children);

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


  
  return (
    <div className="Sensor">
      <h1>{name}</h1>

      <h3>Valeur actuelle</h3>
      <p> <span className="badge">{value(data.slice(-1), type)+" "+unit(type)}</span></p>
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
        console.log('Component WILL MOUNT!')
    }

    componentDidMount() {

        /*if(valnul="onoff") {

            console.log('Allow')

            var svgContainer = d3.select(".onoff").selectAll("div")
                .data(this.props.test).enter().append("svg")
                .attr("width", 200)
                .attr("height", 200);


            var circle = svgContainer.append("circle")
                .attr("cx", 30)
                .attr("cy", 30)
                .attr("r", 20);
        }
        else {*/

            console.log('Component DID MOUNT!')
            var x = d3.scaleLinear()
                .domain([0, 100])
                .range([0, 1000]);

            console.log(this.props.test)

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

        console.log('Fin du composant');
    }

    componentWillReceiveProps(newProps) {
        console.log('Component WILL RECIEVE PROPS!')
    }

    shouldComponentUpdate(newProps, newState) {
        return true;
    }

    componentWillUpdate(nextProps, nextState) {
        console.log('Component WILL UPDATE!');
        d3.select(".chart").selectAll("div").remove();
        d3.select(".onoff").selectAll("div").remove();

    }

    componentDidUpdate(prevProps, prevState) {
        console.log('Component DID UPDATE!');

        /*if(valnul="onoff") {

            console.log('Allow                                         ----- ')

            var svgContainer = d3.select(".onoff").data(this.props.test).enter().append("svg")
                .attr("width", 200)
                .attr("height", 200);


            var circle = svgContainer.append("circle")
                                     .attr("cx", 30)
                                     .attr("cy", 30)
                                     .attr("r", 20);
        }
        else {*/
            var x = d3.scaleLinear()
                .domain([0, 100])
                .range([0, 1000]);

            console.log(this.props.test)

            d3.select(".chart") //
                .selectAll("div")
                .data(this.props.test)
                .enter().append("div")
                .style("width", function(d) { return x(d.props.children.props.children) + "px"; })
                .text(function(d) { return d.props.children.props.children; });
        //}


        console.log('Fin du composant');
    }

    componentWillUnmount() {
        console.log('Component WILL UNMOUNT!')
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


