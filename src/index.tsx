import './styles/index.scss';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {applyMiddleware, compose, createStore} from 'redux';
import {Provider} from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import {reducer} from './reducers';
import UserRouter from "./routers/UserRouter";

const reduxDev = (window as any).__REDUX_DEVTOOLS_EXTENSION__;
const enchancer = DEVELOPMENT && reduxDev
    ? compose(applyMiddleware(thunkMiddleware) as any, reduxDev && reduxDev())
    : applyMiddleware(thunkMiddleware);
export const store = createStore(reducer, enchancer);

ReactDOM.render(<Provider store={store}><UserRouter/></Provider>, document.getElementById('root'));
