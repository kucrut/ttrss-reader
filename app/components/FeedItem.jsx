import React, { PropTypes } from 'react'
import { connect }          from 'react-redux'
import classNames           from 'classnames'
import { selectFeed }       from '../actions/feeds'
import { hideSidebar }      from '../actions/ui'
import { getCount }         from '../helpers'

class FeedItem extends React.Component {
	static ppropTypes = {
		feed:     PropTypes.object.isRequired,
		current:  PropTypes.object.isRequired,
		dispatch: PropTypes.func.isRequired
	}

	handleClick() {
		const { feed, current, dispatch } = this.props;

		if ( feed.id !== current.id ) {
			dispatch( hideSidebar() )
			dispatch( selectFeed( feed.id ) )
		}
	}

	renderCount() {
		const { feed } = this.props

		if ( 0 < feed.unread ) {
			return (
				<span className="count">{ getCount( feed.unread ) }</span>
			)
		}
	}

	render() {
		const { feed, current } = this.props
		let isSelected = feed.id === current.id

		let linkClass = classNames({
			'current': isSelected
		})

		return (
			<li>
				<a onClick={ this.handleClick.bind( this ) } className={ linkClass }>
					<i className="fa-rss-squared" />
					<span className="name text-truncate">{ feed.title }</span>
					{ this.renderCount() }
				</a>
			</li>
		)
	}
}

export default connect()( FeedItem )
