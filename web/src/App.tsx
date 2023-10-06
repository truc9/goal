import { lazy } from 'react'

import {
  Route,
  Routes,
} from 'react-router-dom'

import RequireAuth from './components/RequireAuth'
import Layout from './containers/Layout'
import PageNotFound from './containers/PageNotFound'

const MyBooking = lazy(() => import('./containers/MyBooking'))
const BookingDashboard = lazy(() => import('./containers/BookingDashboard'))
const BookingPeriods = lazy(() => import('./containers/BookingPeriods'))
const Home = lazy(() => import("./containers/Home"))
const Login = lazy(() => import('./containers/Login'))
const Register = lazy(() => import('./containers/Register'))
const Hse = lazy(() => import('./containers/HSE'))
const AssessmentVersions = lazy(() => import('./containers/HSE/AssessmentVersions'))
const AssessmentQuestionSetup = lazy(() => import('./containers/HSE/AssessmentQuestionSetup'))

function App() {
  return (
    <Routes>
      <Route path="/" element={
        <RequireAuth>
          <Layout />
        </RequireAuth>
      }>
        <Route index element={<Home />} />
        <Route path='my-booking' element={<MyBooking />} />
        <Route path='booking-periods' element={<BookingPeriods />} />
        <Route path='booking-dashboard' element={<BookingDashboard />} />
        <Route path='hse' element={<Hse />} />
        <Route path='hse/:id' element={<AssessmentVersions />} />
        <Route path='hse/:id/versions/:versionId' element={<AssessmentQuestionSetup />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
      <Route path='/login' element={<Login />}></Route>
      <Route path='/register' element={<Register />}></Route>
    </Routes>
  )
}

export default App
