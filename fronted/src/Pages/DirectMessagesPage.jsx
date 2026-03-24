import React from "react";
import { Outlet } from "react-router-dom";
import Start_Direct_Messages from "../../src/Components/workspace/Start_Direct_Messages.jsx";
import HeaderContent from "../Components/Content/HeaderContent";
import Workspace_members from "../Components/workspace/workspace_members";
import styles from "../Styles/DashBoardPage.module.css";
const LeftSidebar = React.memo(function LeftSidebar() {
 
 
  return (
    <aside className={styles.sidebar}>
      <Workspace_members />
     <Start_Direct_Messages/>
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