import Api from 'api-old';
import { addLog } from 'actions/log';

export const REQUESTED_CATEGORIES = 'REQUESTED_CATEGORIES';
export const RECEIEVED_CATEGORIES = 'RECEIEVED_CATEGORIES';
export const REQUESTED_ALL_CATEGORIES = 'REQUESTED_ALL_CATEGORIES';
export const RECEIEVED_ALL_CATEGORIES = 'RECEIEVED_ALL_CATEGORIES';

function logError( dispatch, error ) {
	dispatch( addLog({
		source:  'categories',
		type:    'error',
		message: error.message
	}) );

	dispatch({
		type:       REQUESTED_CATEGORIES,
		isFetching: false
	});
}

export function getCategories() {
	return ( dispatch, getState ) => {
		const { session, settings } = getState();
		const { unreadOnly } = settings;
		const { url, sid } = session;

		dispatch({
			type:       REQUESTED_CATEGORIES,
			isFetching: true
		});

		return Api.request( url, {
			op:          'getCategories',
			unread_only: 0 < unreadOnly,
			sid
		})
			.then( response => response.json() )
			.then( json => dispatch({
				type:       RECEIEVED_CATEGORIES,
				categories: json.content
			}) )
			.catch( err => logError( dispatch, err ) );
	};
}

export function getAllCategories() {
	return ( dispatch, getState ) => {
		const { url, sid } = getState().session;

		dispatch({
			type:       REQUESTED_ALL_CATEGORIES,
			isFetching: true
		});

		return Api.request( url, {
			op:            'getCategories',
			include_empty: true,
			sid
		})
			.then( response => response.json() )
			.then( json => dispatch({
				type:       RECEIEVED_ALL_CATEGORIES,
				categories: json.content
			}) )
			.catch( err => logError( dispatch, err ) );
	};
}
