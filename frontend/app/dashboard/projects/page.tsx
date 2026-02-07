'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import Layout from '@/components/Layout';
import { Card, Button, Input, TextArea } from '@/components/FormComponents';
import {
  getProjects,
  updateProject,
  deleteProject,
  syncProjects,
} from '@/lib/services';
import { Trash2, RefreshCw, Edit2 } from 'lucide-react';

interface Project {
  id: number;
  name: string;
  description?: string;
  url: string;
  status: 'deployed' | 'code_only' | 'in_progress';
  deployed_url?: string;
  languages?: Record<string, number>;
}

export default function ProjectsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Project>>({});

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      loadProjects();
    }
  }, [isAuthenticated, router]);

  const loadProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncProjects = async () => {
    setSyncing(true);
    try {
      await syncProjects();
      await loadProjects();
    } catch (error) {
      alert('Failed to sync projects');
    } finally {
      setSyncing(false);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setFormData(project);
  };

  const handleSave = async () => {
    if (!editingId) return;
    try {
      await updateProject(editingId, formData);
      await loadProjects();
      setEditingId(null);
      setFormData({});
    } catch (error) {
      alert('Failed to update project');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure?')) {
      try {
        await deleteProject(id);
        await loadProjects();
      } catch (error) {
        alert('Failed to delete project');
      }
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Projects</h1>
          <Button
            onClick={handleSyncProjects}
            disabled={syncing}
            className="flex items-center gap-2"
          >
            <RefreshCw size={18} />
            {syncing ? 'Syncing...' : 'Sync from GitHub'}
          </Button>
        </div>

        <div className="space-y-4">
          {projects.map((project) => {
            const displayStatus = project.deployed_url ? 'deployed' : project.status;

            return (
            <Card key={project.id}>
              {editingId === project.id ? (
                <div className="space-y-4">
                  <Input
                    label="Name"
                    value={formData.name || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                  <TextArea
                    label="Description"
                    value={formData.description || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Status</label>
                    <select
                      value={formData.status || 'code_only'}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value as Project['status'],
                        })
                      }
                      className="input-field"
                    >
                      <option value="deployed">Deployed</option>
                      <option value="code_only">Code Only</option>
                      <option value="in_progress">In Progress</option>
                    </select>
                  </div>
                  <Input
                    label="Deployed URL"
                    value={formData.deployed_url || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, deployed_url: e.target.value })
                    }
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleSave} variant="primary">
                      Save
                    </Button>
                    <Button onClick={() => setEditingId(null)} variant="secondary">
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-bold">{project.name}</h3>
                      {project.description && (
                        <p className="text-gray-600">{project.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEdit(project)}
                        variant="secondary"
                        className="p-2"
                      >
                        <Edit2 size={18} />
                      </Button>
                      <Button
                        onClick={() => handleDelete(project.id)}
                        variant="danger"
                        className="p-2"
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {displayStatus}
                      </span>
                      {project.languages && (
                        <div className="flex gap-2 mt-2">
                          {Object.keys(project.languages).map((lang) => (
                            <span
                              key={lang}
                              className="text-xs bg-gray-100 px-2 py-1 rounded"
                            >
                              {lang}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      View
                    </a>
                  </div>
                </>
              )}
            </Card>
            );
          })}
        </div>

        {projects.length === 0 && (
          <Card>
            <p className="text-gray-600 text-center">
              No projects yet. Click "Sync from GitHub" to import your repositories!
            </p>
          </Card>
        )}
      </div>
    </Layout>
  );
}
