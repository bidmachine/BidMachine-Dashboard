import * as React from 'react';
import {ClassAttributes, Component} from 'react';
import {connect} from 'react-redux';
import {Dispatch} from 'redux';
import {browserHistory} from 'react-router';

import {State} from '../../reducers';
import {createBidderAction} from '../../reducers/biddersList';
import {Bidder} from '../../models/auction/Bidder';
import {AppView} from '../../components/AppView';
import {BidderFormAgency} from '../../forms/BidderForm';

interface AgencyBidderCreateViewProps extends ClassAttributes<AgencyBidderCreateViewComponent> {
    onCancel: () => any;
}

interface StateProps {
    agencyId: number;
}

interface DispatchProps {
    createBidder: (bidder: Bidder) => any;
}

export class AgencyBidderCreateViewComponent extends Component<StateProps & DispatchProps & AgencyBidderCreateViewProps, {}> {
    createBidder = async (bidder: Bidder) => {
        await this.props.createBidder(bidder);
        this.props.onCancel ? this.props.onCancel() : browserHistory.push('/agencies/' + this.props.agencyId);
    }

    render() {
        return <AppView>
            <BidderFormAgency onSubmit={this.createBidder} agencyId={this.props.agencyId}
                              onCancel={this.props.onCancel}/>
        </AppView>;
    }
}

export const AgencyBidderCreateView = connect<StateProps, DispatchProps, AgencyBidderCreateViewProps>(
    (state: State) => {
        return {
            agencyId: state.agenciesList.selected.id
        };
    },
    (dispatch: Dispatch<any>) => {
        return {
            createBidder: (bidder: Bidder) => dispatch(createBidderAction(bidder))
        };
    }
)(AgencyBidderCreateViewComponent);
