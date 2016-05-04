import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { updateArticle } from 'actions/articles';
import IconLink from 'components/IconLink';
import styles from 'css/containers/header';


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
		const starIcon  = marked ? 'star' : 'star-empty';
		const readIcon  = unread ? 'check-empty' : 'check';
		const readTitle = unread ? 'Mark as read' : 'Mark as unread';

		return (
			<div className={ styles.actions }>
				<IconLink title={ readTitle } type={ readIcon } handler={ this.toggleRead } />
				<IconLink title={ starTitle } type={ starIcon } handler={ this.toggleMarked } />
			</div>
		);
	}
}

export default connect()( ArticleActions );
