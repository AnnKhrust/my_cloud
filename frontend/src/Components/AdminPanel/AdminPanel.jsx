import React from 'react';
import { useSelector } from 'react-redux';
import styles from './AdminDashboard.module.css'; 

import UserList from './UserList';
import UserFileManager from './UserFileManager';
import FileManager from './FileManager';

const AdminDashboard = () => {
  const currentUser = useSelector((state) => state.user.currentUser);

  return (
    <div className={styles['admin-dashboard']}>
      <UserList />
      <hr />
      <UserFileManager userId={currentUser?.id} />
      <FileManager />
    </div>
  );
};

export default AdminDashboard;