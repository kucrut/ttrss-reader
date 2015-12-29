import React, { PropTypes }       from 'react'
import { connect }                from 'react-redux'
import classNames                 from 'classnames'
import _                          from 'lodash'
import { fetchFeedArticles }      from '../actions/articles'
import { setArticleListPosition } from '../actions/ui'
import Spinner                    from '../components/Spinner'
import Article                    from '../components/Article'
import FeedActions                from '../components/FeedActions'
import LoadMoreButton             from '../components/LoadMoreButton'

class ArticleList extends React.Component {
	fetchArticles( feed ) {
		this.props.dispatch( fetchFeedArticles( feed ) )
	}

	componentWillReceiveProps( nextProps ) {
		const { feed, articles, dispatch } = nextProps

		if ( feed.id !== this.props.feed.id && ! articles.isFetching ) {
			this.fetchArticles( feed )
		}
	}

	componentDidMount() {
		const { feed, articles, scrollPos } = this.props

		if ( ! articles.items.length ) {
			this.fetchArticles( feed )
		} else {
			if ( scrollPos.feedId === feed.id ) {
				document.getElementsByClassName( 'content' )[0].scrollTop = scrollPos.top
			}
		}
	}

	componentWillUnmount() {
		const { feed, dispatch } = this.props

		dispatch( setArticleListPosition({
			feedId: feed.id,
			top:    document.getElementsByClassName( 'content' )[0].scrollTop
		}) )
	}

	renderLoadMoreButton() {
		const { items, hasMore } = this.props.articles

		if ( items.length && hasMore ) {
			return (
				<LoadMoreButton { ...this.props } />
			)
		}
	}

	renderList() {
		const { items } = this.props.articles

		return (
			<div className="articles">
				{ items.map( article => (
					<Article key={ article.id } article={ article } isSingle={ false } />
				)) }
			</div>
		)
	}

	renderNoArticles() {
		return (
			<article className="nothing-found">
				<p><em>No articles found.</em></p>
			</article>
		)
	}

	renderSpinner() {
		return (
			<div className="main-init"><Spinner /></div>
		)
	}

	renderFeedActions() {
		if ( this.props.articles.items.length ) {
			return ( <FeedActions /> )
		}
	}

	render() {
		const { isFetching, items } = this.props.articles
		let content

		if ( items.length ) {
			content = this.renderList()
		} else {
			if ( isFetching ) {
				content = this.renderSpinner()
			} else {
				content = this.renderNoArticles()
			}
		}

		return (
			<div className="article-list inside">
				{ content }
				{ this.renderLoadMoreButton() }
			</div>
		)
	}
}

ArticleList.propTypes = {
	feed:       PropTypes.object.isRequired,
	scrollPos:  PropTypes.object.isRequired,
	articles:   PropTypes.object.isRequired,
	unreadOnly: PropTypes.number.isRequired,
	dispatch:   PropTypes.func.isRequired
}

function mapStateToProps( state ) {
	return {
		scrollPos:  state.ui.articleListPosition,
		articles:   state.articles,
		unreadOnly: state.settings.unreadOnly
	}
}

export default connect( mapStateToProps )( ArticleList )
