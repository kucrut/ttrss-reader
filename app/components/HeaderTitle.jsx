import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { selectArticle } from 'actions/articles';
import elementStyles from 'css/common/elements';
import headerStyles from 'css/containers/header';


class HeaderTitle extends Component {
	static propTypes = {
		feed:     PropTypes.object.isRequired,
		dispatch: PropTypes.func.isRequired
	}

	constructor( props ) {
		super( props );
		this.handleClick = this.handleClick.bind( this );
	}

	handleClick() {
		this.props.dispatch( selectArticle( '' ) );
	}

	renderAppTitle() {
		return (
			<span className={ headerStyles.title }>Tiny Tiny RSS Reader</span>
		);
	}

	renderFeedTitle() {
		const { feed } = this.props;
		const title = feed.is_cat ? feed.cat_title : feed.title;

		return (
			<a onClick={ this.handleClick } className={ headerStyles.title }>{ title }</a>
		);
	}

	render() {
		const title = this.props.feed.id ? this.renderFeedTitle() : this.renderAppTitle();

		return (
			<h2 className={ elementStyles[ 'text-truncate' ] }>{ title }</h2>
		);
	}
}

function mapStateToProps( state ) {
	return {
		feed: state.feeds.current
	};
}

export default connect( mapStateToProps )( HeaderTitle );
