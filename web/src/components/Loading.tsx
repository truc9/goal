import { RotateSpinner } from 'react-spinners-kit'

export const Loading = () => {
    return (
        <div className="tw-m-auto tw-flex tw-flex-col tw-items-center tw-w-full tw-h-full">
            <RotateSpinner size={40} color="#84cc16" />
        </div>
    )
}