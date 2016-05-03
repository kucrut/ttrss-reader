import axios from 'axios';
import { polyfill } from 'es6-promise';
import { each } from 'lodash';
import { getCategories } from 'actions/categories';


polyfill();

export const GET_UNREAD = 'GET_UNREAD';
export const GET_UNREAD_REQUEST = 'GET_UNREAD_REQUEST';
export const GET_UNREAD_SUCCESS = 'GET_UNREAD_SUCCESS';
export const GET_UNREAD_FAILURE = 'GET_UNREAD_FAILURE';
export const GET_ARTICLES = 'GET_ARTICLES';
export const GET_ARTICLES_REQUEST = 'GET_ARTICLES_REQUEST';
export const GET_ARTICLES_SUCCESS = 'GET_ARTICLES_SUCCESS';
export const GET_ARTICLES_FAILURE = 'GET_ARTICLES_FAILURE';
export const UPDATE_LOCAL_ARTICLES = 'UPDATE_LOCAL_ARTICLES';
export const UPDATE_ARTICLES_REQUEST = 'UPDATE_ARTICLES_REQUEST';
export const UPDATE_ARTICLES_SUCCESS = 'UPDATE_ARTICLES_SUCCESS';
export const UPDATE_ARTICLES_FAILURE = 'UPDATE_ARTICLES_FAILURE';
export const SELECTED_ARTICLE = 'SELECTED_ARTICLE';
export const CLEARED_ARTICLES = 'CLEARED_ARTICLES';


export const updateFields = [
	'marked',
	'published',
	'unread',
	'note'
];

export function clearArticles( feedId ) {
	return ( dispatch ) => dispatch({
		type: CLEARED_ARTICLES,
		feedId
	});
}

export function fetchUnreadCount() {
	return ( dispatch, getState ) => {
		const { url, sid } = getState().session;

		dispatch({
			type:    GET_UNREAD,
			promise: axios.post( url, {
				op: 'getUnread',
				sid
			})
		});
	};
}

export function fetchFeedArticles( feed, clearExisting = true, params = {}) {
	return ( dispatch, getState ) => {
		const { session, settings } = getState();
		const { limit, unreadOnly, dateReverse } = settings;
		const { url, sid } = session;
		let fetchParams = Object.assign({}, params );

		if ( clearExisting ) {
			dispatch( clearArticles( feed.id ) );
		}

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
			type:    GET_ARTICLES,
			promise: axios.post( url, fetchParams ),
			limit,
			feed
		});
	};
}

export function fetchArticles( ids ) {
	return ( dispatch, getState ) => {
		const { url, sid } = getState().session;

		axios.post( url, {
			op:         'getArticle',
			article_id: ids,
			sid
		}).then( response => {
			dispatch( getCategories() );
			dispatch({
				type: UPDATE_ARTICLES_SUCCESS,
				req:  response
			});
		});
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

		dispatch({ type: UPDATE_ARTICLES_REQUEST });

		axios.post( url, {
			op:          'updateArticle',
			article_ids: ids,
			field:       updateFields.indexOf( field ),
			mode,
			sid
		}).then( () => dispatch( fetchArticles( ids ) ) );
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
				items.push( Object.assign( item, {
					unread: false
				}) );
			}
		});

		// Update articles in store first, so the UI
		// doesn't have to wait for `updateArticle()`.
		dispatch({
			type: UPDATE_LOCAL_ARTICLES,
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
