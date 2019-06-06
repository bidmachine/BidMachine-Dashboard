import * as React from 'react';
import {Component} from 'react';
import {reduxForm} from 'redux-form';

import {defaultVideoAdSpace} from '../../models/VideoAdSpace';

import {AdSpaceForm} from '../AdSpaceForm/AdSpaceForm';
import {VideoAdSection} from '../VideoAdSection/VideoAdSection';

export class VideoAdSpaceFormComponent extends Component<any, {}> {
    render() {
        return <AdSpaceForm {...this.props} tab='video'>
            <VideoAdSection/>
        </AdSpaceForm>;
    }
}

export const VideoAdSpaceForm = reduxForm({
    form: 'videoAdSpace',
    initialValues: defaultVideoAdSpace
})(VideoAdSpaceFormComponent);
