import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import CustomerManagement from "../users/CustomerManagement";
import ItemManagement from "../tasks/ItemManagement";
import {CheckSquare, Users} from "lucide-react";
import {navItemsTypes} from "../common-types/CommonTypes";
import Sidebar from "../../layout/Sidebar";
import Header from "../../layout/Header";

const AdminDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

    const navItems:navItemsTypes[] = [
        {
            title: "Customer Management",
            icon: <Users size={24}/>,
            path: "/admin/customers",
        },
        {
            title: "Item Management",
            icon: <CheckSquare size={24}/>,
            path: "/admin/items",
        },
        {
            title: "Order Management",
            icon: <CheckSquare size={24}/>,
            path: "/admin/orders",
        },
    ];

  return (
    <div className="flex h-screen bg-background">
        {/* Sidebar */}
      <Sidebar collapsed={sidebarCollapsed} onToggleCollapse={toggleSidebar} navItems={navItems}/>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
       <Header sidebarCollapsed={sidebarCollapsed} headerText="Admin Dashboard"/>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Routes>
            <Route path="/customers" element={<CustomerManagement />} />
            <Route path="/items" element={<ItemManagement />} />
            <Route path="/orders" element={<ItemManagement />} />
            <Route path="/" element={<Navigate to="/admin/customers" replace />} />
            <Route path="*" element={<Navigate to="/admin/customers" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
