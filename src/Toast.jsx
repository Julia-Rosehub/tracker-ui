/** @format */
import React, { useEffect } from 'react'
import { Alert, Collapse } from 'react-bootstrap'

function Toast({ showing, bsstyle, onDismiss, children }) {
	useEffect(() => {
		clearTimeout(dismissTimer)
		let dismissTimer = setTimeout(onDismiss, 5000)
		return () => clearTimeout(dismissTimer)
	}, [showing])

	return (
		<Collapse in={showing}>
			<div>
				<Alert variant={bsstyle} onClose={onDismiss}>
					{children}
				</Alert>
			</div>
		</Collapse>
	)
}

export default Toast
