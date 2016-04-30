import { PropTypes } from 'react';
import { ADDED_LOG, REMOVED_LOG } from '../actions/log'

const initialState = {
	item: {}
}

export const logsShape = {
	item: PropTypes.object
};

export default function log( state = initialState, action ) {
	switch ( action.type ) {
		case ADDED_LOG:
			return Object.assign( {}, state, {
				item: action.item
			})

		case REMOVED_LOG:
			return Object.assign( {}, state, {
				item: initialState.item
			})

		default:
			return state
	}
}
