import * as React from 'react';
import {Component} from 'react';
import {reduxForm} from 'redux-form';

import {validateAdProfile} from '../../models/auction/AdProfile';

import {AdProfileForm} from '../AdProfileForm/AdProfileForm';
import {BannerAdSection} from '../BannerAdSection/BannerAdSection';
import {AdProfile} from "../../models/auction";

export class BannerAdProfileFormComponent extends Component<any, {}> {
    render() {
        return <AdProfileForm {...this.props}>
            <BannerAdSection {...this.props} />
        </AdProfileForm>;
    }
}

export const BannerAdProfileForm = reduxForm({
    form: 'bannerAdProfile',
    validate: (adProfile: AdProfile) => validateAdProfile(adProfile, 'banner')
})(BannerAdProfileFormComponent);
