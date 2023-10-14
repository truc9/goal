import { create } from 'zustand'
import { TopbarSlice, createTopbarSlice } from './topbarSlice'
import { AssessmentSlice, createAssessmentSlice } from './assessmentSlice'

const useBeerStore = create<TopbarSlice & AssessmentSlice>()((...a) => ({
    ...createTopbarSlice(...a),
    ...createAssessmentSlice(...a),
}))

export default useBeerStore