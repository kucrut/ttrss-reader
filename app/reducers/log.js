import { PropTypes } from 'react';
import { get } from 'lodash';
import { ADDED_LOG, REMOVED_LOG } from 'actions/log';
import { LOGIN_SUCCESS, LOGIN_FAILURE } from 'actions/session';

const initialState = {
	item: {}
};

function getErrorMessage( action ) {
	let message;

	if ( action.error && action.error instanceof Error ) {
		message = action.error.message;
	}

	if ( ! message ) {
		message = get( action, 'req.data.content.error' );
	}

	if ( ! message ) {
		message = get( action, 'error.statusText' );
	}

	return message;
}

export const logsShape = {
	item: PropTypes.object
};

export default function log( state = initialState, action ) {
	let message;

	switch ( action.type ) {
		case ADDED_LOG:
			return Object.assign({}, state, {
				item: action.item
			});

		case REMOVED_LOG:
			return Object.assign({}, state, {
				item: initialState.item
			});

		case LOGIN_SUCCESS:
		case LOGIN_FAILURE:
			message = getErrorMessage( action );

			if ( message ) {
				return Object.assign({}, state, {
					item: {
						type:   'error',
						source: 'session',
						message
					}
				});
			}

			return state;

		default:
			return state;
	}
}
