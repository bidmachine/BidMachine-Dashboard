import './Progress.scss';
import * as React from 'react';
import {Component} from 'react';
import Dots from 'react-activity/lib/Dots';

export class Progress extends Component<any, {}> {
    render() {
        const {style} = this.props;
        return <div className='progress' style={style}>
            <Dots/>
        </div>;
    }
}
