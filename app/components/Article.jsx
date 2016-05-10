import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { selectArticle, updateArticle } from 'actions/articles';
import { getArticleDate } from 'helpers';
import Swipeable from 'react-swipeable';
import Icon from 'components/Icon';
import styles from 'css/components/article';


class Article extends React.Component {
	static propTypes = {
		article:          PropTypes.object.isRequired,
		isSingle:         PropTypes.bool.isRequired,
		prevNextCallback: PropTypes.func,
		feed:             PropTypes.object.isRequired,
		mainContent:      PropTypes.element.isRequired,
		dispatch:         PropTypes.func.isRequired
	}

	constructor( props ) {
		super( props );

		this.state = {
			style: {
				left: 0
			}
		};

		this.handleSwiped = this.handleSwiped.bind( this );
		this.handleClickTitle = this.handleClickTitle.bind( this );
		this.handleClickAction = this.handleClickAction.bind( this );
		this.handleClickContent = this.handleClickContent.bind( this );
	}

	componentDidMount() {
		const { article, isSingle } = this.props;

		if ( isSingle && article.unread ) {
			this.scrollToTop();
			this.handleClickAction( 'unread', 0 );
		}
	}

	componentWillReceiveProps() {
		this.setLeftPos( 0 );
	}

	componentDidUpdate( prevProps ) {
		if ( prevProps.article.id !== this.props.article.id ) {
			this.componentDidMount();
		}
	}

	getContent() {
		return { __html: this.props.article.content };
	}

	setLeftPos( n ) {
		this.setState({ style: { left: `${n}px` } });
	}

	handleSwiped( e, x ) {
		const { article, prevNextCallback } = this.props;
		const { hasPrev, hasNext } = article;

		if ( -123 > x && hasPrev ) { // Swipe right, get previous article
			prevNextCallback( false );
		} else if ( 123 < x && hasNext ) { // Swipe left, get next article
			prevNextCallback( true );
		} else {
			this.setLeftPos( 0 );
		}
	}

	handleClickContent( e ) {
		if ( 'A' === e.target.nodeName ) {
			e.preventDefault();
			window.open( e.target.getAttribute( 'href' ) );
		}
	}

	handleClickAction( field, mode = 2 ) {
		const { article, dispatch } = this.props;

		dispatch( updateArticle( article.id, field, mode ) );
	}

	handleClickTitle() {
		const { article, dispatch } = this.props;

		dispatch( selectArticle( article.id ) );
	}

	scrollToTop() {
		this.props.mainContent.scrollTop = 0;
	}

	slideElement( dir, n ) {
		const { hasPrev, hasNext } = this.props.article;

		if ( 'left' === dir && hasNext ) {
			this.setLeftPos( n * -1 );
		} else if ( 'right' === dir && hasPrev ) {
			this.setLeftPos( n );
		}
	}

	renderFeedTitle() {
		const { isSingle, feed, article } = this.props;
		let element;

		if ( ! isSingle && ( feed.is_cat || 0 > feed.id ) ) {
			element = (
				<p className={ styles.articleMeta }>
					<Icon type="rss-squared" />
					{ article.feed_title }
				</p>
			);
		}

		return element;
	}

	renderTitle() {
		const { article, isSingle } = this.props;
		let title;

		if ( isSingle ) {
			title = (
				<h1 className={ styles.articleTitle }>
					<a href={ article.link } target="_blank">{ article.title }</a>
				</h1>
			);
		} else {
			title = (
				<h2 className={ styles.articleTitle }>
					<a onClick={ this.handleClickTitle }>{ article.title }</a>
				</h2>
			);
		}

		return title;
	}

	renderMeta() {
		const { author, updated } = this.props.article;
		let meta = getArticleDate( updated );

		if ( author ) {
			meta = `By ${author} on ${meta}`;
		}

		return (
			<p className={ styles.articleMeta }>{ meta }</p>
		);
	}

	renderContent() {
		let element;

		if ( this.props.isSingle ) {
			element = (
				<div
					className={ styles.articleContent }
					dangerouslySetInnerHTML={ this.getContent() }
					onClick={ this.handleClickContent }
				/>
			);
		}

		return element;
	}

	renderElement() {
		const clsArticle = classNames({
			[ styles.isRead ]: ! this.props.article.unread
		});

		return (
			<article className={ clsArticle } style={ this.state.style }>
				<header>
					{ this.renderTitle() }
					{ this.renderFeedTitle() }
					{ this.renderMeta() }
				</header>

				{ this.renderContent() }
			</article>
		);
	}

	render() {
		const { isSingle } = this.props;

		if ( isSingle ) {
			return (
				<Swipeable
					delta={ 1 }
					onSwipingLeft={ ( e, x ) => this.slideElement( 'left', x ) }
					onSwipingRight={ ( e, x ) => this.slideElement( 'right', x ) }
					onSwipedLeft={ this.handleSwiped }
					onSwipedRight={ this.handleSwiped }
				>{ this.renderElement() }</Swipeable>
			);
		}

		return ( this.renderElement() );
	}
}

function mapStateToProps( state ) {
	return {
		feed: state.feeds.current
	};
}

export default connect( mapStateToProps )( Article );
