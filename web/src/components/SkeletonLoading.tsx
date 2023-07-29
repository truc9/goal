import { Skeleton } from "@mui/material"
import React from "react"

interface Props {
    number: number
}

export const SkeletonLoading: React.FC<Props> = ({ number }) => {
    return Array.from(Array(number).keys()).map((item: any, index: any) => <Skeleton key={index} height={40} variant='rectangular' />)
}