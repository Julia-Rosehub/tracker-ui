/** @format */
import React, { useState } from 'react'
import Toast from './Toast.jsx'

function withToast(OriginalComponent) {
	return function ToastWrapper(props) {
		const [toastVisible, setToastVisible] = useState(false)
		const [toastMessage, setToastMessage] = useState('')
		const [toastType, setToastType] = useState('')

		const showSuccess = (message) => {
			setToastVisible(true)
			setToastMessage(message)
			setToastType('success')
		}

		const showError = (message) => {
			setToastVisible(true)
			setToastMessage(message)
			setToastType('danger')
		}

		const dismissToast = () => {
			setToastVisible(false)
		}
		return (
			<>
				<OriginalComponent
					showError={showError}
					showSuccess={showSuccess}
					dismissToast={dismissToast}
					{...props}
				/>
				<Toast
					bsstyle={toastType}
					showing={toastVisible}
					onDismiss={dismissToast}
				>
					{toastMessage}
				</Toast>
			</>
		)
	}
}

export default withToast
