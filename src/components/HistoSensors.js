/**
 * Created by dropy on 2/23/17.
 */
import React from 'react'
import './LiveSensors.css'

import SensorsListHisto from './SensorListHisto'
import Broker from './Broker'

const HistoSensors = ( {children} ) => (
    <div className="LiveSensors" >
        <Broker className="Broker"/>
        <div className="wrapper">
            <SensorsListHisto className="SensorsListHisto"/>
            {children}
        </div>
        <footer className="footer">footer</footer>
    </div>
)

export default HistoSensors
