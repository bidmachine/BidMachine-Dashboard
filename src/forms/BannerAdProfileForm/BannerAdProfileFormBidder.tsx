import {BannerAdProfileForm} from './';
import {connect} from 'react-redux';

import {State} from '../../reducers';
import {AdProfileTemplateConfig, valuesFromTemplate} from "../../models/auction/AdProfieleTempate";
import {defaultBannerAdProfile} from "../../models/auction";

export const BannerAdProfileFormBidder = connect<{}, {}, { template: AdProfileTemplateConfig, bidderId: number, onSubmit?: any, onCancel?: any }>(
    (state: State, props) => {
        return {
            readonlyProfile: !!props.bidderId,
            initialValues: {
                ...valuesFromTemplate(props.template, defaultBannerAdProfile),
                bidderId: Number(props.bidderId)
            }
        };
    }
)(BannerAdProfileForm);
