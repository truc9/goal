import httpClient from "./httpClient"

function startAssignment(assignmentId: number) {
    return httpClient.put(`assignments/${assignmentId}/start`, {})
}

export default {
    startAssignment
}