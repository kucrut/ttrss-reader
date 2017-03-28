import { PropTypes } from 'react';
import { get, trimEnd } from 'lodash';
import {
	CHECK_SESSION_SUCCESS,
	CHECK_SESSION_FAILURE,
	LOGIN_REQUEST,
	LOGIN_SUCCESS,
	LOGIN_FAILURE,
	LOGOUT
} from 'actions/session';

const initialState = {
	url:       '',
	sid:       '',
	isAsking:  false,
	isChecked: false
};

function saveSession( url, sid ) {
	localStorage.setItem( 'ttrssUrl', url );
	localStorage.setItem( 'ttrssSid', sid );
	localStorage.setItem( 'ttrssBaseUrl', trimEnd( url, '/api/' ) );
}

export const sessionShape = {
	url:       PropTypes.string,
	sid:       PropTypes.string,
	isAsking:  PropTypes.bool,
	isChecked: PropTypes.bool
};

export default function session( state = initialState, action ) {
	let status;
	let url;
	let sid;

	switch ( action.type ) {
		case CHECK_SESSION_SUCCESS:
			// No URL/session ID found in local storage.
			if ( ! action.req ) {
				return Object.assign({}, state, {
					isChecked: true
				});
			}

			status = get( action, 'req.data.content.status' );
			url    = action.req.config.url;

			// We already have a valid session.
			if ( true === status ) {
				sid = action.sid;
			} else {
				sid = '';
				saveSession( '', '' );
			}

			return Object.assign({}, state, {
				isAsking:  false,
				isChecked: true,
				url,
				sid
			});

		case CHECK_SESSION_FAILURE:
		case LOGIN_FAILURE:
		case LOGOUT:
			saveSession( '', '' );

			return Object.assign({}, initialState, {
				isChecked: true
			});

		case LOGIN_REQUEST:
			return Object.assign({}, state, {
				isAsking: true
			});

		case LOGIN_SUCCESS:
			url = action.req.config.url;
			sid = action.req.data.content.session_id;

			saveSession( url, sid );

			return Object.assign({}, state, {
				isAsking: false,
				url,
				sid
			});

		default:
			return state;
	}
}
