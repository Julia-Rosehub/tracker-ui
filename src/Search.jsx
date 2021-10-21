/** @format */

import React from 'react'
import AsyncSelect from 'react-select/async'
import { withRouter } from 'react-router-dom'

import graphQLFetch from './graphQLFetch'
import withToast from './withToast.jsx'

function Search({ showError, history }) {
	const onChangeSelection = ({ value }) => {
		history.push(`/edit/${value}`)
	}

	const loadOptions = async (inputValue) => {
		if (inputValue.length < 3) return []
		const query = `query issueList($search: String) {
      issueList(search: $search) {
        issues {id title}
      }
    }`

		const data = await graphQLFetch(query, { search: inputValue }, showError)
		return data.issueList.issues.map((issue) => ({
			label: `#${issue.id}: ${issue.title}`,
			value: issue.id,
		}))
	}

	return (
		<AsyncSelect
			instanceId="search-select"
			value=""
			loadOptions={loadOptions}
			onChange={onChangeSelection}
			components={{ DropdownIndicator: null }}
		/>
	)
}

export default withRouter(withToast(Search))
