import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";

const LoginPage = lazy(() => import("../src/Pages/LoginPage"));
const DashboardLayout = lazy(() => import("../../fronted/src/Pages/DashboardLayout.jsx"));
const DirectMessage = lazy(() => import("../src/Components/Content/DirectMessage"));
const GroupMessages = lazy(() => import("../src/Components/Content/GroupMessages"));
const DirectMessagesPage = lazy(() => import("../src/Pages/DirectMessagesPage"));
const SettingsPage = lazy(() => import("../src/Pages/SettingPage.jsx"));
export default function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<div>Selecciona una conversación</div>} />



          <Route path="channel/:groupid" element={<GroupMessages />} />
          <Route path="channel/:groupid/:channelid" element={<GroupMessages />} />

        </Route>




        <Route path="/dashboard/@me" element={<DirectMessagesPage />}>
          <Route index element={<div>Selecciona una conversación</div>} />

          <Route path="message/:senderid" element={<DirectMessage />} />


        </Route>
          <Route path="/dashboard/settings" element={<SettingsPage />} />



      </Routes>
    </Suspense>
  );
}