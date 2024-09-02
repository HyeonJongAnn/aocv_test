import React from 'react';
import '../../scss/pages/admin/AdminHome.scss';
import AdminMenu from '../ui/AdminMenu';

const AdminHome = () => {
    return (
        <div className="admin-home">
          <header>
            <AdminMenu />
          </header>
          <main>
            <h1>관리자 페이지</h1>
          </main>
        </div>
      );
    }
    
    export default AdminHome;