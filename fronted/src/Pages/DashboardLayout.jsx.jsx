import React from "react";
import { Outlet } from "react-router-dom";
import SidebarChannels from "../Components/Channel/SidebarChannels.jsx";
import HeaderContent from "../Components/Content/HeaderContent";
import Workspace_members from "../Components/workspace/workspace_members";
import styles from "../Styles/DashBoardPage.module.css";

const LeftSidebar = React.memo(function LeftSidebar() {

  return (
    <aside className={styles.sidebar}>
      <Workspace_members />
     <SidebarChannels />
    </aside>
  );
});

 
export default function DashboardLayout() {
  return (
    <div className={styles.Page_container_dashboard}>
      <LeftSidebar />
      <main className={styles.screen_container}>
        <HeaderContent />
        <Outlet />
      </main>
    </div>
  );
}