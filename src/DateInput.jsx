/** @format */

import React, { useState } from 'react'

const displayFormat = (date) => (date != null ? date.toDateString() : '')

const editFormat = (date) => {
	return date != null ? date.toISOString().substr(0, 10) : ''
}

const unformat = (str) => {
	const val = new Date(str)
	return Number.isNaN(val.getTime()) ? null : val
}

const DateInput = ({ value, onValidityChange, onChange, ...props }) => {
	const [formattedValue, setFormattedValue] = useState(
		value ? editFormat(value) : ''
	)
	const [focused, setFocused] = useState(false)
	const [valid, setValid] = useState(true)

	const onChangeValue = (e) => {
		if (e.target.value.match(/^[\d-]*$/)) setFormattedValue(e.target.value)
	}

	const onFocus = () => setFocused(true)
	const onBlur = (e) => {
		const dateValue = unformat(formattedValue)
		const newValid = formattedValue === ' ' || dateValue != null
		if (valid !== newValid && onValidityChange) {
			onValidityChange(e, newValid)
		}
		setFocused(false)
		setValid(true)
		if (newValid) onChange(e, dateValue)
	}

	const displayValue = focused || !valid ? formattedValue : displayFormat(value)
	return (
		<input
			type="text"
			{...props}
			value={displayValue}
			onFocus={onFocus}
			onBlur={onBlur}
			onChange={onChangeValue}
		/>
	)
}

export default DateInput
