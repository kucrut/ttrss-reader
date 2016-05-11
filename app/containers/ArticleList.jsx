import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchFeedArticles } from 'actions/articles';
import { setArticleListPosition } from 'actions/ui';
import Article from 'components/Article';
import FeedActions from 'components/FeedActions';
import NothingFound from 'components/NothingFound';
import LoadMoreButton from 'components/LoadMoreButton';
import MainSpinner from 'components/MainSpinner';
import styles from 'css/containers/article-list';


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
			if ( mainContent && scrollPos.feedId === feed.id ) {
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

		return (
			<div className={ styles.articles }>
				{ items.map( article => (
					<Article key={ article.id } article={ article } isSingle={ false } />
				) ) }
			</div>
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
		let content;

		if ( items.length ) {
			content = this.renderList();
		} else {
			if ( isFetching ) {
				content = ( <MainSpinner /> );
			} else {
				content = ( <NothingFound /> );
			}
		}

		return (
			<div className={ styles.inside }>
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
