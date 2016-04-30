import { SIDEBAR_VISIBILITY, ARTICLE_LIST_POSITION } from 'actions/ui';


const initialState = {
	isSidebarVisible:    false,
	articleListPosition: {
		feedId: '',
		top:    0
	}
};

export default function ui( state = initialState, action ) {
	switch ( action.type ) {
		case SIDEBAR_VISIBILITY:
			return Object.assign({}, state, {
				isSidebarVisible: action.isSidebarVisible
			});

		case ARTICLE_LIST_POSITION:
			return Object.assign({}, state, {
				articleListPosition: Object.assign(
					{},
					initialState.articleListPosition,
					action.articleListPosition
				)
			});

		default:
			return state;
	}
}
