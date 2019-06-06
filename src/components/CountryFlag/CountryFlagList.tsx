import './CountryFlagList.scss';
import * as React from 'react';
import {CountryFlag} from './';
import {code3} from '../../lib/countries';

export const CountryFlagList = (props: {
    countries: string[],
    count?: number
} = {
    countries: [],
    count: 4
}) => {
    const {countries, count} = props;
    if (props.countries) {
        return <div className='country-flag-list'>
            {
                countries.slice(0, count).map((country, i) =>
                    <CountryFlag key={i} code={code3[country].code2.toLowerCase()} name={code3[country].name}
                    />)
            }
            {
                countries.length > count && <div>and {countries.length - count} more</div>
            }
        </div>;
    } else {
        return null;
    }
};
