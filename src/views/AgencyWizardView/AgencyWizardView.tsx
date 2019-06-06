import * as React from 'react';
import {ClassAttributes, Component} from 'react';
import {Dispatch} from 'redux';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router';

import {State} from '../../reducers';
import {createAgencyAction, createBidderAction, resetAction, setStepAction, Steps} from '../../reducers/agencyWizard';
import {Agency} from '../../models/auction/Agency';
import {Bidder} from '../../models/auction/Bidder';

import {AppView} from '../../components/AppView';
import {Stepper} from '../../components/Stepper';
import {AgencyWizardPage} from './pages/AgencyWizardPage';
import {BidderWizardPage} from './pages/BidderWizardPage';

interface AgencyWizardViewOwnProps extends ClassAttributes<AgencyWizardViewComponent> {
    onCancel: () => any;
}

interface StateProps {
    step: Steps;
    agency: Agency;
    agencyProcess: boolean;
    bidder: Bidder;
    bidderProcess: boolean;
}

interface DispatchProps {
    reset: () => any;
    setStep: (step: Steps) => any;
    createAgency: (agency: Agency) => any;
    createBidder: (bidder: Bidder) => any;
}

export class AgencyWizardViewComponent extends Component<StateProps & DispatchProps & AgencyWizardViewOwnProps, {}> {
    componentDidMount() {
        this.props.reset();
    }

    componentWillReceiveProps(next: StateProps) {
        if (this.props.step !== next.step && next.step === Steps.createBidderProfiles) {
            browserHistory.push(`/bidders/${next.bidder.id}`);
        }
    }

    render() {
        const {step, agency, bidder} = this.props;
        return <AppView>
            <div className='toolbar'>
                <div className='title'>New Agency</div>
                <div className='flex-space'/>
            </div>
            {
                step !== Steps.createBidderProfiles && <Stepper
                    currentStep={step}
                    onStep={this.props.setStep}
                    steps={[{
                        label: 'Create agency',
                        content: <AgencyWizardPage
                            agency={agency}
                            onSubmit={this.props.createAgency}
                            onNext={this.setStepBidder}
                            onCancel={this.props.onCancel}/>
                    }, {
                        label: 'Create bidder',
                        content: <BidderWizardPage
                            agency={agency}
                            bidder={bidder}
                            onSubmit={this.props.createBidder}
                            onCancel={this.props.onCancel}/>
                    }]}/>
            }
        </AppView>;
    }

    private setStepBidder = () => this.props.setStep(Steps.createBidder);
}

export const AgencyWizardView = connect<StateProps, DispatchProps, AgencyWizardViewOwnProps>(
    (state: State) => {
        return {
            step: state.agencyWizard.step,
            agency: state.agencyWizard.agency,
            agencyProcess: state.agencyWizard.agencyProcess,
            bidder: state.agencyWizard.bidder,
            bidderProcess: state.agencyWizard.bidderProcess
        };
    },
    (dispatch: Dispatch<any>) => {
        return {
            reset: () => dispatch(resetAction()),
            setStep: (step: Steps) => dispatch(setStepAction(step)),
            createAgency: (agency: Agency) => dispatch(createAgencyAction(agency)),
            createBidder: (bidder: Bidder) => dispatch(createBidderAction(bidder))
        };
    }
)(AgencyWizardViewComponent);
