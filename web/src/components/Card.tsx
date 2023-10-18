import { FC, ReactNode } from 'react'

interface Props {
  children: ReactNode
  title?: string
}

export const Card: FC<Props> = ({ children, title }) => {
  return (
    <div className="tw-flex tw-flex-col tw-items-center tw-gap-3 tw-rounded tw-border tw-bg-slate-50 tw-p-5 tw-text-center tw-text-slate-500">
      <div className="tw-flex tw-flex-1 tw-flex-col tw-items-center tw-justify-center">
        {children}
      </div>
      <div className="tw-font-bold">{title}</div>
    </div>
  )
}
