import React from 'react';
import ReactDOM from 'react-dom';
import "@fortawesome/fontawesome-free/css/all.min.css";

/* REVIEW: Commented code was removed from here */

import './css/index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {applyMiddleware, createStore} from "redux";
import combinedReducers from "./store/reducers/combinedReducers";
import {Provider} from "react-redux"
import thunk from "redux-thunk"
import {AUTHENTICATED} from "./store/data/mapping/auth";

const store = createStore(combinedReducers, applyMiddleware(thunk));

const user = localStorage.getItem('user');
if (user) {
    store.dispatch({type: AUTHENTICATED});
}


ReactDOM.render(<Provider store={store}><App/></Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
