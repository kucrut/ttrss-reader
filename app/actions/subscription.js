import Api from 'api-old';
import { addLog } from 'actions/log';
import { getCategories } from 'actions/categories';
import { fetchFeeds } from 'actions/feeds';


export const REQUESTED_SUBSCRIPTION = 'REQUESTED_SUBSCRIPTION';
export const RECEIVED_SUBSCRIPTION = 'RECEIVED_SUBSCRIPTION';
export const ADDED_SUBSCRIPTION = 'ADDED_SUBSCRIPTION';
export const OPENED_SUBSCRIPTION = 'OPENED_SUBSCRIPTION';
export const CLOSED_SUBSCRIPTION = 'CLOSED_SUBSCRIPTION';


function logError( dispatch, error ) {
	dispatch( addLog({
		source:  'subsciption',
		type:    'error',
		message: error.message
	}) );

	dispatch({
		type:          REQUESTED_SUBSCRIPTION,
		isSubscribing: false
	});
}

export function subscribeToFeed( feedUrl, catId ) {
	return ( dispatch, getState ) => {
		const { url, sid } = getState().session;
		const categoryId = parseInt( catId, 10 );
		let status;

		dispatch({
			type:          REQUESTED_SUBSCRIPTION,
			isSubscribing: true
		});

		return Api.request( url, {
			op:          'subscribeToFeed',
			feed_url:    feedUrl,
			category_id: categoryId,
			sid
		})
			.then( response => response.json() )
			.then( json => {
				status = json.content.status;

				dispatch({
					type: RECEIVED_SUBSCRIPTION,
					status
				});

				// Feed added
				if ( 1 === status.code ) {
					dispatch( fetchFeeds( categoryId ) );
				}
			})
			.catch( err => logError( dispatch, err ) );
	};
}

export function openSubscriptionForm() {
	return ( dispatch ) => {
		dispatch({
			type: OPENED_SUBSCRIPTION
		});
	};
}

export function closeSubscriptionForm() {
	return ( dispatch ) => {
		dispatch( getCategories() );
		dispatch({ type: CLOSED_SUBSCRIPTION });
	};
}
