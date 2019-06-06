import {connect} from 'react-redux';

import {State} from '../../reducers';
import {BidderSimpleForm, selector} from './';
import {defaultBidder} from '../../models/auction/Bidder';

export const BidderFormEdit: any = connect((state: State) => {
    const worldwide = selector(state, 'worldwide');
    let selected = state.biddersList.selected;
    if (!selected.includedSellers) {
        selected = {...selected, includedSellers: [1]}
    }
    return {
        worldwide,
        initialValues: {
            ...defaultBidder,
            ...selected
        }
    };
})(BidderSimpleForm);
