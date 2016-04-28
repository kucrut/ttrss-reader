import {
	OPENED_SUBSCRIPTION,
	REQUESTED_SUBSCRIPTION,
	RECEIVED_SUBSCRIPTION,
	CLOSED_SUBSCRIPTION
} from '../actions/subscription'

const messages = [
	'Feed already exists.',
	'Feed added.',
	'Invalid URL.',
	'URL content is HTML, no feeds available.',
	'Please select a feed to subscribe to:',
	"Couldn't download the URL content."
]

const initialState = {
	isOpen:        false,
	isSubscribing: false,
	status:        {},
	message:       ''
}

export default function subscription( state = initialState, action ) {
	switch ( action.type ) {
		case OPENED_SUBSCRIPTION:
			return Object.assign( {}, initialState, { isOpen: true })

		case REQUESTED_SUBSCRIPTION:
			return Object.assign( {}, state, {
				isSubscribing: action.isSubscribing
			})

		case RECEIVED_SUBSCRIPTION:
			return Object.assign( {}, state, {
				isSubscribing: false,
				status:        action.status,
				message:       messages[ action.status.code ]
			})

		case CLOSED_SUBSCRIPTION:
			return Object.assign( {}, initialState )

		default:
			return state
	}
}
