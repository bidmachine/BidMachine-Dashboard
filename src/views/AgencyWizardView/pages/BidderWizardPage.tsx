import * as React from 'react';
import {Component} from 'react';

import {Bidder} from '../../../models/auction/Bidder';
import {Agency} from '../../../models/auction/Agency';

import {BidderFormAgency} from '../../../forms/BidderForm';

export class BidderWizardPage extends Component<{
    agency: Agency;
    bidder?: Bidder;
    onSubmit: (bidder: Bidder) => any;
    onCancel: () => any;
}, {}> {
    render() {
        const {bidder, agency} = this.props;
        return <div>
            {
                bidder
                    ? <div>
                        <h1>{bidder.title}</h1>
                    </div>
                    : <BidderFormAgency agencyId={agency.id} onSubmit={this.props.onSubmit}
                                        onCancel={this.props.onCancel}/>
            }
        </div>;
    }
}
