import { FiBook, FiCloudOff, FiUserCheck } from "react-icons/fi"
import { ModuleCard } from "./ModuleCard"

const Home = () => {

    return (
        <div className="tw-grid tw-grid-cols-3 tw-gap-5">
            <ModuleCard title="Office Booking" subTitle="Booking when you go to office" icon={<FiCloudOff size={30} />} link="/office-booking" />
            <ModuleCard title="Project Management" subTitle="Manage your project" icon={<FiBook size={30} />} link="/projects" />
            <ModuleCard title="IAM" subTitle="Identity & Access Management" icon={<FiUserCheck size={30} />} link="/iam" />
        </div>
    )
}

export default Home