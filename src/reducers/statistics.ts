import {Action, Dispatch} from 'redux';
import * as moment from 'moment';

import {requestPerformance} from '../lib/api';
import {Granularity} from '../models/statistics/Granularity';
import {Collection} from '../models/statistics/Collection';
import {Performance} from '../models/statistics/Performance';

export const SET_DATE_RANGE = 'statistics/daterange/set';
export const SET_AD_NETWORK_FLAG = 'statistics/adNetwork/set';
export const SET_PERFORMANCE_TAB = 'statistics/performance/tab';
export const REQUEST_PERFORMANCE = 'statistics/performance/request';
export const REQUEST_PERFORMANCE_SUCCESS = 'statistics/performance/request/success';
export const REQUEST_PERFORMANCE_FAILURE = 'statistics/performance/request/failure';
export const CLEAR_PERFORMANCE = 'statistics/performance/clear';
export const SET_BAR_LINE = 'statistics/line/bar';
export const SET_FIRST_LINE = 'statistics/line/first';
export const SET_SECOND_LINE = 'statistics/line/second';

export enum PerformanceTab {
    daily,
    country,
    adType,
    platform,
    agency
}

export interface DateRange {
    startDate: moment.Moment;
    endDate: moment.Moment;
    adNetworks?: boolean;
}

export interface State extends DateRange {
    performanceTab: PerformanceTab;
    granularity: Granularity;
    loadingPerformance: boolean;
    performance: Performance[];
    firstLine: string;
    secondLine: string;
    barLine: string;
}

export type Actions = Action;

// 2017-03-24T00:00:00.000+00:00<br />
// {startDate.format('YYYY-MM-DDTHH:mm:ss.mmm+00:00')}

const initialState: State = {
    startDate: moment().utc(),
    endDate: moment().utc(),
    performanceTab: PerformanceTab.daily,
    granularity: 'day',
    loadingPerformance: false,
    performance: [],
    firstLine: 'impressions',
    secondLine: 'spent',
    barLine: 'impressions'
};

export function reducer(state: State = initialState, action: Actions) {
    switch (action.type) {
        case SET_AD_NETWORK_FLAG: {
            const {value} = (action as any);
            return {
                ...state,
                adNetworks: value
            };
        }
        case SET_DATE_RANGE: {
            const {startDate, endDate} = (action as any);
            return {
                ...state,
                startDate,
                endDate
            };
        }

        case SET_SECOND_LINE: {
            const {secondLine} = (action as any);
            return {
                ...state,
                secondLine
            };
        }

        case SET_BAR_LINE: {
            const {barLine} = (action as any);
            return {
                ...state,
                barLine
            };
        }

        case SET_FIRST_LINE: {
            const {firstLine} = (action as any);
            return {
                ...state,
                firstLine
            };
        }

        case SET_PERFORMANCE_TAB: {
            const {performanceTab} = (action as any);
            return {
                ...state,
                performanceTab,
                performance: [],
                firstLine: 'impressions',
                secondLine: 'spent',
                barLine: 'impressions'
            };
        }

        case CLEAR_PERFORMANCE: {
            return {
                ...state,
                performance: []
            };
        }

        case REQUEST_PERFORMANCE: {
            return {
                ...state,
                loadingPerformance: true,
                performance: []
            };
        }

        case REQUEST_PERFORMANCE_SUCCESS: {
            const {performance, granularity} = (action as any);
            return {
                ...state,
                loadingPerformance: false,
                performance,
                granularity
            };
        }

        case REQUEST_PERFORMANCE_FAILURE: {
            return {
                ...state,
                loadingPerformance: false
            };
        }

        default: {
            return state;
        }
    }
}

export const setDateRangeAction = (startDate: moment.Moment, endDate: moment.Moment) => ({
    type: SET_DATE_RANGE,
    startDate,
    endDate
});

export const setFirstLineAction = (newLine: string) => ({
    type: SET_FIRST_LINE,
    firstLine: newLine
});

export const setSecondLineAction = (newLine: string) => ({
    type: SET_SECOND_LINE,
    secondLine: newLine
});

export const setLineForBarAction = (newLine: string) => ({
    type: SET_BAR_LINE,
    barLine: newLine
});

export const setPerformanceTabAction = (performanceTab: PerformanceTab) => ({
    type: SET_PERFORMANCE_TAB,
    performanceTab
});

export const clearPerformanceAction = () => ({
    type: CLEAR_PERFORMANCE
});

export const requestPerformanceAction = (startDate: moment.Moment,
                                         endDate: moment.Moment,
                                         collection?: Collection,
                                         granularity?: Granularity,
                                         dimensions?: string[]) => (dispatch: Dispatch<any>) => {
    dispatch({
        type: REQUEST_PERFORMANCE,
        startDate,
        endDate,
        collection,
        granularity,
        dimensions
    } as any);
    return requestPerformance(
        startDate.startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS+00:00'),
        endDate.endOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS+00:00'),
        collection,
        granularity,
        dimensions
    )
        .then(performance => dispatch({
            type: REQUEST_PERFORMANCE_SUCCESS,
            startDate,
            endDate,
            collection,
            granularity,
            dimensions,
            performance: performance.data
        } as any))
        .catch(error => dispatch({
            type: REQUEST_PERFORMANCE_FAILURE,
            error
        } as any));
};
