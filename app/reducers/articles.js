import { get, each, findIndex } from 'lodash';
import { UPDATED_SETTINGS } from 'actions/settings';
import {
	GET_UNREAD_SUCCESS,
	GET_ARTICLES_REQUEST,
	GET_ARTICLES_SUCCESS,
	UPDATE_LOCAL_ARTICLES,
	UPDATE_ARTICLES_REQUEST,
	UPDATE_ARTICLES_SUCCESS,
	SELECTED_ARTICLE,
	CLEARED_ARTICLES
} from 'actions/articles';
import { LOGOUT } from 'actions/session';


const initialState = {
	unread:       0,
	feedId:       '',
	currentId:    '',
	currentIndex: '',
	items:        [],
	isFetching:   false,
	hasMore:      false
};

function normalizeArticle( article ) {
	return Object.assign({}, article, {
		id:      parseInt( article.id, 10 ),
		score:   parseInt( article.score, 10 ),
		feed_id: parseInt( article.feed_id, 10 )
	});
}

export default function articles( state = initialState, action ) {
	let newState;
	let newItems;
	let currentIndex;

	switch ( action.type ) {
		case GET_UNREAD_SUCCESS:
			return Object.assign({}, state, {
				unread: parseInt( get( action, 'req.data.content.unread' ), 10 )
			});

		case GET_ARTICLES_REQUEST:
		case UPDATE_ARTICLES_REQUEST:
			return Object.assign({}, state, {
				isFetching: true
			});

		case GET_ARTICLES_SUCCESS:
			newItems = action.req.data.content;

			if ( action.feed && action.feed.id !== state.feedId ) {
				newState = Object.assign({}, initialState, {
					feedId:     action.feed.id,
					isFetching: false
				});
			} else {
				newState = Object.assign({}, state, {
					isFetching: false
				});
			}

			if ( ! newItems || ! newItems.length ) {
				return Object.assign({}, newState, {
					hasMore: false
				});
			}

			return Object.assign({}, newState, {
				items:   newState.items.concat( newItems.map( normalizeArticle ) ),
				hasMore: newItems.length === action.limit
			});

		case SELECTED_ARTICLE:
			if ( '' === action.currentId ) {
				currentIndex = '';
			} else {
				currentIndex = state.items.findIndex( ( article ) => {
					let found;

					if ( action.currentId === article.id ) {
						found = article;
					}

					return found;
				});
			}

			return Object.assign({}, state, {
				currentId: action.currentId,
				currentIndex
			});

		case UPDATE_LOCAL_ARTICLES:
		case UPDATE_ARTICLES_SUCCESS:
			newItems = action.items ? action.items : action.req.data.content;
			newState = Object.assign({}, state, {
				isFetching: false
			});

			if ( ! newItems || ! newItems.length ) {
				return newState;
			}

			newItems = newItems.map( normalizeArticle );

			each( newItems, ( item ) => {
				const index = findIndex( newState.items, { id: item.id });

				if ( -1 < index ) {
					newState.items[ index ] = item;
				}
			});

			return newState;

		case CLEARED_ARTICLES:
			return Object.assign({}, state, {
				feedId:       state.feedId,
				currentId:    '',
				currentIndex: '',
				items:        [],
				hasMore:      false
			});

		case LOGOUT:
		case UPDATED_SETTINGS:
			return Object.assign({}, initialState );

		default:
			return state;
	}
}
