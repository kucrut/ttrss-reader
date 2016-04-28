import React, { PropTypes }  from 'react'
import _                     from 'lodash'
import { fetchFeedArticles } from '../actions/articles'
import Spinner               from './Spinner'

class LoadMoreButton extends React.Component {
	handleClick() {
		const { feed, articles, unreadOnly, dispatch } = this.props
		let skipNum

		if ( articles.isFetching ) {
			return
		}

		if ( unreadOnly && ! feed.is_cat ) {
			skipNum = _.filter( articles.items, { unread: true } ).length
		} else {
			skipNum = articles.items.length
		}

		dispatch( fetchFeedArticles( feed, false, {
			skip: skipNum
		}) )
	}

	renderIcon() {
		if ( this.props.articles.isFetching ) {
			return ( <Spinner /> )
		} else {
			return ( <i className="fa-cw" /> )
		}
	}

	render() {
		let icon  = this.renderIcon()
		let attrs = {}

		if ( this.props.articles.isFetching ) {
			attrs.disabled = 'disabled'
		}

		return (
			<p className="load-more-wrap"><button className="uk-button uk-button-large" { ...attrs } onClick={ this.handleClick.bind( this ) }>{ icon } Load More</button></p>
		)
	}
}

LoadMoreButton.propTypes = {
	feed:     PropTypes.object.isRequired,
	articles: PropTypes.object.isRequired,
	dispatch: PropTypes.func.isRequired
}

export default ( LoadMoreButton )
