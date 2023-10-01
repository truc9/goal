import React from 'react'

import { FiTriangle } from 'react-icons/fi'
import { useParams } from 'react-router-dom'

import { PageContainer } from '../../components/PageContainer'

const HseDetails = () => {
    const { id } = useParams()

    return (
        <PageContainer title='HSE Details' icon={<FiTriangle />} showGoBack>
            <div>
                {id}
            </div>
        </PageContainer>
    )
}

export default HseDetails