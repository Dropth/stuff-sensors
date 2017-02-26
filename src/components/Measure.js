/**
 * Created by dropy on 2/24/17.
 */
import React from 'react'

class Measure extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            measures: this.props.listMeasures
        }
    }

    render() {
        return (
            <h1>Coucou</h1>
        );
    }
}