import {
	OPENED_SUBSCRIPTION,
	SUBSCRIBE_REQUEST,
	SUBSCRIBE_SUCCESS,
	CLOSED_SUBSCRIPTION
} from 'actions/subscription';


const messages = [
	'Feed already exists.',
	'Feed added.',
	'Invalid URL.',
	'URL content is HTML, no feeds available.',
	'Please select a feed to subscribe to:',
	"Couldn't download the URL content."
];

const initialState = {
	isOpen:        false,
	isSubscribing: false,
	status:        {},
	message:       ''
};

export default function subscription( state = initialState, action ) {
	let status;

	switch ( action.type ) {
		case OPENED_SUBSCRIPTION:
			return Object.assign({}, initialState, { isOpen: true });

		case SUBSCRIBE_REQUEST:
			return Object.assign({}, state, {
				isSubscribing: true
			});

		case SUBSCRIBE_SUCCESS:
			status = action.req.data.content.status;

			return Object.assign({}, state, {
				isSubscribing: false,
				message:       messages[ status.code ],
				status
			});

		case CLOSED_SUBSCRIPTION:
			return Object.assign({}, initialState );

		default:
			return state;
	}
}
