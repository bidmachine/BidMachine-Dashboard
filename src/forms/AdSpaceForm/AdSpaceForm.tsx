import * as React from 'react';
import {Component} from 'react';
import {change, Field, reset, untouch} from 'redux-form';
import {connect} from 'react-redux';

import {renderField} from '../../lib/form';
import {Button} from '../../components/Button';
import {AdSpace} from '../../models/AdSpace';

interface DispatchProps {
    changeField: (form: string, field: string, value: string) => any;
    untouchField: (form: string, field: string) => any;
    resetForm: (form: string) => any;
}

interface AdSpaceProps {
    adSpace: AdSpace;
    handleSubmit: () => void;
    submitting: boolean;
    onCancel: () => void;
    tab?: string;
}

class AdSpaceFormComponent extends Component<DispatchProps & AdSpaceProps, {
    extArr: Map<number, string[]>;
    deleteArr: Map<number, boolean>;
}> {
    state = {
        extArr: new Map(),
        deleteArr: new Map()
    };

    componentDidMount() {
        const {adSpace} = this.props;
        if (adSpace) {
            let count = 0;
            for (const key in adSpace) {
                if (key.indexOf('name') > -1) {
                    this.addExt(true);
                    count++;
                }
            }
            if (count === 0) {
                this.addExt(true);
            }
        } else {
            this.addExt(true);
        }
        this.props.resetForm(`${this.props.tab}AdSpace`);
    }

    addExt = (isInitial: boolean) => {
        const tmpArr = this.state.extArr;
        const {deleteArr} = this.state;
        const newArr = [];
        newArr.push(`name${tmpArr.size + 1}`);
        newArr.push(`value${tmpArr.size + 1}`);
        tmpArr.set(tmpArr.size + 1, newArr);
        deleteArr.set(tmpArr.size, true);
        this.setState({
            extArr: tmpArr,
            deleteArr
        });
    }

    deleteExt = (index) => {
        const {deleteArr} = this.state;
        const form = `${this.props.tab}AdSpace`;
        this.props.changeField(form, `name${index}`, '');
        this.props.changeField(form, `value${index}`, '');
        this.props.untouchField(form, `name${index}`);
        this.props.untouchField(form, `value${index}`);
        const count = Array.from(deleteArr.values()).reduce((sum, val) => {
            return val ? sum + 1 : sum;
        }, 0);
        if (count >= 2) {
            deleteArr.set(index, false);
            this.setState({
                deleteArr
            } as any);
        }
    }

    render() {
        const {handleSubmit, submitting} = this.props;
        const {extArr, deleteArr} = this.state;
        const ind = Array.from(deleteArr.values()).findIndex(val => val === true);
        return <form className='model-form' onSubmit={handleSubmit}>
            {
                // <Field
                //   component={renderSelectBidderField}
                //   name='appId'
                //   type='text'
                //   label='App'
                //   readonly={readonlyApp} />

                // <Field
                //   component={renderSelectBidderField}
                //   name='publisherId'
                //   type='text'
                //   label='Publisher'
                //   readonly={readonlyPublisher} />
            }

            <Field component={renderField} name='interstitial' type='checkbox' label='Interstitial'/>
            <Field component={renderField} name='debug' type='checkbox' label='Debug'/>
            <Field component={renderField} name='reward' type='checkbox' label='Rewared'/>
            <Field component={renderField} name='active' type='checkbox' label='Active' switcher/>
            <Field component={renderField} name='title' type='text' label='Title'/>
            <Field component={renderField} name='displayManager' type='text' label='Display Manager'/>

            {this.props.children}

            {Array.from(extArr.values()).map((value, i) => {
                return deleteArr.get(i + 1) ?
                    <div key={i} className='form-field ext'>
                        <label>{i === ind ? 'Ext' : null}</label>
                        <div className='line-break'/>
                        <Field component={renderField} id={value[0]} name={value[0]} type='ext' placeholder='name'/> :
                        <Field component={renderField} id={value[1]} name={value[1]} type='ext' placeholder='value'/>
                        <div className='line-break'/>
                        <Button style={{marginLeft: '3px'}} type='button'
                                onClick={() => this.deleteExt(i + 1)}>Delete</Button>
                    </div> : null;
            })}
            <div className='form-field'>
                <label/>
                <div className='add'>
                    <Button type='button' onClick={() => this.addExt(false)} className='primary'>Add</Button>
                </div>
            </div>

            <div className='form-field'>
                <label/>
                <div className='form-controls'>
                    <Button className='primary' disabled={submitting} type='submit'>Save</Button>
                    <Button onClick={this.props.onCancel} type='button'>Cancel</Button>
                </div>
            </div>
        </form>;
    }
}

export const AdSpaceForm = connect<{}, DispatchProps, AdSpaceProps>(
    null,
    (dispatch) => {
        return {
            changeField: (form: string, field: string, value: string) => {
                return dispatch(change(form, field, value));
            },
            untouchField: (form: string, field: string) => {
                return dispatch(untouch(form, field));
            },
            resetForm: (form: string) => {
                return dispatch(reset(form));
            }
        };
    }
)(AdSpaceFormComponent);
