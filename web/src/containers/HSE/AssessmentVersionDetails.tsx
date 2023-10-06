import { FiDownload, FiPlus } from "react-icons/fi"
import { PageContainer } from "../../components/PageContainer"

const AssessmentVersionDetails = () => {
    return (
        <PageContainer
            title="Assessment Questions"
            action={(
                <div className="tw-flex tw-items-center tw-gap-2">
                    <button className="btn-secondary"><FiPlus /> Create</button>
                    <button className="btn-secondary"><FiDownload /> PDF</button>
                </div>
            )}
            showGoBack
        >

        </PageContainer>
    )
}

export default AssessmentVersionDetails