import { FC, ReactNode, createContext, useEffect, useState } from "react"

interface WebSocketContextValue {
    socket: WebSocket
    onMessage: (callback: (data: any) => void) => void
    send: (data: any) => void
}

export const WebSocketContext = createContext<WebSocketContextValue>(null!)

export const WebSocketProvider: FC<{
    children: ReactNode
}> = ({ children }) => {
    const [socket, setSocket] = useState<WebSocket>(null!)

    useEffect(() => {
        const socket = new WebSocket(`ws://localhost:8000/ws`)
        setSocket(socket)
    }, [])

    const onMessage = (callback: (data: any) => void) => {
        socket.addEventListener("message", (message: MessageEvent<any>) => {
            callback(message.data)
        })
    }

    const send = (data: any) => {
        socket.send(data)
    }

    return (
        <WebSocketContext.Provider value={{ socket, onMessage, send }}>
            {children}
        </WebSocketContext.Provider>
    )
}

