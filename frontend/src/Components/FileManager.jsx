import { useState, useEffect } from 'react';
import axios from 'axios';

const FileManager = ({ userId }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get(`/api/files${userId ? `?user_id=${userId}` : ''}`, config);
        setFiles(response.data.files);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchFiles();
  }, [userId]);

  const uploadFile = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('comment', comment);

      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      };

      setUploading(true);
      const response = await axios.post('/api/upload', formData, config);
      setFiles([...files, response.data.file]);
      setSelectedFile(null);
      setComment('');
      setUploading(false);
    } catch (error) {
      setError(error.message);
      setUploading(false);
    }
  };

  const deleteFile = async (fileId) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.delete(`/api/files/${fileId}`, config);
      const updatedFiles = files.filter(file => file.id !== fileId);
      setFiles(updatedFiles);
    } catch (error) {
      setError(error.message);
    }
  };

  const renameFile = async (fileId, newName) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.patch(`/api/files/${fileId}/rename`, { new_name: newName }, config);
      const updatedFiles = files.map(file => {
        if (file.id === fileId) {
          return { ...file, name: newName };
        }
        return file;
      });
      setFiles(updatedFiles);
    } catch (error) {
      setError(error.message);
    }
  };

  const copyShareLink = (fileId) => {
    navigator.clipboard.writeText(`${window.location.origin}/share/${fileId}`);
    alert('Ссылка скопирована в буфер обмена');
  };

  if (loading) {
    return <p>Загрузка...</p>;
  }

  if (error) {
    return <p>Ошибка: {error}</p>;
  }

  return (
    <div className="file-manager">
      <h2>Управление файловым хранилищем</h2>
      <table>
        <thead>
          <tr>
            <th>Имя файла</th>
            <th>Комментарий</th>
            <th>Размер</th>
            <th>Дата загрузки</th>
            <th>Дата последнего скачивания</th>
            <th>Операции</th>
          </tr>
        </thead>
        <tbody>
          {files.map(file => (
            <tr key={file.id}>
              <td>{file.name}</td>
              <td>{file.comment}</td>
              <td>{file.size} КБ</td>
              <td>{new Date(file.upload_date).toLocaleDateString()}</td>
              <td>{file.last_download ? new Date(file.last_download).toLocaleDateString() : '-'}</td>
              <td>
                <button onClick={() => deleteFile(file.id)}>Удалить</button>
                <button onClick={() => renameFile(file.id, prompt('Введите новое имя файла'))}>Переименовать</button>
                <button onClick={() => copyShareLink(file.id)}>Копировать ссылку</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <form onSubmit={uploadFile}>
        <label htmlFor="file">Выберите файл для загрузки:</label>
        <input type="file" id="file" onChange={(e) => setSelectedFile(e.target.files[0])} required />
        <label htmlFor="comment">Комментарий:</label>
        <textarea id="comment" rows="3" value={comment} onChange={(e) => setComment(e.target.value)} />
        <button disabled={uploading}>Загрузить</button>
      </form>
    </div>
  );
};

export default FileManager;