import React, { PropTypes } from 'react'
import { connect }          from 'react-redux'
import { logsShape } from 'reducers/log';
import { removeLog }        from '../actions/log'

class Alert extends React.Component {
	static propTypes = {
		logs:     PropTypes.shape( logsShape ).isRequired,
		dispatch: PropTypes.func.isRequired
	}

	handleClick() {
		this.props.dispatch( removeLog() )
	}

	render() {
		const { item } = this.props.logs
		let message = ''
		let className = 'alert-error'

		if ( item.message ) {
			message    = item.message
			className += ' is-visible'
		}

		return (
			<div className={ className } onClick={ this.handleClick.bind( this ) }>
				<div className="inside">
					<p>{ message }</p>
				</div>
			</div>
		)
	}
}

export default connect( state => ({ logs: state.logs }) )( Alert )
