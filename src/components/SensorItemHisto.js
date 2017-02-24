/**
 * Created by dropy on 2/23/17.
 */
import React from 'react'
import AppNavLink from './AppNavLink'

const liStyle = {
    margin:'1em'
}
const SensorItemHisto = ({id, name}) => (
    <li style={liStyle}>
        <AppNavLink  to={`/histo/${id}`}>{name}</AppNavLink>
    </li>
)
export default SensorItemHisto
