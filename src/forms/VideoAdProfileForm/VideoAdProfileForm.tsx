import * as React from 'react';
import {Component} from 'react';
import {reduxForm} from 'redux-form';

import {validateAdProfile} from '../../models/auction/AdProfile';

import {AdProfileForm} from '../AdProfileForm/AdProfileForm';
import {VideoAdSection} from '../VideoAdSection/VideoAdSection';
import {AdProfile} from "../../models/auction";

export class VideoAdProfileFormComponent extends Component<any, {}> {
    render() {
        return <AdProfileForm {...this.props}>
            <VideoAdSection {...this.props} />
        </AdProfileForm>;
    }
}

export const VideoAdProfileForm = reduxForm({
    form: 'videoAdProfile',
    validate: (adProfile: AdProfile) => validateAdProfile(adProfile, 'video')
})(VideoAdProfileFormComponent);
