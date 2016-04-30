import Api from 'api';
import { each, trimEnd } from 'lodash';
import { addLog } from 'actions/log';


export const REQUESTED_SESSION = 'REQUESTED_SESSION';
export const SESSION_CHECKED = 'SESSION_CHECKED';
export const RECEIEVED_URL = 'RECEIEVED_URL';
export const RECEIEVED_SID = 'RECEIEVED_SID';
export const REQUESTED_LOGOUT = 'REQUESTED_LOGOUT';


function clearStorage() {
	localStorage.setItem( 'ttrssUrl', '' );
	localStorage.setItem( 'ttrssSid', '' );
}

function logError( dispatch, error ) {
	dispatch( addLog({
		source:  'categories',
		type:    'error',
		message: error.message
	}) );

	dispatch({
		type:       REQUESTED_SESSION,
		isFetching: false
	});
}

export function checkLastSession() {
	const url = localStorage.getItem( 'ttrssUrl' );
	const sid = localStorage.getItem( 'ttrssSid' );
	const actions = {
		url: {
			type: RECEIEVED_URL,
			url:  ''
		},
		sid: {
			type: RECEIEVED_SID,
			sid:  ''
		},
		checked: {
			type:      SESSION_CHECKED,
			isChecked: true
		}
	};

	if ( ! url || ! sid ) {
		clearStorage();
		return actions.checked;
	}

	return ( dispatch ) => {
		Api.request( url, {
			op: 'isLoggedIn',
			sid
		}).then( response => {
			if ( 200 !== response.status ) {
				clearStorage();
				each( actions, dispatch );
			}

			return response.json();
		}).then( json => {
			if ( json && json.content.status ) {
				actions.url.url = url;
				actions.sid.sid = sid;
			} else {
				clearStorage();
			}

			each( actions, dispatch );
		});
	};
}

export function requestLogin( creds ) {
	const params = {
		op:       'login',
		user:     creds.user,
		password: creds.password
	};

	const url = `${trimEnd( creds.url, '/' )}/api/`;

	return ( dispatch ) => {
		dispatch({
			type:     REQUESTED_SESSION,
			isAsking: true
		});

		return Api.request( url, params )
			.then( response => {
				let message;

				if ( true === response.ok ) {
					return response.json();
				}

				if ( 404 === response.status ) {
					message = 'URL Not Found.';
				} else {
					message = response.statusText;
				}

				dispatch( addLog({
					source: 'session',
					type:   'error',
					message
				}) );

				dispatch({
					type:     REQUESTED_SESSION,
					isAsking: false
				});

				throw new Error( response.statusText );
			})
			.then( json => {
				if ( 0 === json.status ) {
					dispatch({
						type: RECEIEVED_URL,
						url
					});

					dispatch({
						type: RECEIEVED_SID,
						sid:  json.content.session_id
					});
				} else {
					dispatch( addLog({
						source:  'session',
						type:    'error',
						message: 'Wrong Username or Password.'
					}) );
				}

				dispatch({
					type:     REQUESTED_SESSION,
					isAsking: false
				});
			})
			.catch( err => logError( dispatch, err ) );
	};
}

export function requestLogout() {
	return ( dispatch ) => {
		clearStorage();

		dispatch({
			type: REQUESTED_LOGOUT
		});
	};
}
