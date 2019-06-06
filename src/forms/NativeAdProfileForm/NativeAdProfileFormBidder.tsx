import {NativeAdProfileForm} from './';
import {connect} from 'react-redux';

import {State} from '../../reducers';
import {AdProfileTemplateConfig, valuesFromTemplate} from "../../models/auction/AdProfieleTempate";
import {defaultNativeAdProfile} from "../../models/auction/NativeAdProfile";

export const NativeAdProfileFormBidder = connect<{}, {}, { template: AdProfileTemplateConfig, bidderId: number, onSubmit?: any, onCancel?: any }>(
    (state: State, props) => {
        return {
            readonlyProfile: !!props.bidderId,
            initialValues: {
                ...valuesFromTemplate(props.template, defaultNativeAdProfile),
                bidderId: Number(props.bidderId)
            }
        };
    }
)(NativeAdProfileForm);
