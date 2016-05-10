import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import HeaderTitle from 'components/HeaderTitle';
import MenuToggle from 'components/MenuToggle';
import FeedActions from 'components/FeedActions';
import ArticleActions from 'components/ArticleActions';

import stlElements from 'css/common/elements';
import stlHeader from 'css/containers/header';
const styles = Object.assign({}, stlElements, stlHeader );


class Header extends React.Component {
	static propTypes = {
		feedId: PropTypes.oneOfType( [
			PropTypes.string,
			PropTypes.number
		] ).isRequired,
		articleId: PropTypes.PropTypes.oneOfType( [
			PropTypes.string,
			PropTypes.number
		] ).isRequired,
	}

	renderActions() {
		const { feedId, articleId } = this.props;
		let actions;

		if ( articleId ) {
			actions = ( <ArticleActions /> );
		} else if ( feedId ) {
			actions = ( <FeedActions /> );
		}

		return actions;
	}

	render() {
		return (
			<div className={ styles.head }>
				<div className={ styles.feedTitle }>
					<MenuToggle />
					<HeaderTitle />
				</div>

				{ this.renderActions() }
			</div>
		);
	}
}

function mapStateToProps( state ) {
	return {
		feedId:    state.feeds.current.id,
		articleId: state.articles.currentId,
	};
}

export default connect( mapStateToProps )( Header );
