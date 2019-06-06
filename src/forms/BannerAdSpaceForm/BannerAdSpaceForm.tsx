import * as React from 'react';
import {Component} from 'react';
import {reduxForm} from 'redux-form';

import {BannerAdSpace, defaultBannerAdSpace} from '../../models/BannerAdSpace';

import {AdSpaceForm} from '../AdSpaceForm/AdSpaceForm';
import {BannerAdSection} from '../BannerAdSection/BannerAdSection';
import {validateAdSpace} from '../../models/AdSpace';

export class BannerAdSpaceFormComponent extends Component<any, {}> {
    render() {
        return <AdSpaceForm {...this.props} tab='banner'>
            <BannerAdSection/>
        </AdSpaceForm>;
    }
}

export const BannerAdSpaceForm = reduxForm({
    form: 'bannerAdSpace',
    initialValues: defaultBannerAdSpace,
    validate: (adSpace: BannerAdSpace) => validateAdSpace(adSpace, 'banner'),
})(BannerAdSpaceFormComponent);
