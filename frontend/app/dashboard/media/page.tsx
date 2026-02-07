'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import Layout from '@/components/Layout';
import { Card, Button, Input } from '@/components/FormComponents';
import {
  getUserMedia,
  createMedia,
  deleteMedia,
} from '@/lib/services';
import { Plus, Trash2, Link as LinkIcon } from 'lucide-react';

interface Media {
  id: number;
  title: string;
  url: string;
  media_type: 'image' | 'video' | 'link';
  created_at: string;
}

export default function MediaPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<{
    title: string;
    url: string;
    media_type: 'image' | 'video' | 'link';
  }>({
    title: '',
    url: '',
    media_type: 'image',
  });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      loadMedia();
    }
  }, [isAuthenticated, router]);

  const loadMedia = async () => {
    try {
      const data = await getUserMedia();
      setMedia(data);
    } catch (error) {
      console.error('Failed to load media:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMedia = async () => {
    const needsUrl = formData.media_type !== 'image';
    const hasUrl = !!formData.url;
    const hasFile = !!file;

    if (!formData.title || (needsUrl && !hasUrl) || (!needsUrl && !hasUrl && !hasFile)) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await createMedia(formData, file || undefined);
      await loadMedia();
      setFormData({ title: '', url: '', media_type: 'image' });
      setFile(null);
      setShowForm(false);
    } catch (error) {
      alert('Failed to add media');
    }
  };

  const handleDeleteMedia = async (id: number) => {
    if (confirm('Are you sure?')) {
      try {
        await deleteMedia(id);
        await loadMedia();
      } catch (error) {
        alert('Failed to delete media');
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
          <h1 className="text-3xl font-bold">Media Gallery</h1>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2"
          >
            <Plus size={18} />
            Add Media
          </Button>
        </div>

        {showForm && (
          <Card className="mb-8">
            <Input
              label="Title *"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g., My Project Screenshot"
              required
            />
            <Input
              label={formData.media_type === 'image' ? 'URL (optional)' : 'URL *'}
              value={formData.url}
              onChange={(e) =>
                setFormData({ ...formData, url: e.target.value })
              }
              placeholder="https://example.com/image.jpg"
              required={formData.media_type !== 'image'}
            />
            {formData.media_type === 'image' && (
              <Input
                label="Upload Image"
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            )}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Type</label>
              <select
                value={formData.media_type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    media_type: e.target.value as Media['media_type'],
                  })
                }
                className="input-field"
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
                <option value="link">Link</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddMedia} variant="primary">
                Add Media
              </Button>
              <Button onClick={() => setShowForm(false)} variant="secondary">
                Cancel
              </Button>
            </div>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {media.map((item) => (
            <Card key={item.id}>
              {item.media_type === 'image' && (
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
              {item.media_type === 'video' && (
                <div className="bg-gray-100 h-48 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-gray-500">Video Preview Unavailable</span>
                </div>
              )}
              {item.media_type === 'link' && (
                <div className="bg-gray-100 h-48 rounded-lg mb-4 flex items-center justify-center flex-col gap-2">
                  <LinkIcon size={32} className="text-gray-400" />
                  <span className="text-gray-500">External Link</span>
                </div>
              )}

              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                    {item.media_type}
                  </span>
                </div>
                <Button
                  onClick={() => handleDeleteMedia(item.id)}
                  variant="danger"
                  className="p-2"
                >
                  <Trash2 size={18} />
                </Button>
              </div>

              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 text-sm mt-2 inline-block"
              >
                View URL →
              </a>
            </Card>
          ))}
        </div>

        {media.length === 0 && !showForm && (
          <Card>
            <p className="text-gray-600 text-center">
              No media added yet. Click "Add Media" to get started!
            </p>
          </Card>
        )}
      </div>
    </Layout>
  );
}
