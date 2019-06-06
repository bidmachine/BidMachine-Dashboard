import * as React from 'react';
import {Field, FormSection} from 'redux-form';

import * as rtb from '../../models/rtb';
import {videoMimes as mimes} from '../../models/VideoMime';

import {renderByTemplate, renderField} from '../../lib/form';

export class VideoAdSection extends React.Component<any, {}> {
    render() {
        const {template} = this.props;
        return <FormSection name='ad'>
            <Field
                component={renderByTemplate(template, renderField)}
                name='mimes'
                type='multiselect'
                label='Mimes'
                options={mimes.map(mime => ({
                    value: mime,
                    label: mime
                }))}/>
            <Field component={renderByTemplate(template, renderField)} name='minduration' type='number'
                   label='Min Duration'/>
            <Field component={renderByTemplate(template, renderField)} name='maxduration' type='number'
                   label='Max Duration'/>
            <Field
                numeric
                component={renderByTemplate(template, renderField)}
                name='protocol'
                type='select'
                label='Protocol'
                options={rtb.protocols}/>
            <Field
                numeric
                component={renderByTemplate(template, renderField)}
                name='protocols'
                type='multiselect'
                label='Protocols'
                options={rtb.protocols}/>
            <Field component={renderByTemplate(template, renderField)} name='w' type='number' label='Width'/>
            <Field component={renderByTemplate(template, renderField)} name='h' type='number' label='Height'/>
            <Field component={renderByTemplate(template, renderField)} name='startdelay' type='number'
                   label='Start delay'/>
            <Field
                numeric
                component={renderByTemplate(template, renderField)}
                name='linearity'
                type='select'
                label='Video Linearity'
                options={rtb.videoLinearities}/>
            <Field
                numeric
                component={renderByTemplate(template, renderField)}
                name='battr'
                type='multiselect'
                label='Blocked Creative Attributes'
                options={rtb.creativeAttributes}/>
            <Field component={renderByTemplate(template, renderField)} name='maxextended' type='number'
                   label='Max extended'/>
            <Field component={renderByTemplate(template, renderField)} name='minbitrate' type='number'
                   label='Min bitrate'/>
            <Field component={renderByTemplate(template, renderField)} name='maxbitrate' type='number'
                   label='Max bitrate'/>
            <Field component={renderByTemplate(template, renderField)} name='boxingallowed' type='checkbox'
                   label='Boxing Allowed'/>
            <Field
                numeric
                component={renderByTemplate(template, renderField)}
                name='playbackmethod'
                type='multiselect'
                label='Playback methods'
                options={rtb.videoPlaybackMethods}/>
            <Field
                numeric
                component={renderByTemplate(template, renderField)}
                name='delivery'
                type='multiselect'
                label='Delivery methods'
                options={rtb.contentDeliveryMethods}/>
            <Field
                numeric
                component={renderByTemplate(template, renderField)}
                name='pos'
                type='select'
                label='Ad Position'
                options={rtb.adPositions}/>
            <Field
                numeric
                component={renderByTemplate(template, renderField)}
                name='api'
                type='multiselect'
                label='Api Frameworks'
                options={rtb.apiFrameworks}/>
        </FormSection>;
    }
}
