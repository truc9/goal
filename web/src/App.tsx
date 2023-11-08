import { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import RequireAuth from './components/RequireAuth'
import Layout from './containers/Layout'
import PageNotFound from './containers/PageNotFound'

const BookingOverview = lazy(() => import('./containers/Dashboard/BookingOverview'))
const BookingPeriods = lazy(() => import('./containers/BookingPeriods'))
const Home = lazy(() => import('./containers/Home'))
const Login = lazy(() => import('./containers/Login'))
const Register = lazy(() => import('./containers/Register'))
const AssessmentSetup = lazy(() => import('./containers/AssessmentSetup'))
const ASVersions = lazy(() => import('./containers/AssessmentSetup/Versions'))
const ASQuestions = lazy(() => import('./containers/AssessmentSetup/Questions'))
const Employees = lazy(() => import('./containers/Employees'))
const MyBooking = lazy(() => import('./containers/MyBooking'))
const MyAssessment = lazy(() => import('./containers/MyAssessment'))
const Questions = lazy(() => import('./containers/MyAssessment/Questions'))

function App() {
	return (
		<Routes>
			<Route
				path='/'
				element={
					<RequireAuth>
						<Layout />
					</RequireAuth>
				}>
				<Route index element={<Home />} />
				<Route path='my-booking' element={<MyBooking />} />
				<Route path='my-assessment' element={<MyAssessment />} />
				<Route path='my-assessment/:versionId' element={<Questions />} />
				<Route path='booking-periods' element={<BookingPeriods />} />
				<Route path='dashboard/booking-overview' element={<BookingOverview />} />
				<Route path='assessments' element={<AssessmentSetup />}>
					<Route path=':assessmentId' element={<ASVersions />}>
						<Route path='versions' element={<ASQuestions />}>
							<Route path=':versionId' element={<ASQuestions />} />
						</Route>
					</Route>
				</Route>
				<Route path='employees' element={<Employees />} />
				<Route path='*' element={<PageNotFound />} />
			</Route>
			<Route path='/login' element={<Login />}></Route>
			<Route path='/register' element={<Register />}></Route>
		</Routes>
	)
}

export default App
