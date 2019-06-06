import * as React from 'react';
import {Component} from 'react';
import {reduxForm} from 'redux-form';

import {defaultNativeAdSpace} from '../../models/NativeAdSpace';

import {AdSpaceForm} from '../AdSpaceForm/AdSpaceForm';
import {NativeAdSection} from '../NativeAdSection/NativeAdSection';

export class NativeAdSpaceFormComponent extends Component<any, {}> {
    render() {
        return <AdSpaceForm {...this.props} tab='native'>
            <NativeAdSection/>
        </AdSpaceForm>;
    }
}

export const NativeAdSpaceForm = reduxForm({
    form: 'nativeAdSpace',
    initialValues: defaultNativeAdSpace
})(NativeAdSpaceFormComponent);
