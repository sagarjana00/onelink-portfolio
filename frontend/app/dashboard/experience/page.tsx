'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import Layout from '@/components/Layout';
import { Card, Button, Input, TextArea } from '@/components/FormComponents';
import {
  getExperiences,
  addExperience,
  updateExperience,
  deleteExperience,
} from '@/lib/services';
import { Plus, Edit2, Trash2 } from 'lucide-react';

interface Experience {
  id: number;
  title: string;
  company: string;
  start_date: string;
  end_date?: string;
  description?: string;
}

export default function ExperiencePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Experience>>({});

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      loadExperiences();
    }
  }, [isAuthenticated, router]);

  const loadExperiences = async () => {
    try {
      const data = await getExperiences();
      setExperiences(data);
    } catch (error) {
      console.error('Failed to load experiences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (exp: Experience) => {
    setEditingId(exp.id);
    setFormData(exp);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.company || !formData.start_date) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      if (editingId) {
        await updateExperience(editingId, formData);
      } else {
        await addExperience(formData);
      }
      await loadExperiences();
      resetForm();
    } catch (error) {
      alert('Failed to save experience');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure?')) {
      try {
        await deleteExperience(id);
        await loadExperiences();
      } catch (error) {
        alert('Failed to delete experience');
      }
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setShowForm(false);
    setFormData({});
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
          <h1 className="text-3xl font-bold">Work Experience</h1>
          <Button
            onClick={() => {
              resetForm();
              setShowForm(!showForm);
            }}
            className="flex items-center gap-2"
          >
            <Plus size={18} />
            Add Experience
          </Button>
        </div>

        {showForm && (
          <Card className="mb-8">
            <Input
              label="Job Title *"
              value={formData.title || ''}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g., Senior Developer"
              required
            />
            <Input
              label="Company *"
              value={formData.company || ''}
              onChange={(e) =>
                setFormData({ ...formData, company: e.target.value })
              }
              placeholder="e.g., Acme Corp"
              required
            />
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Start Date *"
                type="date"
                value={formData.start_date || ''}
                onChange={(e) =>
                  setFormData({ ...formData, start_date: e.target.value })
                }
                required
              />
              <Input
                label="End Date"
                type="date"
                value={formData.end_date || ''}
                onChange={(e) =>
                  setFormData({ ...formData, end_date: e.target.value })
                }
              />
            </div>
            <TextArea
              label="Description"
              value={formData.description || ''}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
            />
            <div className="flex gap-2">
              <Button onClick={handleSave} variant="primary">
                {editingId ? 'Update' : 'Add'} Experience
              </Button>
              <Button onClick={resetForm} variant="secondary">
                Cancel
              </Button>
            </div>
          </Card>
        )}

        <div className="space-y-4">
          {experiences.map((exp) => (
            <Card key={exp.id}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-bold">{exp.title}</h3>
                  <p className="text-gray-600">{exp.company}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(exp.start_date).toLocaleDateString()} -{' '}
                    {exp.end_date ? new Date(exp.end_date).toLocaleDateString() : 'Present'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleEdit(exp)}
                    variant="secondary"
                    className="p-2"
                  >
                    <Edit2 size={18} />
                  </Button>
                  <Button
                    onClick={() => handleDelete(exp.id)}
                    variant="danger"
                    className="p-2"
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </div>
              {exp.description && (
                <p className="text-gray-700 mt-2">{exp.description}</p>
              )}
            </Card>
          ))}
        </div>

        {experiences.length === 0 && !showForm && (
          <Card>
            <p className="text-gray-600 text-center">
              No work experience added yet. Click "Add Experience" to get started!
            </p>
          </Card>
        )}
      </div>
    </Layout>
  );
}
