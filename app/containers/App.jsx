import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { checkLastSession } from 'actions/session';
import SettingsForm from 'containers/SettingsForm';
import SubscribeForm from 'containers/SubscribeForm';
import LoginForm from 'containers/LoginForm';
import Header from 'containers/Header';
import Sidebar from 'containers/Sidebar';
import Main from 'containers/Main';
import Alert from 'components/Alert';
import Spinner from 'components/Spinner';


class App extends React.Component {
	componentDidMount() {
		this.props.dispatch( checkLastSession() );
	}

	renderSpinner() {
		return (
			<div className="main-init"><Spinner /></div>
		);
	}

	render() {
		const { dispatch, session, isEditingSettings, isSubscribing } = this.props;
		const { isChecked, isAsking, url, sid } = session;

		let content;

		if ( url && sid ) {
			if ( isEditingSettings ) {
				content = (
					<div className="whole-wrap">
						<SettingsForm />
					</div>
				);
			} else {
				if ( isSubscribing ) {
					content = (
						<div className="whole-wrap">
							<SubscribeForm />
						</div>
					);
				} else {
					content = (
						<div className="whole-wrap">
							<Header />
							<Sidebar />
							<Main />
							<Alert />
						</div>
					);
				}
			}
		} else {
			if ( ! isChecked ) {
				content = this.renderSpinner();
			} else {
				content = (
					<div className="whole-wrap">
						<LoginForm dispatch={ dispatch } isAsking={ isAsking } />
						<Alert />
					</div>
				);
			}
		}

		return content;
	}
}

App.propTypes = {
	session:           PropTypes.object.isRequired,
	isSubscribing:     PropTypes.bool.isRequired,
	isEditingSettings: PropTypes.bool.isRequired,
	dispatch:          PropTypes.func.isRequired
};

function mapStateToProps( state ) {
	return {
		session:           state.session,
		isSubscribing:     state.subscription.isOpen,
		isEditingSettings: state.settings.isEditing
	};
}

export default connect( mapStateToProps )( App );
