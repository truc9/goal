import { RotateSpinner } from 'react-spinners-kit'

export const Loading = () => {
  return (
    <div className="tw-m-auto tw-flex tw-h-full tw-w-full tw-flex-col tw-items-center">
      <RotateSpinner size={40} color="#84cc16" />
    </div>
  )
}
