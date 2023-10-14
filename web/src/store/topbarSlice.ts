import { StateCreator } from "zustand"

type GlobalKey =
    | 'addAssessment'

export interface TopbarAction {
    key: GlobalKey
    name: string
    actionFn: () => void
}

export interface TopbarSlice {
    actions: TopbarAction[]
    addAction: (action: TopbarAction) => void
    removeAction: (key: GlobalKey) => void
}

export const createTopbarSlice: StateCreator<TopbarSlice> = (set) => {
    return {
        actions: [],
        addAction: (action: TopbarAction) => set((state: TopbarSlice) => {
            if (state.actions.find(a => a.key == action.key)) {
                return {
                    actions: state.actions
                }
            }
            return {
                actions: [...state.actions, action]
            }
        }),
        removeAction: (key: GlobalKey) => set((state: TopbarSlice) => ({
            actions: state.actions.filter(a => a.key !== key)
        }))
    }
}