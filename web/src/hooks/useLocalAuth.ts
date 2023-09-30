import { useContext } from 'react'

import { AuthContext } from '../context/AuthContext'

const useLocalAuth = () => useContext(AuthContext)

export default useLocalAuth