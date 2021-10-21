/** @format */

import React, { useState } from 'react'

function NumInput({ value, onChange, ...props }) {
	const format = (num) => (num != null ? num.toString() : '')

	const unformat = (str) => {
		const val = parseInt(str, 10)
		return Number.isNaN(val) ? null : val
	}

	const [formattedValue, setFormattedValue] = useState(
		value ? format(value) : ''
	)

	const onChangeValue = ({ target }) => {
		if (target.value.match(/^\d*$/)) setFormattedValue(target.value)
	}

	const onBlur = (e) => {
		onChange(e, unformat(formattedValue))
	}

	return (
		<input
			type="text"
			{...props}
			value={formattedValue}
			onBlur={onBlur}
			onChange={onChangeValue}
		/>
	)
}

export default NumInput
