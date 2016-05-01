import Api from 'api-old';
import { find } from 'lodash';
import { clearArticles } from 'actions/articles';


export const RECEIEVED_FEEDS = 'RECEIEVED_FEEDS';
export const SELECTED_FEED = 'SELECTED_FEED';


export function fetchFeeds( cat ) {
	return ( dispatch, getState ) => {
		const { session, settings, categories } = getState();
		const { unreadOnly } = settings;
		const { url, sid } = session;
		let category;

		if ( 'number' === typeof category ) {
			category = find( categories.items, { id: cat });
		} else {
			category = cat;
		}

		return Api.request( url, {
			op:          'getFeeds',
			cat_id:      category.id,
			unread_only: 0 < unreadOnly,
			sid
		})
			.then( response => response.json() )
			.then( json => {
				dispatch({
					type:  RECEIEVED_FEEDS,
					items: json.content,
					category
				});
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

