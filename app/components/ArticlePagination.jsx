import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { selectArticle } from 'actions/articles';


class ArticlePagination extends React.Component {
	static propTypes = {
		articles:         PropTypes.object.isRequired,
		prevNextCallback: PropTypes.func.isRequired,
		dispatch:         PropTypes.func.isRequired
	}

	constructor( props ) {
		super( props );
		this.handleClickIndex = this.handleClickIndex.bind( this );
		this.handleClickNext = this.handleClickNext.bind( this );
		this.handleClickPrev = this.handleClickPrev.bind( this );
	}

	handleClickNext() {
		this.props.prevNextCallback( true );
	}

	handleClickPrev() {
		this.props.prevNextCallback( false );
	}

	handleClickIndex() {
		this.props.dispatch( selectArticle( '' ) );
	}

	maybeRenderPrevious() {
		const { articles } = this.props;
		let element;

		if ( 0 < articles.currentIndex ) {
			element = (
				<a onClick={ this.handleClickPrev }><i className="fa-angle-double-left" /> Previous</a>
			);
		}

		return element;
	}

	maybeRenderNext() {
		const { articles } = this.props;
		const { currentIndex, items } = articles;
		let element;

		if ( ( currentIndex + 1 ) < items.length ) {
			element = (
				<a onClick={ this.handleClickNext }>Next <i className="fa-angle-double-right" /></a>
			);
		}

		return element;
	}

	render() {
		return (
			<nav className="article-pagination">
				<span className="previous">{ this.maybeRenderPrevious() }</span>
				<span className="index"><a onClick={ this.handleClickIndex }>Index</a></span>
				<span className="next">{ this.maybeRenderNext() }</span>
			</nav>
		);
	}
}

export default connect( state => ({ articles: state.articles }) )( ArticlePagination );
