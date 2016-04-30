import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { selectFeed } from 'actions/feeds';
import { hideSidebar } from 'actions/ui';
import { getCount } from 'helpers';


class FeedItem extends React.Component {
	static propTypes = {
		feed:     PropTypes.object.isRequired,
		current:  PropTypes.object.isRequired,
		dispatch: PropTypes.func.isRequired
	}

	constructor( props ) {
		super( props );
		this.handleClick = this.handleClick.bind( this );
	}

	handleClick() {
		const { feed, current, dispatch } = this.props;

		if ( feed.id !== current.id ) {
			dispatch( hideSidebar() );
			dispatch( selectFeed( feed.id ) );
		}
	}

	renderCount() {
		const { feed } = this.props;
		let element;

		if ( 0 < feed.unread ) {
			element = (
				<span className="count">{ getCount( feed.unread ) }</span>
			);
		}

		return element;
	}

	render() {
		const { feed, current } = this.props;
		const isSelected = feed.id === current.id;

		let linkClass = classNames({
			current: isSelected
		});

		return (
			<li>
				<a onClick={ this.handleClick } className={ linkClass }>
					<i className="fa-rss-squared" />
					<span className="name text-truncate">{ feed.title }</span>
					{ this.renderCount() }
				</a>
			</li>
		);
	}
}

export default connect()( FeedItem );
