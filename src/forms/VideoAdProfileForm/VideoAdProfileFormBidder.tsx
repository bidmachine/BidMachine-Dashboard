import {VideoAdProfileForm} from './';
import {connect} from 'react-redux';

import {State} from '../../reducers';
import {AdProfileTemplateConfig, valuesFromTemplate} from "../../models/auction/AdProfieleTempate";
import {defaultVideoAdProfile} from "../../models/auction/VideoAdProfile";

export const VideoAdProfileFormBidder = connect<{}, {}, { template: AdProfileTemplateConfig, bidderId: number, onSubmit?: any, onCancel?: any }>(
    (state: State, props) => {
        return {
            readonlyProfile: !!props.bidderId,
            initialValues: {
                ...valuesFromTemplate(props.template, defaultVideoAdProfile),
                bidderId: Number(props.bidderId)
            }
        };
    }
)(VideoAdProfileForm);
