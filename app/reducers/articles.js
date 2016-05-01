import { each, findIndex } from 'lodash';
import { REQUESTED_LOGOUT } from 'actions/session';
import { UPDATED_SETTINGS } from 'actions/settings';
import {
	REQUESTED_ARTICLES,
	RECEIEVED_ARTICLES,
	SELECTED_ARTICLE,
	UPDATED_ARTICLES,
	CLEARED_ARTICLES
} from 'actions/articles';


const initialState = {
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
		case REQUESTED_ARTICLES:
			return Object.assign({}, state, {
				isFetching: action.status
			});

		case RECEIEVED_ARTICLES:
			if ( action.feed.id !== state.feedId ) {
				newState = Object.assign({}, initialState, {
					feedId: action.feed.id
				});
			} else {
				newState = Object.assign({}, state );
			}

			newState = Object.assign({}, newState, {
				isFetching: false
			});

			if ( ! action.items || ! action.items.length ) {
				return Object.assign({}, newState, {
					hasMore: false
				});
			}

			return Object.assign({}, newState, {
				items:   newState.items.concat( action.items.map( normalizeArticle ) ),
				hasMore: action.hasMore
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

		case UPDATED_ARTICLES:
			newState = Object.assign({}, state, {
				isFetching: false
			});

			if ( ! action.items || ! action.items.length ) {
				return newState;
			}

			newItems = action.items.map( normalizeArticle );

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

		case REQUESTED_LOGOUT:
		case UPDATED_SETTINGS:
			return Object.assign({}, initialState );

		default:
			return state;
	}
}
