import {connect} from 'react-redux';

import {State} from '../../reducers';
import {BannerAdSpaceForm} from './BannerAdSpaceForm';
import {defaultBannerAdSpace} from '../../models/BannerAdSpace';

export const BannerAdSpaceFormEdit: any = connect((state: State, props: any) => {
    return {
        initialValues: {
            ...defaultBannerAdSpace,
            ...props.adSpace
        }
    };
})(BannerAdSpaceForm);
