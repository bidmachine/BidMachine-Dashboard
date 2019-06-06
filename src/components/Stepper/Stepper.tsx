import './Stepper.scss';
import * as React from 'react';
import {ClassAttributes, Component} from 'react';

export interface Step {
    label: string;
    content: React.ReactNode;
}

interface StepperProps extends ClassAttributes<Stepper> {
    steps: Step[];
    currentStep?: number;
    delimeter?: React.ReactNode | string;
    onStep?: (step: number) => any;
}

export class Stepper extends Component<StepperProps, {}> {
    static defaultProps = {
        currentStep: 0,
        delimeter: <i className='fa fa-arrow-circle-right'/>
    };

    setStep = (step: number) => this.props.onStep && this.props.onStep(step);

    render() {
        const {steps, currentStep} = this.props;
        const stepsCount = steps.length;
        return <div className='stepper'>
            <div className='stepper-steps'>
                {
                    steps.map((step, i) => {
                        const active = currentStep > i;
                        const className = 'stepper-step' + (currentStep === i ? ' current' : '') + (currentStep >= i ? ' active' : '');
                        return [
                            <div
                                key={i}
                                className={className}
                                onClick={active ? () => this.setStep(i) : null}>
                                {step.label}
                            </div>,
                            i < stepsCount - 1 && <div className='stepper-delimeter'>{this.props.delimeter}</div>
                        ];
                    })
                }
            </div>
            <div className='stepper-content'>{
                steps[currentStep].content
            }</div>
        </div>;
    }
}
