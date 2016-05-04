import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import { fetchFeedArticles } from 'actions/articles';
import { setArticleListPosition } from 'actions/ui';
import Spinner from 'components/Spinner';
import Article from 'components/Article';
import FeedActions from 'components/FeedActions';
import NothingFound from 'components/NothingFound';
import LoadMoreButton from 'components/LoadMoreButton';

import stlLayout from 'css/common/layout';
import stlArticles from 'css/containers/articles';
const cx = classNames.bind( Object.assign({}, stlLayout, stlArticles ) );


class ArticleList extends React.Component {
	static propTypes = {
		feed:        PropTypes.object.isRequired,
		scrollPos:   PropTypes.object.isRequired,
		articles:    PropTypes.object.isRequired,
		unreadOnly:  PropTypes.number.isRequired,
		mainContent: PropTypes.element.isRequired,
		dispatch:    PropTypes.func.isRequired
	}

	componentDidMount() {
		const { feed, articles, scrollPos, mainContent } = this.props;

		if ( ! articles.items.length ) {
			this.fetchArticles( feed );
		} else {
			if ( scrollPos.feedId === feed.id ) {
				mainContent.scrollTop = scrollPos.top;
			}
		}
	}

	componentWillReceiveProps( nextProps ) {
		const { feed, articles } = nextProps;

		if ( feed.id !== this.props.feed.id && ! articles.isFetching ) {
			this.fetchArticles( feed );
		}
	}

	componentWillUnmount() {
		const { feed, dispatch, mainContent } = this.props;

		dispatch( setArticleListPosition({
			feedId: feed.id,
			top:    mainContent.scrollTop
		}) );
	}

	fetchArticles( feed ) {
		this.props.dispatch( fetchFeedArticles( feed ) );
	}

	renderLoadMoreButton() {
		const { items, hasMore } = this.props.articles;
		let button;

		if ( items.length && hasMore ) {
			button = (
				<LoadMoreButton { ...this.props } />
			);
		}

		return button;
	}

	renderList() {
		const { items } = this.props.articles;
		const clsArticles = cx( 'articles' );

		return (
			<div className={ clsArticles }>
				{ items.map( article => (
					<Article key={ article.id } article={ article } isSingle={ false } />
				) ) }
			</div>
		);
	}

	renderSpinner() {
		const clsMain = cx( 'main-init' );

		return (
			<div className={ clsMain }><Spinner /></div>
		);
	}

	renderFeedActions() {
		let actions;

		if ( this.props.articles.items.length ) {
			actions = ( <FeedActions /> );
		}

		return actions;
	}

	render() {
		const { isFetching, items } = this.props.articles;
		const clsArticlesList = cx( 'inside' );
		let content;

		if ( items.length ) {
			content = this.renderList();
		} else {
			if ( isFetching ) {
				content = this.renderSpinner();
			} else {
				content = ( <NothingFound /> );
			}
		}

		return (
			<div className={ clsArticlesList }>
				{ content }
				{ this.renderLoadMoreButton() }
			</div>
		);
	}
}

function mapStateToProps( state ) {
	return {
		scrollPos:  state.ui.articleListPosition,
		articles:   state.articles,
		unreadOnly: state.settings.unreadOnly
	};
}

export default connect( mapStateToProps )( ArticleList );
