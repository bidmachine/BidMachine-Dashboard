// import './BidderCreateView.scss';
import * as React from 'react';
import {ClassAttributes} from 'react';
import {Dispatch} from 'redux';
import {connect} from 'react-redux';

import {Bidder} from '../../models/auction/Bidder';
import {createBidderAction} from '../../reducers/biddersList';

import {AppView} from '../../components/AppView';
import {BidderForm} from '../../forms/BidderForm';

interface BidderCreateViewProps extends ClassAttributes<BidderCreateViewComponent> {
    onCancel: () => any;
}

interface DispatchProps {
    createBidder: (bidder: Bidder) => any;
}

export class BidderCreateViewComponent extends React.Component<DispatchProps & BidderCreateViewProps, {}> {
    render() {
        return <AppView>
            <div className='toolbar'>
                <div className='title'>Create Bidder</div>
                <div className='flex-space'/>
            </div>
            <BidderForm onSubmit={this.createBidder} onCancel={this.props.onCancel}/>
        </AppView>;
    }

    private createBidder = async (bidder: Bidder) => {
        const create = await this.props.createBidder(bidder) as { bidder: Bidder };
        if (create.bidder) {
            this.props.onCancel();
        }
    }
}

export const BidderCreateView = connect<{}, DispatchProps, BidderCreateViewProps>(
    null,
    (dispatch: Dispatch<any>) => {
        return {
            createBidder: (bidder: Bidder) => dispatch(createBidderAction(bidder))
        };
    }
)(BidderCreateViewComponent);
