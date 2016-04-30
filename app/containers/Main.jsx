import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { showSidebar } from 'actions/ui';
import { selectArticle } from 'actions/articles';
import ArticleList from 'containers/ArticleList';
import MenuToggle from 'mixins/MenuToggle';
import Article from 'components/Article';
import ArticlePagination from 'components/ArticlePagination';


class Main extends MenuToggle {
	static propTypes = {
		feeds:        PropTypes.object.isRequired,
		articles:     PropTypes.object.isRequired,
		noPagination: PropTypes.number.isRequired,
		dispatch:     PropTypes.func.isRequired
	}

	constructor( props ) {
		super( props );

		this.maybeHideSidebar = this.maybeHideSidebar.bind( this );
		this.handleClickHide = this.handleClickHide.bind( this );
		this.handleClickPreviousNext = this.handleClickPreviousNext.bind( this );
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

	getSingleArticle() {
		const { items, currentIndex } = this.props.articles;

		return Object.assign({}, items[ currentIndex ], {
			hasPrev: 0 < currentIndex,
			hasNext: ( currentIndex + 1 ) < items.length
		});
	}

	maybeShowSidebar( props ) {
		const { feeds, articles, dispatch } = props;

		if ( ! articles.currentId && ! feeds.current.id ) {
			dispatch( showSidebar() );
		}
	}

	maybeHideSidebar() {
		const { feeds, articles } = this.props;

		if ( feeds.current.id || articles.currentId ) {
			this.handleClickHide();
		}
	}

	componentWillReceiveProps( nextProps ) {
		this.maybeShowSidebar( nextProps );
	}

	componentWillMount() {
		this.maybeShowSidebar( this.props );
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
		let article = this.getSingleArticle();

		return (
			<div className="single-article inside">
				<Article
					key={ article.id }
					article={ article }
					isSingle={ true }
					prevNextCallback={ this.handleClickPreviousNext }
				/>
				{ this.renderPagination() }
			</div>
		);
	}

	renderIcon() {
		return (
			<div className="main-init inside"><i className="fa-rss" /></div>
		);
	}

	render() {
		const { feeds, articles } = this.props;
		let content;

		if ( articles.currentId ) {
			content = this.renderSingleArticle();
		} else if ( feeds.current.id ) {
			content = ( <ArticleList feed={ feeds.current } /> );
		} else {
			content = this.renderIcon();
		}

		return (
			<main onClick={ this.maybeHideSidebar } className="content">
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
