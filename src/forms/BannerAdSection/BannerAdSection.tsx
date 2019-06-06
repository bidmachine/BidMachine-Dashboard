import * as React from 'react';
import {Field, FormSection} from 'redux-form';

import {bannerAdTypes} from '../../models/rtb/BannerAdType';
import {creativeAttributes} from '../../models/rtb/CreativeAttribute';
import {adPositions} from '../../models/rtb/AdPosition';
import {expandableDirections} from '../../models/rtb/ExpandableDirection';
import {apiFrameworks} from '../../models/rtb/ApiFramework';
import {mimes} from '../../models/Mime';

import {renderByTemplate, renderField} from '../../lib/form';

export class BannerAdSection extends React.Component<any, any> {
    render() {
        const {template} = this.props;
        return <FormSection name='ad'>
            <Field component={renderByTemplate(template, renderField)} name='w' min={1} type='number' label='Width'/>
            <Field component={renderByTemplate(template, renderField)} name='h' min={1} type='number' label='Height'/>
            <Field
                numeric
                component={renderByTemplate(template, renderField)}
                name='btype'
                type='multiselect'
                label='Banner Ad Types'
                options={bannerAdTypes}/>

            <Field
                numeric
                component={renderByTemplate(template, renderField)}
                name='battr'
                type='multiselect'
                label='Blocked Creative Attributes'
                options={creativeAttributes}/>

            <Field
                numeric
                component={renderByTemplate(template, renderField)}
                name='pos'
                type='select'
                label='Ad Position'
                options={adPositions}/>

            <Field
                component={renderByTemplate(template, renderField)}
                name='mimes'
                type='multiselect'
                label='Mimes'
                options={mimes.map(mime => ({
                    value: mime,
                    label: mime
                }))}/>

            <Field component={renderByTemplate(template, renderField)} name='topframe' type='checkbox'
                   label='Top Frame'/>

            <Field
                numeric
                component={renderByTemplate(template, renderField)}
                name='expdir'
                type='multiselect'
                label='Expandible Directions'
                options={expandableDirections}/>

            <Field
                numeric
                component={renderByTemplate(template, renderField)}
                name='api'
                type='multiselect'
                label='Api Frameworks'
                options={apiFrameworks}/>
        </FormSection>;
    }
}
