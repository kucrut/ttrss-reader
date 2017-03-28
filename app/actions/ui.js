export const SIDEBAR_VISIBILITY = 'SIDEBAR_VISIBILITY';
export const ARTICLE_LIST_POSITION = 'ARTICLE_LIST_POSITION';


export function showSidebar() {
	return ( dispatch ) => {
		dispatch({
			type:             SIDEBAR_VISIBILITY,
			isSidebarVisible: true
		});
	};
}

export function hideSidebar() {
	return ( dispatch ) => {
		dispatch({
			type:             SIDEBAR_VISIBILITY,
			isSidebarVisible: false
		});
	};
}

export function toggleSidebar() {
	return ( dispatch, getState ) => {
		dispatch({
			type:             SIDEBAR_VISIBILITY,
			isSidebarVisible: !getState().ui.isSidebarVisible
		});
	};
}

export function setArticleListPosition( arg = {}) {
	return ( dispatch ) => {
		dispatch({
			type:                ARTICLE_LIST_POSITION,
			articleListPosition: arg
		});
	};
}
