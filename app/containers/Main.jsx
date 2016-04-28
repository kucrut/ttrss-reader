import React, { PropTypes } from 'react'
import { connect }          from 'react-redux'
import _                    from 'lodash'
import { showSidebar }      from '../actions/ui'
import { selectArticle }    from '../actions/articles'
import ArticleList          from './ArticleList'
import MenuToggle           from '../mixins/MenuToggle'
import Article              from '../components/Article'
import ArticlePagination    from '../components/ArticlePagination'

class Main extends MenuToggle {
	handleClickPreviousNext( next = true ) {
		const { articles, dispatch }  = this.props
		const { currentIndex, items } = articles

		let newIndex = next ? currentIndex + 1 : currentIndex - 1
		let article  = items[ newIndex ]

		if ( article ) {
			dispatch( selectArticle( article.id ) )
		}
	}

	getSingleArticle() {
		const { items, currentIndex } = this.props.articles

		return Object.assign( {}, items[ currentIndex ], {
			hasPrev: 0 < currentIndex,
			hasNext: ( currentIndex + 1 ) < items.length
		})
	}

	maybeShowSidebar( props ) {
		const { feeds, articles, dispatch } = props

		if ( ! articles.currentId && ! feeds.current.id ) {
			dispatch( showSidebar() )
		}
	}

	maybeHideSidebar() {
		const { feeds, articles } = this.props

		if ( feeds.current.id || articles.currentId ) {
			this.handleClickHide()
		}
	}

	componentWillReceiveProps( nextProps ) {
		this.maybeShowSidebar( nextProps )
	}

	componentWillMount() {
		this.maybeShowSidebar( this.props )
	}

	renderPagination() {
		if ( 1 > this.props.noPagination ) {
			return (
				<ArticlePagination prevNextCallback={ this.handleClickPreviousNext.bind( this ) } />
			)
		}
	}

	renderSingleArticle() {
		let article = this.getSingleArticle()

		return (
			<div className="single-article inside">
				<Article key={ article.id } article={ article } isSingle={ true } prevNextCallback={ this.handleClickPreviousNext.bind( this ) } />
				{ this.renderPagination() }
			</div>
		)
	}

	renderIcon() {
		return (
			<div className="main-init inside"><i className="fa-rss" /></div>
		)
	}

	render() {
		const { feeds, articles } = this.props
		let content

		if ( articles.currentId ) {
			content = this.renderSingleArticle()
		} else if ( feeds.current.id ) {
			content = ( <ArticleList feed={ feeds.current } /> )
		} else {
			content = this.renderIcon()
		}

		return (
			<main onClick={ this.maybeHideSidebar.bind( this ) } className="content">
				{ content }
			</main>
		)
	}
}

Main.propTypes = {
	feeds:        PropTypes.object.isRequired,
	articles:     PropTypes.object.isRequired,
	noPagination: PropTypes.number.isRequired,
	dispatch:     PropTypes.func.isRequired
}

function mapStateToProps( state ) {
	return {
		feeds:        state.feeds,
		articles:     state.articles,
		noPagination: state.settings.noPagination
	}
}

export default connect( mapStateToProps )( Main )
