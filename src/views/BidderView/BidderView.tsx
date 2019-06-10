import './BidderView.scss';
import * as React from 'react';
import {ClassAttributes, Component} from 'react';
import {Dispatch} from 'redux';
import {connect} from 'react-redux';

import {Confirm} from "../../components/Confirm/Confirm";

import {State} from '../../reducers';
import {requestBidderAction, updateBidderAction} from '../../reducers/biddersList';
import {AdProfileType} from '../../models/auction/AdProfile';

import {Bidder} from '../../models/auction/Bidder';
import {AppView} from '../../components/AppView';
import {BidderFormEdit} from '../../forms/BidderForm';
import {Progress} from '../../components/Progress';
import {Tab, TabList, TabPanel, Tabs} from 'react-tabs';
import {AdProfilesTypeView} from '../AdProfilesTypeView/AdProfilesTypeView';

interface BidderViewProps extends ClassAttributes<BidderViewComponent> {
    params: any;
}

interface StateProps {
    loading: boolean;
    bidder: Bidder;
}

interface DispatchProps {
    requestBidder: (id: number) => any;
    updateBidder: (id: number, bidder: Bidder) => any;
}

const tabs: AdProfileType[] = ['banner', 'native', 'video'];

export class BidderViewComponent extends Component<BidderViewProps & StateProps & DispatchProps, {
    profilesTab: number
}> {
    state = {
        profilesTab: 0
    };

    componentDidMount() {
        this.loadBidder(this.props.params.id);
    }

    componentWillReceiveProps(next: BidderViewProps) {
        if (this.props.params.id !== next.params.id) {
            this.loadBidder(next.params.id);
        }
    }

    render() {
        const {bidder, loading} = this.props;
        const {profilesTab} = this.state;
        if (bidder) {
            return <AppView className='bidder-view'>
                <Confirm/>
                {
                    loading
                        ? <Progress/>
                        : <BidderFormEdit onSubmit={this.updateBidder}/>
                }
                <Tabs
                    onSelect={this.selectProfileTab}
                    selectedIndex={profilesTab}>
                    <TabList>
                        <Tab>Banner</Tab>
                        <Tab>Native</Tab>
                        <Tab>Video</Tab>
                    </TabList>
                    <TabPanel/>
                    <TabPanel/>
                    <TabPanel/>
                </Tabs>
                <AdProfilesTypeView type={tabs[profilesTab]} bidderId={this.props.params.id}/>
            </AppView>;
        } else {
            return null;
        }
    }

    private updateBidder = (bidder: Bidder) => {
        this.props.updateBidder(this.props.params.id, bidder);
    }

    private selectProfileTab = (profilesTab: number) => {
        this.setState({profilesTab} as any);
    }

    private loadBidder(id) {
        this.props.requestBidder(id);
    }
}

export const BidderView = connect<StateProps, DispatchProps, BidderViewProps>(
    (state: State) => {
        return {
            loading: state.biddersList.loading,
            bidder: state.biddersList.selected
        };
    },
    (dispatch: Dispatch<any>) => {
        return {
            requestBidder: (id: number) => dispatch(requestBidderAction(id)),
            updateBidder: (id: number, bidder: Bidder) => dispatch(updateBidderAction(id, bidder))
        };
    }
)(BidderViewComponent);
