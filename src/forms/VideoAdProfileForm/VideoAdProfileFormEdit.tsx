import {connect} from 'react-redux';

import {State} from '../../reducers';
import {VideoAdProfileForm} from './VideoAdProfileForm';
import {defaultVideoAdProfile} from '../../models/auction/VideoAdProfile';

export const VideoAdProfileFormEdit: any = connect((state: State, props: any) => {
    return {
        readonlyProfile: true,
        readonlySize: true,
        initialValues: {
            ...defaultVideoAdProfile,
            ...props.adProfile
        }
    };
})(VideoAdProfileForm);
