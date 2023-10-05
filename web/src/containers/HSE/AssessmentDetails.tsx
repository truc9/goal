import { FiArrowRightCircle, FiList } from 'react-icons/fi'
import { Link, useParams } from 'react-router-dom'
import { PageContainer } from '../../components/PageContainer'
import { useEffect, useState } from 'react'
import httpClient from '../../services/httpClient'
import { AssessmentVersionModel } from './models/AssessmentVersionModel'

const AssessmentDetails = () => {
    const { id } = useParams()
    const [versions, setVersions] = useState<AssessmentVersionModel[]>([])

    useEffect(() => {
        if (id) {
            (async () => {
                const versions = await httpClient.get<AssessmentVersionModel[]>(`assessments/${id}/versions`)
                setVersions(versions)
            })()
        }
    }, [id])

    return (
        <PageContainer
            title='Assessment Verions'
            showGoBack
        >
            <div className='tw-flex tw-items-center tw-justify-center'>
                {versions.map((v, i) => {
                    return (
                        <Link to={`versions/${v.version}`} key={i} className='tw-transition-all tw-h-14 hover:tw-bg-slate-200 lg:tw-w-1/2 tw-w-full tw-rounded tw-px-5 tw-items-center tw-flex tw-bg-slate-100 tw-justify-between tw-border'>
                            <span className='tw-flex tw-items-center tw-gap-2'><FiList /> Version {v.version}</span>
                            <FiArrowRightCircle size={26} />
                        </Link>
                    )
                })}
            </div>
        </PageContainer>
    )
}

export default AssessmentDetails