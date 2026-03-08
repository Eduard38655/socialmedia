
import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
const LoginPage = lazy(() => import("../../fronted/src/Pages/LoginPage"));
const DashBoardPage = lazy(() => import("../../fronted/src/Pages/DashBoardPage"));
function App() {


  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path='/' element={<LoginPage />} />
          <Route path='/DashBoard' element={<DashBoardPage />} />
        </Routes>
      </Suspense>
    </>
  )
}

export default App
