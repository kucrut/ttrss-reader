import React           from 'react'
import { hideSidebar } from '../actions/ui'

class MenuToggle extends React.Component {
	handleClickHide() {
		this.props.dispatch( hideSidebar() )
	}
}

export default ( MenuToggle )
