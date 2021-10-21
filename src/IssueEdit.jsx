/** @format */

import React, { useState, useEffect, useContext } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Alert, Col, Form } from 'react-bootstrap'

import graphQLFetch from './graphQLFetch'
import NumInput from './NumInput.jsx'
import DateInput from './DateInput.jsx'
import TextInput from './TextInput.jsx'
import withToast from './withToast.jsx'
import store from './store'
import UserContext from './UserContext'

function IssueEdit({
	match: {
		params: { id },
	},
	match,
	showSuccess,
	showError,
}) {
	const user = useContext(UserContext)
	const [idState, setId] = useState(useParams().id || '')

	const [issue, setIssue] = useState(
		store.initialData ? store.initialData.issue : null
	)
	delete store.initialData
	const [showingValidation, setShowingValidation] = useState(false)
	const [invalidFields, setInvalidFields] = useState({})

	const loadData = async () => {
		const data = await IssueEdit.fetchData(match, null, showError)
		setIssue(data ? data.issue : {})
		setInvalidFields({})
	}

	useEffect(() => {
		setId(id)
	}, [id])

	useEffect(() => {
		if (issue == null) {
			loadData()
		}
	}, [idState])

	useEffect(() => {
		setId(idState)
	}, [idState])

	const handleSubmit = async (e) => {
		e.preventDefault()
		if (Object.keys(invalidFields).length !== 0) return

		const query = `
		mutation issueUpdate(
			$id: Int!
			$changes: IssueUpdateInputs!
		) {
			issueUpdate(
				id: $id
				changes: $changes
			) {
				id title status owner
				effort created due description
			}
		}`

		const { id, created, ...changes } = issue
		const data = await graphQLFetch(query, { changes, id })
		if (data) {
			const { issueUpdate } = data
			setIssue(issueUpdate)
			showSuccess('Updated issue successfully')
		}
	}

	const showValidation = () => setShowingValidation(true)
	const dismissValidation = () => setShowingValidation(false)
	const handleClick = (e) => {
		e.preventDefault()
		showValidation()
	}

	const onChange = (event, naturalValue) => {
		const { name, value: textValue } = event.target
		const value = naturalValue === undefined ? textValue : naturalValue
		setIssue({ ...issue, [name]: value })
	}

	const onValidityChange = (event, valid) => {
		const { name } = event.target
		setInvalidFields({ ...invalidFields, [name]: !valid })
		if (valid) delete invalidFields[name]
		return { invalidFields }
	}

	if (issue == null) return null
	const {
		id: idProps,
		title,
		status,
		owner,
		effort,
		created,
		due,
		description,
	} = issue

	let validationMessage
	if (Object.keys(invalidFields).length !== 0 && showingValidation) {
		validationMessage = (
			<Alert variant="danger" onDismiss={dismissValidation}>
				Please correct invalid fields before submitting.
			</Alert>
		)
	}

	return (
		<>
			<form onSubmit={handleSubmit}>
				{issue ? (
					<>
						<table>
							<tbody>
								<tr>
									<td>Created:</td>
									<td>{created ? created.toDateString() : ''}</td>
								</tr>
								<tr>
									<td>Status:</td>
									<td>
										<select name="status" value={status} onChange={onChange}>
											<option value="New">New</option>
											<option value="Assigned">Assigned</option>
											<option value="Fixed">Fixed</option>
											<option value="Closed">Closed</option>
										</select>
									</td>
								</tr>
								<tr>
									<td>Owner:</td>
									<td>
										<TextInput
											name="owner"
											value={owner}
											onChange={onChange}
											key={idProps}
										/>
									</td>
								</tr>
								<tr>
									<td>Effort: </td>
									<td>
										<NumInput
											name="effort"
											value={effort}
											onChange={onChange}
											key={idProps}
										/>
									</td>
								</tr>
								<tr>
									<td>Due:</td>
									<td>
										<DateInput
											name="due"
											value={due}
											onChange={onChange}
											onValidityChange={onValidityChange}
											key={idProps}
										/>
									</td>
								</tr>
								<tr>
									<td>Title:</td>
									<td>
										<TextInput
											size={50}
											name="title"
											value={title}
											onChange={onChange}
											key={idProps}
										/>
									</td>
								</tr>
								<tr>
									<td>Description:</td>
									<td>
										<TextInput
											tag="textarea"
											rows={8}
											cols={50}
											name="description"
											value={description}
											onChange={onChange}
											key={idProps}
										/>
									</td>
								</tr>
								<tr>
									<td />
									<td>
										<button type="submit" disabled={!user.signedIn}>
											Submit
										</button>
									</td>
								</tr>
							</tbody>
							<thead></thead>
						</table>
						<Form.Group>
							<Col sm={9}>{validationMessage}</Col>
						</Form.Group>
						<Link
							to={`/edit/${parseInt(id) - 1}`}
							onClick={(e) => parseInt(id) - 1 < 1 && handleClick(e)}
						>
							Prev
						</Link>
						{' | '}
						<Link to={`/edit/${parseInt(id) + 1}`}>Next</Link>
					</>
				) : (
					''
				)}
			</form>
		</>
	)
}

IssueEdit.fetchData = async (match, search, showError) => {
	const query = `query issue($id: Int!) {
		issue(id: $id) {
			id title status owner
			effort created due description
		}
	}`
	const {
		params: { id },
	} = match
	const result = await graphQLFetch(query, { id: parseInt(id, 10) }, showError)
	return result
}

const IssueEditWithToast = withToast(IssueEdit)
IssueEditWithToast.fetchData = IssueEdit.fetchData
export default IssueEditWithToast
