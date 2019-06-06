import * as React from 'react';
import {Component} from 'react';
import {reduxForm} from 'redux-form';

import {validateAdProfile} from '../../models/auction/AdProfile';

import {AdProfileForm} from '../AdProfileForm/AdProfileForm';
import {NativeAdSection} from '../NativeAdSection/NativeAdSection';
import {AdProfile} from "../../models/auction";

export class NativeAdProfileFormComponent extends Component<any, {}> {
    render() {
        return <AdProfileForm {...this.props}>
            <NativeAdSection {...this.props}/>
        </AdProfileForm>;
    }
}

export const NativeAdProfileForm = reduxForm({
    form: 'nativeAdProfile',
    validate: (adProfile: AdProfile) => validateAdProfile(adProfile, 'native')
})(NativeAdProfileFormComponent);
