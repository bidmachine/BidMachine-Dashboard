import {connect} from 'react-redux';

import {State} from '../../reducers';
import {NativeAdSpaceForm} from './NativeAdSpaceForm';
import {defaultNativeAdSpace} from '../../models/NativeAdSpace';

export const NativeAdSpaceFormEdit: any = connect((state: State, props: any) => {
    return {
        initialValues: {
            ...defaultNativeAdSpace,
            ...props.adSpace
        }
    };
})(NativeAdSpaceForm);
