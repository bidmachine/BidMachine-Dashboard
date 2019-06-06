import {connect} from 'react-redux';

import {State} from '../../reducers';
import {VideoAdSpaceForm} from './VideoAdSpaceForm';
import {defaultVideoAdSpace} from '../../models/VideoAdSpace';

export const VideoAdSpaceFormEdit: any = connect((state: State, props: any) => {
    return {
        initialValues: {
            ...defaultVideoAdSpace,
            ...props.adSpace
        }
    };
})(VideoAdSpaceForm);
