import { PropTypes } from 'react';
import _ from 'lodash';
import { REQUESTED_LOGOUT } from 'actions/session';
import {
	REQUESTED_CATEGORIES,
	RECEIEVED_CATEGORIES,
	REQUESTED_ALL_CATEGORIES,
	RECEIEVED_ALL_CATEGORIES
} from 'actions/categories';


const initialState = {
	isFetching: true,
	items:      []
};

export const categoriesShape = {
	isFetching: PropTypes.bool,
	items:      PropTypes.array
};

function normalizeCategory( category ) {
	return Object.assign({}, category, {
		id:     parseInt( category.id, 10 ),
		unread: parseInt( category.unread, 10 )
	});
}

export function categories( state = initialState, action ) {
	let feedCategories;
	let specialIdx;

	switch ( action.type ) {
		case REQUESTED_CATEGORIES:
			return Object.assign({}, state, {
				isFetching: action.isFetching
			});

		case RECEIEVED_CATEGORIES:
			feedCategories = action.categories.map( normalizeCategory );
			specialIdx     = _.findIndex( feedCategories, { id: -1 });

			if ( 0 < specialIdx ) {
				feedCategories.splice( 0, 0, feedCategories.splice( specialIdx, 1 )[ 0 ] );
			}

			return Object.assign({}, state, {
				items:      feedCategories,
				isFetching: false
			});

		case REQUESTED_LOGOUT:
			return Object.assign({}, initialState );

		default:
			return state;
	}
}

const initialAllCategories = {
	items:      [],
	isFetching: false
};

export function allCategories( state = initialAllCategories, action ) {
	let feedCategories;

	switch ( action.type ) {
		case REQUESTED_ALL_CATEGORIES:
			return Object.assign({}, state, {
				isFetching: action.isFetching
			});

		case RECEIEVED_ALL_CATEGORIES:
			feedCategories = action.feedCategories.map( normalizeCategory );
			feedCategories = _.filter( feedCategories, ( item ) => -1 < item.id );
			feedCategories = _.sortBy( feedCategories, 'title' );

			return Object.assign({}, state, {
				isFetching: false,
				items:      feedCategories
			});

		default:
			return state;
	}
}
