import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import { updateArticle } from 'actions/articles';

import stlFa from 'css/common/fa';
import stlHeader from 'css/containers/header';
const styles = Object.assign({}, stlFa, stlHeader );
const cx = classNames.bind( styles );


class ArticleActions extends React.Component {
	static propTypes = {
		article:  PropTypes.object.isRequired,
		dispatch: PropTypes.func.isRequired
	}

	constructor( props ) {
		super( props );

		this.state = {
			unread: false,
			marked: false
		};

		this.toggleRead = this.toggleRead.bind( this );
		this.toggleMarked = this.toggleMarked.bind( this );
	}

	componentWillMount() {
		this.updateState( this.props );
	}

	componentWillReceiveProps( nextProps ) {
		this.updateState( nextProps );
	}

	handleClickAction( action ) {
		const { article, dispatch } = this.props;

		this.setState({ [ action ]: ! this.state[ action ] });
		dispatch( updateArticle( article.id, action, 2 ) );
	}

	toggleRead() {
		this.handleClickAction( 'unread' );
	}

	toggleMarked() {
		this.handleClickAction( 'marked' );
	}

	updateState( props ) {
		const { unread, marked } = props.article;

		this.setState({
			unread,
			marked
		});
	}

	render() {
		const { unread, marked } = this.state;

		const starTitle = marked ? 'Unstar' : 'Star';
		const starIcon  = cx({
			fa:              true,
			'fa-star':       marked,
			'fa-star-empty': ! marked
		});

		const readTitle = unread ? 'Mark as read' : 'Mark as unread';
		const readIcon  = cx({
			fa:               true,
			'fa-check-empty': unread,
			'fa-check':       ! unread
		});

		return (
			<div className={ stlHeader.actions }>
				<a onClick={ this.toggleRead } title={ readTitle } className={ readIcon } />
				<a onClick={ this.toggleMarked } title={ starTitle } className={ starIcon } />
			</div>
		);
	}
}

export default connect()( ArticleActions );
