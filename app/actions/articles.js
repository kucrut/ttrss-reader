import Api from 'api';
import { each } from 'lodash';
import { addLog } from 'actions/log';
import { getCategories } from 'actions/categories';


export const REQUESTED_ARTICLES = 'REQUESTED_ARTICLES';
export const RECEIEVED_ARTICLES = 'RECEIEVED_ARTICLES';
export const SELECTED_ARTICLE = 'SELECTED_ARTICLE';
export const UPDATED_ARTICLES = 'UPDATED_ARTICLES';
export const CLEARED_ARTICLES = 'CLEARED_ARTICLES';


export const updateFields = [
	'marked',
	'published',
	'unread',
	'note'
];

function logError( dispatch, error ) {
	dispatch( addLog({
		source:  'articles',
		type:    'error',
		message: error.message
	}) );

	dispatch({
		type:   REQUESTED_ARTICLES,
		status: false
	});
}

export function clearArticles( feedId ) {
	return ( dispatch ) => dispatch({
		type: CLEARED_ARTICLES,
		feedId
	});
}

export function fetchFeedArticles( feed, clearExisting = true, params = {}) {
	return ( dispatch, getState ) => {
		const { session, settings } = getState();
		const { limit, unreadOnly, dateReverse } = settings;
		const { url, sid } = session;
		let fetchParams = Object.assign({}, params );

		if ( feed.is_cat ) {
			fetchParams = Object.assign({}, fetchParams, {
				is_cat:    true,
				feed_id:   parseInt( feed.id.replace( /^c/, '' ), 10 ),
				view_mode: 'all_articles'
			});
		}

		fetchParams = Object.assign({
			op:           'getHeadlines',
			feed_id:      feed.id,
			view_mode:    unreadOnly ? 'unread' : 'adaptive',
			show_excerpt: true,
			show_content: true,
			limit,
			sid
		}, fetchParams );

		if ( dateReverse ) {
			fetchParams = Object.assign({}, fetchParams, {
				order_by: 'date_reverse'
			});
		}

		dispatch({
			type:   REQUESTED_ARTICLES,
			status: true
		});

		if ( clearExisting ) {
			dispatch( clearArticles( feed.id ) );
		}

		return Api.request( url, fetchParams )
			.then( response => response.json() )
			.then( json => {
				const items = json.content;

				// TODO: Check if `items` is empty

				dispatch({
					type:    RECEIEVED_ARTICLES,
					hasMore: items.length >= limit,
					feed,
					items
				});
			})
			.catch( err => logError( dispatch, err ) );
	};
}

export function fetchArticles( ids ) {
	return ( dispatch, getState ) => {
		const { url, sid } = getState().session;

		dispatch({
			type:   REQUESTED_ARTICLES,
			status: true
		});

		return Api.request( url, {
			op:         'getArticle',
			article_id: ids,
			sid
		})
			.then( response => response.json() )
			.then( json => {
				dispatch({
					type:  UPDATED_ARTICLES,
					items: json.content
				});
				dispatch( getCategories() );
			})
			.catch( err => logError( dispatch, err ) );
	};
}

/**
 * @param  {number}  ids    Article ID, separate multiple IDs with commas.
 * @param  {number}  field  Field to update {
 *     0: starred
 *     1: published
 *     2: unread
 *     3: article note
 * }
 * @param  {number}  mode   Update mode {
 *     0: set to false
 *     1: set to true
 *     2: toggle
 * }
 * @return void
 */
export function updateArticle( ids, field, mode ) {
	return ( dispatch, getState ) => {
		const { url, sid } = getState().session;

		return Api.request( url, {
			op:          'updateArticle',
			article_ids: ids,
			field:       updateFields.indexOf( field ),
			mode,
			sid
		})
			.then( response => response.json() )
			.then( () => dispatch( fetchArticles( ids ) ) )
			.catch( err => logError( dispatch, err ) );
	};
}

/**
 * Mark articles as read
 *
 * @param  {array} ids Article IDs
 * @return void
 */
export function markArticlesRead( ids ) {
	return ( dispatch, getState ) => {
		const items = [];

		each( getState().articles.items, ( item ) => {
			if ( -1 < ids.indexOf( item.id ) ) {
				items.push( Object.assign({
					unread: false
				}), item );
			}
		});

		dispatch({
			type: UPDATED_ARTICLES,
			items
		});

		dispatch( updateArticle( ids.join( ',' ), 'unread', 0 ) );
	};
}

export function selectArticle( currentId ) {
	return ( dispatch ) => {
		dispatch({
			type: SELECTED_ARTICLE,
			currentId
		});
	};
}
