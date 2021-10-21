import React, { createContext } from 'react'

const UserContext = createContext({
	signedIn: false,
})

export default UserContext
