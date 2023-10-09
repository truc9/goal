import {
    createContext,
    FC,
    ReactNode,
    useEffect,
    useState,
} from 'react'
import config from '../config'

interface BroadcastData {
    event: string
    payload: any
}

interface WebSocketContextValue {
    socket: WebSocket
    handleEvent: (event: string, callback: (data: BroadcastData) => void) => void
    send: (event: string, data?: any) => void
}

export const WebSocketContext = createContext<WebSocketContextValue>(null!)

export const WebSocketProvider: FC<{
    children: ReactNode
}> = ({ children }) => {
    const [socket, setSocket] = useState<WebSocket>(null!)

    useEffect(() => {
        createWebSocket()
    }, [])

    useEffect(() => {
        if (socket) {
            socket.onclose = () => {
                createWebSocket()
                console.warn(`${new Date()} Socket has been closed, re-establed connection.`)
            }
        }
    }, [socket])

    const createWebSocket = () => {
        const socket = new WebSocket(config.wsUrl)
        setSocket(socket)
    }

    const handleEvent = (event: string, callback: (data: BroadcastData) => void) => {
        socket.addEventListener("message", (message: MessageEvent<any>) => {
            const parsedData = JSON.parse(message.data)
            if (parsedData.event && parsedData.event.toLowerCase() === event.toLowerCase()) {
                callback({
                    event: parsedData.event,
                    payload: parsedData.payload
                })
            }
        })
    }

    const send = (event: string, payload?: any) => {
        socket.send(JSON.stringify({
            event,
            payload
        }))
    }

    return (
        <WebSocketContext.Provider value={{ socket, handleEvent, send }}>
            {children}
        </WebSocketContext.Provider>
    )
}

