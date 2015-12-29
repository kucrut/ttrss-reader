import React, { PropTypes } from 'react'
import { connect }          from 'react-redux'
import { checkLastSession } from '../actions/session'
import SettingsForm         from './SettingsForm'
import LoginForm            from './LoginForm'
import Header               from './Header'
import Sidebar              from './Sidebar'
import Main                 from './Main'
import Alert                from '../components/Alert'
import Spinner              from '../components/Spinner'

class App extends React.Component {
	componentDidMount() {
		this.props.dispatch( checkLastSession() )
	}

	renderSpinner() {
		return (
			<div className="main-init"><Spinner /></div>
		)
	}

	render() {
		const { dispatch, session, isEditingSettings } = this.props
		const { isChecked, isAsking, url, sid } = session

		let content

		if ( url && sid ) {
			if ( isEditingSettings ) {
				content = (
					<div className="whole-wrap">
						<SettingsForm />
					</div>
				)
			} else {
				content = (
					<div className="whole-wrap">
						<Header />
						<Sidebar />
						<Main />
						<Alert />
					</div>
				)
			}
		} else {
			if ( ! isChecked ) {
				content = this.renderSpinner()
			} else {
				content = (
					<div className="whole-wrap">
						<LoginForm dispatch={ dispatch } isAsking={ isAsking } />
						<Alert />
					</div>
				)
			}
		}

		return content;
	}
};

App.propTypes = {
	session:           PropTypes.object.isRequired,
	isEditingSettings: PropTypes.bool.isRequired,
	dispatch:          PropTypes.func.isRequired
}

function mapStateToProps( state ) {
	return {
		session: state.session,
		isEditingSettings: state.settings.isEditing
	}
}

export default connect( mapStateToProps )( App )
