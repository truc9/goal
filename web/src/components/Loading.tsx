import { CircularProgress } from "@mui/material"

export const Loading = () => {
    return (
        <div className="tw-m-auto tw-flex tw-flex-col tw-items-center tw-w-full tw-h-full">
            <CircularProgress />
        </div>
    )
}