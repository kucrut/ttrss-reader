import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import { showSidebar, hideSidebar } from 'actions/ui';
import { selectArticle } from 'actions/articles';
import ArticleList from 'containers/ArticleList';
import MainIcon from 'components/MainIcon';
import Article from 'components/Article';
import ArticlePagination from 'components/ArticlePagination';

import styles from 'css/common/layout';
const cx = classNames.bind( styles );


class Main extends Component {
	static propTypes = {
		feeds:        PropTypes.object.isRequired,
		articles:     PropTypes.object.isRequired,
		noPagination: PropTypes.number.isRequired,
		dispatch:     PropTypes.func.isRequired
	}

	constructor( props ) {
		super( props );

		this.handleClickMain = this.handleClickMain.bind( this );
		this.handleClickPreviousNext = this.handleClickPreviousNext.bind( this );
	}

	componentWillMount() {
		this.toggleSidebar( this.props );
	}

	componentWillReceiveProps( nextProps ) {
		this.toggleSidebar( nextProps );
	}

	getSingleArticle() {
		const { items, currentIndex } = this.props.articles;

		return Object.assign({}, items[ currentIndex ], {
			hasPrev: 0 < currentIndex,
			hasNext: ( currentIndex + 1 ) < items.length
		});
	}

	toggleSidebar( props ) {
		const { feeds, articles, dispatch } = props;

		if ( articles.currentId || feeds.current.id ) {
			dispatch( hideSidebar() );
		} else {
			dispatch( showSidebar() );
		}
	}

	handleClickPreviousNext( next = true ) {
		const { articles, dispatch }  = this.props;
		const { currentIndex, items } = articles;
		const newIndex = next ? currentIndex + 1 : currentIndex - 1;
		const article  = items[ newIndex ];

		if ( article ) {
			dispatch( selectArticle( article.id ) );
		}
	}

	handleClickMain() {
		const { feeds, articles, dispatch } = this.props;

		if ( feeds.current.id || articles.currentId ) {
			dispatch( hideSidebar() );
		}
	}

	renderPagination() {
		let pagination;

		if ( 1 > this.props.noPagination ) {
			pagination = (
				<ArticlePagination prevNextCallback={ this.handleClickPreviousNext } />
			);
		}

		return pagination;
	}

	renderSingleArticle() {
		const article = this.getSingleArticle();
		const clsWrap = cx( ['single-article', 'inside'] );

		return (
			<div className={ clsWrap }>
				<Article
					key={ article.id }
					article={ article }
					isSingle={ true }
					mainContent={ this.refs.mainContent }
					prevNextCallback={ this.handleClickPreviousNext }
				/>
				{ this.renderPagination() }
			</div>
		);
	}

	render() {
		const { feeds, articles } = this.props;
		let content;

		if ( articles.currentId ) {
			content = this.renderSingleArticle();
		} else if ( feeds.current.id ) {
			content = ( <ArticleList feed={ feeds.current } mainContent={ this.refs.mainContent } /> );
		} else {
			content = ( <MainIcon /> );
		}

		return (
			<main onClick={ this.handleClickMain } className={ styles.content } ref="mainContent">
				{ content }
			</main>
		);
	}
}

function mapStateToProps( state ) {
	return {
		feeds:        state.feeds,
		articles:     state.articles,
		noPagination: state.settings.noPagination
	};
}

export default connect( mapStateToProps )( Main );
