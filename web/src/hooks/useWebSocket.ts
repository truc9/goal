import { useContext } from 'react'

import { WebSocketContext } from '../context/WebSocketContext'

const useWebSocket = () => useContext(WebSocketContext)

export default useWebSocket