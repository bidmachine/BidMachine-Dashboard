import './BiddersList.scss';
import * as React from 'react';
import {Link} from 'react-router';

import {AuctionType, Bidder} from '../../models/auction/Bidder';
import {Column, DataTableSorted, renderBoolean} from '../DataTable';
import {Button} from '../Button';
import {CountryFlagList} from '../CountryFlag';
import {Progress} from '../Progress';
import * as Copy from 'react-copy-to-clipboard';

const endpointMax = 35;

export class BiddersList extends React.Component<{
    loading: boolean;
    bidders: Bidder[];
    deleteBidder: (id: number) => any;
}, {}> {
    private bidderColumns: Column[] = [{
        value: 'id',
        label: 'Id',
        width: 44
    }, {
        value: 'title',
        label: 'Title',
        render: (bidder: Bidder) => <Link to={`/bidders/${bidder.id}`}>{bidder.title}</Link>
    }, {
        value: 'agencyId',
        label: 'Agency Id',
        render: (bidder: Bidder) => <Link to={`/agencies/${bidder.agencyId}`}>{bidder.agencyId}</Link>
    }, {
        value: 'endpoint',
        label: 'Endpoint',
        render: (bidder: Bidder) => <div className='bidder-endpoint-copy'>
            <Copy text={bidder.endpoint}>
                <button>{bidder.endpoint.substr(0, endpointMax)}{bidder.endpoint.length > endpointMax ? '...' : ''}<i
                    className='fa fa-copy'/></button>
            </Copy>
        </div>
    }, {
        value: 'auctionType',
        label: 'Auction Price',
        render: (bidder: Bidder) => (
            bidder.auctionType === AuctionType.FirstPrice
                ? 'First'
                : bidder.auctionType === AuctionType.SecondPrice
                ? 'Second'
                : ''
        )
    }, {
        value: 'protocol',
        label: 'Protocol',
    }, {
        value: 'rtbVersion',
        label: 'RTB Version',
        render: (bidder: Bidder) => {
            const s = String(bidder.rtbVersion);
            if (s.length === 2) {
                return s[0] + ',' + s[1];
            } else {
                return s;
            }
        }
    }, {
        value: 'coppaFlag',
        label: 'Coppa Flag',
        render: renderBoolean
    }, {
        value: 'worldwide',
        label: 'Worldwide',
        render: renderBoolean
    }, {
        value: 'countries',
        label: 'Countries',
        render: (bidder: Bidder) => bidder.worldwide ? 'All countries' :
            <CountryFlagList countries={bidder.countries} count={10}/>,
        getValue: (bidder: Bidder) => bidder.countries ? bidder.countries.join(' ') : ''
    }, {
        value: 'platforms',
        label: 'Platforms',
        render: (bidder: Bidder) => bidder.platforms.map((p, i) => {
            const icon = p === 'ios' ? 'apple' : p;
            return <i key={i} style={{marginRight: 4, fontSize: 14}} className={`fa fa-${icon}`}/>;
        }),
        getValue: (bidder: Bidder) => bidder.platforms ? bidder.platforms.join(' ') : ''
    }, {
        value: 'maxRpm',
        label: 'Max QPS'
    }, {
        value: '',
        label: '',
        className: 'column-right',
        nosort: true,
        render: (bidder: Bidder) => <Button
            className='primary small control'
            iconLeft='fa fa-trash'
            onClick={() => this.props.deleteBidder(bidder.id)}>delete</Button>
    }];

    render() {
        return this.props.loading
            ? <Progress/>
            : <DataTableSorted columns={this.bidderColumns} data={this.props.bidders}/>;
    }
}
