import { create } from 'zustand'

type ActionKey =
    | 'addAssessment'

export interface GlobalAction {
    key: ActionKey
    name: string
    actionFn: () => void
}

interface GlobalState {
    actions: GlobalAction[]
    addGlobalAction: (action: GlobalAction) => void
    removeGlobalAction: (key: ActionKey) => void
}

const useBearStore = create<GlobalState>()((set) => ({
    actions: [],
    addGlobalAction: (action: GlobalAction) => set((state) => {
        if (state.actions.find(a => a.key == action.key)) {
            return {
                actions: state.actions
            }
        }

        return {
            actions: [...state.actions, action]
        }
    }),
    removeGlobalAction: (key: ActionKey) => set((state) => ({
        actions: state.actions.filter(a => a.key !== key)
    }))
}))

export default useBearStore