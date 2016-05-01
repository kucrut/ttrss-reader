import axios from 'axios';
import { polyfill } from 'es6-promise';
import { getCategories } from 'actions/categories';


polyfill();

export const SUBSCRIBE = 'SUBSCRIBE';
export const SUBSCRIBE_REQUEST = 'SUBSCRIBE_REQUEST';
export const SUBSCRIBE_SUCCESS = 'SUBSCRIBE_SUCCESS';
export const SUBSCRIBE_FAILURE = 'SUBSCRIBE_FAILURE';
export const OPENED_SUBSCRIPTION = 'OPENED_SUBSCRIPTION';
export const CLOSED_SUBSCRIPTION = 'CLOSED_SUBSCRIPTION';


export function subscribeToFeed( feedUrl, catId ) {
	return ( dispatch, getState ) => {
		const { url, sid } = getState().session;
		const categoryId = parseInt( catId, 10 );

		dispatch({
			type:    SUBSCRIBE,
			promise: axios.post( url, {
				op:          'subscribeToFeed',
				feed_url:    feedUrl,
				category_id: categoryId,
				sid
			})
		});
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
