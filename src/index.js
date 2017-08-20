import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import {Observable} from 'rxjs';
import {handleAction, dispatch} from './utils/actions';
import * as Api from './utils/api';
import * as Utils from './utils/utils';
import jwtDecode from 'jwt-decode';

import './css/index.css';
const token = localStorage.getItem('token');

const initialState = {
  'user' : token ? jwtDecode(token) : null
};

const stateUpdate$ = Observable.merge(
  handleAction('register')
  .mergeMap(act => {
    let payload = Object.assign({}, act);
    delete payload['register_type'];
    delete payload['type'];
    return Api.register(act.register_type, act);
  })
  .map(res => state => {
    if (typeof res === 'string') {
      return {...state, ...{'registerStatus': res}};
    }

    localStorage.setItem('token', res.token);
    return {...state, ...{'user': res, registerStatus:null}};
  }),
  handleAction('logout')
  .mergeMap(act => {
    return Api.logout(localStorage.getItem('token'));
  })
  .map(res => state => {
    localStorage.removeItem('token');
    return {...state, ...{'user': null, loginStatus:null}};
  }),
  handleAction('refresh')
  .mergeMap(act => {
    const token = localStorage.getItem('token');
    if (token) {
      return Api.refresh(localStorage.getItem('token'));
    }

    return Observable.of(null);
  })
  .map(res => state => {
    if (typeof res === 'string' || !res) {
      localStorage.removeItem('token');
      return {...state, ...{'user': null}};
    }

    localStorage.setItem('token', res.token);
    return {...state, ...{'user': res}};
  }),
  handleAction('login')
  .mergeMap(act => {
    return Api.login(act.email, act.password);
  })
  .map(res => state => {
    if (typeof res === 'string') {
      return {...state, ...{'loginStatus': res}};
    }

    localStorage.setItem('token', res.token);
    return {...state, ...{'user': res, loginStatus:null}};
  })
);

const appState$ = Observable
.of(initialState)
.merge(stateUpdate$)
.scan((state, patch) => {
  return patch(state)
});

appState$.subscribe(
  (state) => {
    return ReactDOM.render(<App {...state} dispatch={dispatch} />,document.getElementById('root'));
  },
  (error) => {
    console.log('ERRR', error);
  }
);
