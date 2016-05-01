import { polyfill } from 'es6-promise';
import axios from 'axios';
import { find } from 'lodash';
import { clearArticles } from 'actions/articles';


polyfill();

export const GET_FEEDS = 'GET_FEEDS';
export const GET_FEEDS_REQUEST = 'GET_FEEDS_REQUEST';
export const GET_FEEDS_SUCCESS = 'GET_FEEDS_SUCCESS';
export const GET_FEEDS_FAILURE = 'GET_FEEDS_FAILURE';
export const SELECTED_FEED = 'SELECTED_FEED';


export function fetchFeeds( cat ) {
	return ( dispatch, getState ) => {
		const { session, settings, categories } = getState();
		let category;

		if ( 'number' === typeof category ) {
			category = find( categories.items, { id: cat });
		} else {
			category = cat;
		}

		dispatch({
			type:    GET_FEEDS,
			promise: axios.post( session.url, {
				op:          'getFeeds',
				sid:         session.sid,
				cat_id:      category.id,
				unread_only: 0 < settings.unreadOnly
			}),
			category
		});
	};
}

export function selectFeed( id ) {
	return ( dispatch ) => {
		dispatch({
			type: SELECTED_FEED,
			id
		});

		dispatch( clearArticles( id ) );
	};
}

