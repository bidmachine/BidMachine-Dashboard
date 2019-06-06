import {connect} from 'react-redux';

import {State} from '../../reducers';
import {BannerAdProfileForm} from './BannerAdProfileForm';
import {defaultBannerAdProfile} from '../../models/auction/BannerAdProfile';

export const BannerAdProfileFormEdit: any = connect((state: State, props: any) => {
    return {
        readonlyProfile: true,
        readonlySize: true,
        initialValues: {
            ...defaultBannerAdProfile,
            ...props.adProfile
        }
    };
})(BannerAdProfileForm);
