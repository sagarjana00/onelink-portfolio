import { useState } from 'react';
import api from '../services/api';

function Dashboard() {
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('access_token');

  const handleSyncRepos = async () => {
    if (!token) {
      alert('Please log in first');
      return;
    }
    try {
      await api.post('/users/me/sync', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('GitHub repositories synced successfully!');
    } catch (err) {
      console.error(err);
      setMessage('Failed to sync repositories');
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      await api.post('/resume/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      alert('Resume uploaded successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to upload resume');
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-12">
      <h2 className="text-3xl font-bold mb-8">Dashboard</h2>

      <div className="space-y-8">
        <div>
          <button
            onClick={handleSyncRepos}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Sync My GitHub Repositories
          </button>
          {message && <p className="mt-4 text-green-600">{message}</p>}
        </div>

        <div>
          <label className="block text-lg font-medium mb-3">
            Upload your Resume (PDF only)
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleResumeUpload}
            className="block w-full text-sm text-gray-500
                       file:mr-4 file:py-3 file:px-6
                       file:rounded-lg file:border-0
                       file:text-sm file:font-semibold
                       file:bg-blue-50 file:text-blue-700
                       hover:file:bg-blue-100"
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;