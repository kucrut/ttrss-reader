import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import { logsShape } from 'reducers/log';
import { removeLog } from 'actions/log';
import styles from 'css/components/alert';

const cx = classNames.bind( styles );


class Alert extends React.Component {
	static propTypes = {
		logs:     PropTypes.shape( logsShape ).isRequired,
		dispatch: PropTypes.func.isRequired
	}

	constructor( props ) {
		super( props );
		this.handleClick = this.handleClick.bind( this );
	}

	handleClick() {
		this.props.dispatch( removeLog() );
	}

	render() {
		const { item } = this.props.logs;
		let cls;
		let msg;

		if ( item.message ) {
			cls = cx( ['alertError', 'isVisible'] );
			msg = item.message;
		} else {
			cls = cx( 'alertError' );
			msg = '';
		}

		return (
			<div className={ cls } onClick={ this.handleClick }>
				<div className={ styles.inside }>
					<p>{ msg }</p>
				</div>
			</div>
		);
	}
}

function mapStateToProps( state ) {
	return {
		logs: state.logs
	};
}

export default connect( mapStateToProps )( Alert );
