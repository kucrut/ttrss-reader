import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { selectArticle } from 'actions/articles';
import Icon from 'components/Icon';
import styles from 'css/components/article-pagination';


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
				<a onClick={ this.handleClickPrev }><Icon type="angle-double-left" /> Previous</a>
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
				<a onClick={ this.handleClickNext }>Next <Icon type="angle-double-right" /></a>
			);
		}

		return element;
	}

	render() {
		return (
			<nav className={ styles.articlePagination }>
				<span className={ styles.previous }>{ this.maybeRenderPrevious() }</span>
				<span className={ styles.index }><a onClick={ this.handleClickIndex }>Index</a></span>
				<span className={ styles.next }>{ this.maybeRenderNext() }</span>
			</nav>
		);
	}
}

export default connect( state => ({ articles: state.articles }) )( ArticlePagination );
