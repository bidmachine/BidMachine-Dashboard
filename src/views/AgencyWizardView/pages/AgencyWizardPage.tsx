import * as React from 'react';
import {Component} from 'react';

import {Agency} from '../../../models/auction/Agency';

import {AgencyForm} from '../../../forms/AgencyForm';
import {Button} from '../../../components/Button';

export class AgencyWizardPage extends Component<{
    agency?: Agency;
    onSubmit: (agency: Agency) => any;
    onNext: () => any;
    onCancel: () => void;
}, {}> {
    render() {
        const {agency} = this.props;
        return <div>
            {
                agency
                    ? <div>
                        <h1>{agency.title}</h1>
                        <Button onClick={this.props.onNext}>Next</Button>
                    </div>
                    : <AgencyForm onSubmit={this.createAgency} onCancel={this.props.onCancel}/>
            }
        </div>;
    }

    private createAgency = async (agency: Agency) => {
        const create = await this.props.onSubmit(agency) as { agency: Agency };
        if (create.agency) {
            this.props.onNext();
        }
    };
}
