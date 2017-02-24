/**
 * Created by dropy on 2/23/17.
 */
import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import SensorItemHisto from './SensorItemHisto'

import './SensorsList.css'

const SensorsListHisto = ({sensors}) => {
    let listOf = sensors.map( (sensor) => {return (<SensorItemHisto
        key={sensor.id}
        {...sensor}
    />)})
    if(listOf.length === 0) {
        listOf = (<h3>&empty;</h3>);
    }
    return (
        <div className="SensorsList">
            <h2> Sensors </h2>
            <ul>
                {listOf}
            </ul>
        </div>
    )
}

SensorsListHisto.PropTypes = {
    sensors: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.bool.isRequired,
        type: PropTypes.object.isRequired,
        data: PropTypes.array.isRequired,
    }).isRequired).isRequired
}


export default connect(
    (state) => (
        {
            sensors: state.sensors
        })
)(SensorsListHisto)
