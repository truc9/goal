import { useParams } from 'react-router-dom'
import { PageContainer } from '../../components/PageContainer'
import { FiPenTool } from 'react-icons/fi'

const MyAssessmentDetails = () => {
	const params = useParams()

	console.log(params.versionId)

	return (
		<PageContainer
			icon={<FiPenTool />}
			title={`Doing Assessment ${params.versionId}`}></PageContainer>
	)
}

export default MyAssessmentDetails
