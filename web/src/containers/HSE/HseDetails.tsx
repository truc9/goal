import { FiTriangle } from 'react-icons/fi'
import { useParams } from 'react-router-dom'
import { PageContainer } from '../../components/PageContainer'

const HseDetails = () => {
    const { id } = useParams()
    // const [versions, setVersions] = useState<number[]>([])

    return (
        <PageContainer
            title='HSE Details'
            icon={<FiTriangle />}
            action={(
                <div className='tw-flex tw-items-center tw-gap-2'>
                </div>
            )}
            showGoBack
        >
            <div>
                {id}
            </div>
        </PageContainer>
    )
}

export default HseDetails