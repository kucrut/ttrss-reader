import { REQUESTED_SESSION, SESSION_CHECKED, RECEIEVED_SID, RECEIEVED_URL, REQUESTED_LOGOUT } from '../actions/session'

const initialState = {
	url:       '',
	sid:       '',
	isAsking:  false,
	isChecked: false
}

export default function session( state = initialState, action ) {
	switch ( action.type ) {
		case SESSION_CHECKED:
			return Object.assign({}, state, {
				isChecked: action.isChecked
			})

		case REQUESTED_SESSION:
			return Object.assign({}, state, {
				isAsking: action.isAsking
			})

		case RECEIEVED_URL:
			if ( action.url ) {
				localStorage.setItem( 'ttrssUrl', action.url )
				return Object.assign({}, state, {
					url: action.url
				})
			}

		case RECEIEVED_SID:
			if ( action.sid ) {
				localStorage.setItem( 'ttrssSid', action.sid )
				return Object.assign({}, state, {
					sid: action.sid
				})
			}

		case REQUESTED_LOGOUT:
			return Object.assign( {}, state, {
				url: initialState.url,
				sid: initialState.sid
			} )

		default:
			return state
	}
}
