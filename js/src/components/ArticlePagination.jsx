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
				<a onClick={ () => prevNextCallback( false ) }><i className="fa-angle-double-left" /> Previous</a>
			)
		}
	}

	maybeRenderNext() {
		const { articles, prevNextCallback } = this.props
		const { currentIndex, items } = articles

		if ( ( currentIndex + 1 ) < items.length ) {
			return (
				<a onClick={ () => prevNextCallback( true ) }>Next <i className="fa-angle-double-right" /></a>
			)
		}
	}

	render() {
		return (
			<nav className="article-pagination">
				<span className="previous">{ this.maybeRenderPrevious() }</span>
				<span className="index"><a onClick={ this.handleClickIndex.bind( this ) }>Index</a></span>
				<span className="next">{ this.maybeRenderNext() }</span>
			</nav>
		)
	}
}

ArticlePagination.propTypes = {
	articles: PropTypes.object.isRequired,
	prevNextCallback: PropTypes.func.isRequired
}

export default connect( state => ({ articles: state.articles }) )( ArticlePagination )
