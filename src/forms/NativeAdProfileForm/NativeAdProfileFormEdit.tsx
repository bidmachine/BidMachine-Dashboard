import {connect} from 'react-redux';

import {State} from '../../reducers';
import {NativeAdProfileForm} from './NativeAdProfileForm';
import {defaultNativeAdProfile} from '../../models/auction/NativeAdProfile';

export const NativeAdProfileFormEdit: any = connect((state: State, props: any) => {
    return {
        readonlyProfile: true,
        initialValues: {
            ...defaultNativeAdProfile,
            ...props.adProfile
        }
    };
})(NativeAdProfileForm);
