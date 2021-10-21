/** @format */

import React, { useState, createElement } from 'react'

const format = (text) => (text != null ? text : ' ')
const unformat = (text) => (text.trim().length === 0 ? null : text)

function TextInput({ value, tag = 'input', onChange, ...props }) {
	const [formattedValue, setFormattedValue] = useState(format(value))

	const onChangeValue = ({ target }) => {
		setFormattedValue(target.value)
	}

	const onBlur = (e) => {
		onChange(e, unformat(formattedValue))
	}

	return createElement(tag, {
		value: formattedValue,
		onBlur,
		onChange: onChangeValue,
		...props,
	})
}

export default TextInput
