import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './UserFileManager.module.css';

const UserFileManager = ({ userId }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get(`https://your-api-url/admin/user/${userId}/files`, config);
        setFiles(response.data.files);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchFiles();
  }, [userId]);

  const deleteFile = async (fileId) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.delete(`https://your-api-url/admin/file/${fileId}`, config);
      const updatedFiles = files.filter(file => file.id !== fileId);
      setFiles(updatedFiles);
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return <p>Загрузка...</p>;
  }

  if (error) {
    return <p>Ошибка: {error}</p>;
  }

  return (
    <div className={styles['file-manager']}>
      <h2>Файлы пользователя</h2>
      <table>
        <thead>
          <tr>
            <th>Название файла</th>
            <th>Размер</th>
            <th>Дата загрузки</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {files.map(file => (
            <tr key={file.id}>
              <td>{file.name}</td>
              <td>{file.size} КБ</td>
              <td>{new Date(file.upload_date).toLocaleDateString()}</td>
              <td>
                <button onClick={() => deleteFile(file.id)}>Удалить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserFileManager;