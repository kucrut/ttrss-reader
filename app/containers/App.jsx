import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { sessionShape } from 'reducers/session';
import { getCategories } from 'actions/categories';
import { checkLastSession } from 'actions/session';
import { fetchUnreadCount } from 'actions/articles';
import { getCount } from 'helpers';
import classNames from 'classnames/bind';
import SettingsForm from 'containers/SettingsForm';
import SubscribeForm from 'containers/SubscribeForm';
import LoginForm from 'containers/LoginForm';
import Header from 'containers/Header';
import Sidebar from 'containers/Sidebar';
import Main from 'containers/Main';
import Alert from 'components/Alert';
import MainSpinner from 'components/MainSpinner';
import Helmet from 'react-helmet';

import 'css/common/normalize';
import 'css/common/base';
import 'css/common/typography';
import styles from 'css/common/layout';


class App extends React.Component {
	static propTypes = {
		session:           PropTypes.shape( sessionShape ).isRequired,
		unreadCount:       PropTypes.number.isRequired,
		refreshInterval:   PropTypes.number.isRequired,
		isSubscribing:     PropTypes.bool.isRequired,
		isEditingSettings: PropTypes.bool.isRequired,
		dispatch:          PropTypes.func.isRequired
	}

	constructor( props ) {
		super( props );

		this.state = { refreshInterval: 0 };
		this.refresher = null;
		this.updateCounts = this.updateCounts.bind( this );
	}

	componentDidMount() {
		this.props.dispatch( checkLastSession() );
	}

	componentWillReceiveProps( nextProps ) {
		const { session, refreshInterval } = nextProps;
		let newInterval;

		if ( session.url && session.sid ) {
			newInterval = refreshInterval;
		} else {
			newInterval = 0;
		}

		this.setState({ refreshInterval: newInterval });
	}

	componentDidUpdate() {
		this.updateRefresher();
	}

	updateCounts() {
		this.props.dispatch( fetchUnreadCount() );
		this.props.dispatch( getCategories() );
	}

	updateRefresher() {
		const { refreshInterval } = this.state;

		clearInterval( this.refresher );

		if ( 1 > refreshInterval ) {
			return;
		}

		this.refresher = setInterval( this.updateCounts, ( refreshInterval * 60 * 1000 ) );
		this.updateCounts();
	}

	renderApp( title ) {
		return (
			<div className={ styles.wholeWrap }>
				<Helmet title={ title } />
				<Header />
				<Sidebar />
				<Main />
				<Alert />
			</div>
		);
	}

	renderLoginForm( title ) {
		return (
			<div className={ styles.wholeWrap }>
				<Helmet title={ `Login « ${title}` } />
				<LoginForm dispatch={ dispatch } isAsking={ isAsking } />
				<Alert />
			</div>
		);
	}

	renderSettingsForm( title ) {
		return (
			<div className={ styles.wholeWrap }>
				<Helmet title={ `Settings « ${title}` } />
				<SettingsForm />
			</div>
		);
	}

	renderSubscribeForm( title ) {
		return (
			<div className={ styles.wholeWrap }>
				<Helmet title={ `Add Feed « ${title}` } />
				<SubscribeForm />
			</div>
		);
	}

	render() {
		const { dispatch, session, isEditingSettings, isSubscribing, unreadCount } = this.props;
		const { isChecked, isAsking, url, sid } = session;

		let title = 'Tiny Tiny RSS Reader';
		let content;

		if ( url && sid ) {
			// We have a valid Session ID.
			if ( isEditingSettings ) {
				content = this.renderSettingsForm( title );
			} else {
				if ( isSubscribing ) {
					content = this.renderSubscribeForm( title );
				} else {
					if ( 0 < unreadCount ) {
						title = `(${getCount( unreadCount )}) ${title}`;
					}

					content = this.renderApp( title );
				}
			}
		} else {
			if ( ! isChecked ) {
				// We're checking the last session.
				content = ( <MainSpinner /> );
			} else {
				content = this.renderLoginForm( title );
			}
		}

		return content;
	}
}

function mapStateToProps( state ) {
	return {
		session:           state.session,
		unreadCount:       state.articles.unread,
		refreshInterval:   state.settings.interval,
		isSubscribing:     state.subscription.isOpen,
		isEditingSettings: state.settings.isEditing
	};
}

export default connect( mapStateToProps )( App );
