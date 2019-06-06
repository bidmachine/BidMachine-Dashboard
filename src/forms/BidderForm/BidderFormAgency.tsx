import {BidderSimpleForm, selector} from './';
import {connect} from 'react-redux';

import {State} from '../../reducers';
import {defaultBidder} from '../../models/auction/Bidder';

/**
 * Bidder form with preset agency (for agency wizard)
 */
export const BidderFormAgency = connect<{}, {}, {
    agencyId: number,
    onSubmit?: any,
    onCancel?: any;
}>((state: State, props) => {
    const worldwide = selector(state, 'worldwide');
    return {
        worldwide,
        readonlyAgency: true,
        initialValues: {
            ...defaultBidder,
            agencyId: props.agencyId
        }
    };
})(BidderSimpleForm);
