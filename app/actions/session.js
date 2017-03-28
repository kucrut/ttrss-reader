import axios from 'axios';
import { toString, trimEnd } from 'lodash';

export const CHECK_SESSION = 'CHECK_SESSION';
export const CHECK_SESSION_REQUEST = 'CHECK_SESSION_REQUEST';
export const CHECK_SESSION_SUCCESS = 'CHECK_SESSION_SUCCESS';
export const CHECK_SESSION_FAILURE = 'CHECK_SESSION_FAILURE';
export const LOGIN = 'LOGIN';
export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT = 'LOGOUT';


export function checkLastSession() {
	const url = toString( localStorage.getItem( 'ttrssUrl' ) );
	const sid = toString( localStorage.getItem( 'ttrssSid' ) );

	if ( !url || !sid ) {
		return { type: CHECK_SESSION_SUCCESS };
	}

	return {
		type:    CHECK_SESSION,
		promise: axios.post( url, {
			op: 'isLoggedIn',
			sid
		}),
		sid
	};
}

export function requestLogin( creds ) {
	const url = `${trimEnd( creds.url, '/' )}/api/`;

	return {
		type:    LOGIN,
		promise: axios.post( url, {
			op:       'login',
			user:     creds.user,
			password: creds.password
		})
	};
}

export function requestLogout() {
	return ( dispatch ) => {
		dispatch({ type: LOGOUT });
	};
}
