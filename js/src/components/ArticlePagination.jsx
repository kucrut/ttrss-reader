import React, { PropTypes } from 'react'
import { connect }          from 'react-redux'
import { selectArticle }    from '../actions/articles'

class ArticlePagination extends React.Component {
	handleClickIndex() {
		this.props.dispatch( selectArticle( '' ) )
	}

	maybeRenderPrevious() {
		const { articles, prevNextCallback } = this.props

		if ( 0 < articles.currentIndex ) {
			return (
				<a onClick={ () => prevNextCallback( false ) } className="previous"><i className="fa-angle-double-left" /> Previous</a>
			)
		}
	}

	maybeRenderNext() {
		const { articles, prevNextCallback } = this.props
		const { currentIndex, items } = articles

		if ( ( currentIndex + 1 ) < items.length ) {
			return (
				<a onClick={ () => prevNextCallback( true ) } className="next">Next <i className="fa-angle-double-right" /></a>
			)
		}
	}

	render() {
		return (
			<nav className="article-pagination">
				{ this.maybeRenderPrevious() }
				<a onClick={ this.handleClickIndex.bind( this ) }>Index</a>
				{ this.maybeRenderNext() }
			</nav>
		)
	}
}

ArticlePagination.propTypes = {
	articles: PropTypes.object.isRequired,
	prevNextCallback: PropTypes.func.isRequired
}

export default connect( state => ({ articles: state.articles }) )( ArticlePagination )
