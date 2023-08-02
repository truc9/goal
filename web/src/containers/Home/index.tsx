import { PageContainer } from "../../components/PageContainer"
import { ModuleCard } from "./ModuleCard"
import { IoBook, IoCompass, IoGrid, IoPersonAdd } from "react-icons/io5"

const Home = () => {

    return (
        <PageContainer icon={<IoGrid size={26} />} title="Apps">
            <div className="tw-grid tw-grid-cols-3 tw-gap-5">
                <ModuleCard title="My Booking" subTitle="Booking when you go to office" icon={<IoBook size={30} />} link="/office-booking" />
                <ModuleCard title="Project Management" subTitle="Manage your project" icon={<IoCompass size={30} />} link="/projects" />
                <ModuleCard title="IAM" subTitle="Identity & Access Management" icon={<IoPersonAdd size={30} />} link="/iam" />
            </div>
        </PageContainer>
    )
}

export default Home