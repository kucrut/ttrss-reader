import React, { PropTypes }             from 'react'
import { connect }                      from 'react-redux'
import classNames                       from 'classnames'
import { selectArticle, updateArticle } from '../actions/articles'
import { getArticleDate }               from '../helpers'
import Swipeable                        from 'react-swipeable'

class Article extends React.Component {
	constructor( props ) {
		super( props )
		this.state = {
			style: {
				left: 0
			}
		}
	}

	setLeftPos( n ) {
		this.setState({ style: { left: n + 'px' } })
	}

	slideElement( dir, n ) {
		const { hasPrev, hasNext } = this.props.article

		if ( 'left' === dir && hasNext ) {
			this.setLeftPos( n * -1 )
		} else if ( 'right' === dir && hasPrev ) {
			this.setLeftPos( n )
		}
	}

	handleSwiped( e, x ) {
		const { article, prevNextCallback } = this.props
		const { hasPrev, hasNext } = article

		if ( x < -123 && hasPrev ) { // Swipe right, get previous article
			prevNextCallback( false )
		} else if ( x > 123 && hasNext ) { // Swipe left, get next article
			prevNextCallback( true )
		} else {
			this.setLeftPos( 0 )
		}
	}

	handleClickAction( field, mode = 2 ) {
		const { article, dispatch } = this.props

		dispatch( updateArticle( article.id, field, mode ) );
	}

	handleClickTitle() {
		const { article, dispatch } = this.props

		dispatch( selectArticle( article.id ) )
	}

	scrollToTop() {
		document.getElementsByClassName( 'content' )[0].scrollTop = 0;
	}

	componentDidMount() {
		const { article, isSingle } = this.props

		if ( isSingle && article.unread ) {
			this.scrollToTop()
			this.handleClickAction( 'unread', 0 )
		}
	}

	componentWillReceiveProps() {
		this.setLeftPos( 0 )
	}

	componentDidUpdate( prevProps ) {
		if ( prevProps.article.id !== this.props.article.id ) {
			this.componentDidMount()
		}
	}

	getContent() {
		return { __html: this.props.article.content }
	}

	renderTitle() {
		const { article, isSingle } = this.props
		let title

		if ( isSingle ) {
			title = (
				<h1 className="article-title"><a href={ article.link } target="_blank">{ article.title }</a></h1>
			)
		} else {
			title = (
				<h2 className="article-title"><a onClick={ this.handleClickTitle.bind( this ) }>{ article.title }</a></h2>
			)
		}

		return title
	}

	renderContent() {
		if ( this.props.isSingle ) {
			return (
				<div className="article-content" dangerouslySetInnerHTML={ this.getContent() }/>
			)
		}
	}

	renderElement() {
		const { author, feed_title, updated, link, marked, unread } = this.props.article

		let articleClass = classNames({
			'is-read': ! unread
		})

		return (
			<article className={ articleClass } style={ this.state.style }>
				<header>
					{ this.renderTitle() }
					<p className="article-meta">By { author } on { getArticleDate( updated ) }</p>
				</header>

				{ this.renderContent() }
			</article>
		)
	}

	render() {
		const { isSingle, prevNextCallback } = this.props

		if ( isSingle ) {
			return (
				<Swipeable
					delta="1"
					onSwipingLeft={ ( e, x ) => this.slideElement( 'left', x ) }
					onSwipingRight={ ( e, x ) => this.slideElement( 'right', x ) }
					onSwipedLeft={ this.handleSwiped.bind( this ) }
					onSwipedRight={ this.handleSwiped.bind( this ) }>
					{ this.renderElement() }
				</Swipeable>
			)
		} else {
			return ( this.renderElement() )
		}
	}
}

Article.propTypes = {
	article:          PropTypes.object.isRequired,
	isSingle:         PropTypes.bool.isRequired,
	prevNextCallback: PropTypes.func
}

export default connect()( Article )
