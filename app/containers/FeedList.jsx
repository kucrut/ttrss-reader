import React, { PropTypes } from 'react'
import { connect }          from 'react-redux'
import classNames           from 'classnames'
import { fetchFeeds }       from '../actions/feeds'
import FeedItem             from '../components/FeedItem'
import Spinner              from '../components/Spinner'

class FeedList extends React.Component {
	static propTypes = {
		category: PropTypes.object.isRequired,
		feeds:    PropTypes.object.isRequired,
		dispatch: PropTypes.func.isRequired
	}

	getFeeds() {
		const { dispatch, category } = this.props

		dispatch( fetchFeeds( category ) )
	}

	componentDidMount() {
		this.getFeeds()
	}

	componentWillReceiveProps( nextProps ) {
		if ( nextProps.category.unread !== this.props.category.unread ) {
			this.getFeeds()
		}
	}

	renderSpinner() {
		return (
			<li className="placeholder"><Spinner /> Loading Feeds</li>
		)
	}

	renderNoFeed() {
		return (
			<li className="placeholder">No Feeds found.</li>
		)
	}

	renderList( items ) {
		const { current } = this.props.feeds

		return (
			items.map( feed => (
				<FeedItem key={ feed.id } feed={ feed } current={ current } />
			))
		)
	}

	render() {
		const { feeds, category } = this.props
		let key = 'c' + category.id

		let items = feeds.groups[ key ]
		let listItems

		if ( ! items ) {
			listItems = this.renderSpinner()
		} else {
			if ( items.length ) {
				listItems = this.renderList( items )
			} else {
				listItems = this.renderNoFeed()
			}
		}

		return (
			<ul className="feed-list">
				{ listItems }
			</ul>
		)
	}
}

export default connect( state => ({ feeds: state.feeds }) )( FeedList )
