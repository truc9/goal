import { FC, ReactNode, createContext, useEffect, useState } from "react"

interface BroadcastData {
    event: string
    payload: any
}

interface WebSocketContextValue {
    socket: WebSocket
    onMessage: (callback: (data: BroadcastData) => void) => void
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
            }
        }
    }, [socket])

    const createWebSocket = () => {
        const socket = new WebSocket(`ws://localhost:8000/ws`)
        setSocket(socket)
    }

    const onMessage = (callback: (data: BroadcastData) => void) => {
        socket.addEventListener("message", (message: MessageEvent<any>) => {
            const parsedData = JSON.parse(message.data)
            callback({
                event: parsedData.event,
                payload: parsedData.payload
            })
        })
    }

    const send = (event: string, payload?: any) => {
        socket.send(JSON.stringify({
            event,
            payload
        }))
    }

    return (
        <WebSocketContext.Provider value={{ socket, onMessage, send }}>
            {children}
        </WebSocketContext.Provider>
    )
}

