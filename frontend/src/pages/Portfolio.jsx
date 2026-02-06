import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

function Portfolio() {
  const { username } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/portfolio/${username}`)
      .then(res => {
        setPortfolio(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [username]);

  if (loading) return <p className="text-center mt-20 text-xl">Loading portfolio...</p>;
  if (!portfolio) return <p className="text-center mt-20 text-xl">Portfolio not found</p>;

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-center mb-12">{username}'s Portfolio</h1>

      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6">Projects</h2>
        {portfolio.repos && portfolio.repos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {portfolio.repos.map(repo => (
              <div key={repo.name} className="border rounded-lg p-6 shadow-sm hover:shadow-md transition">
                <h3 className="text-xl font-medium mb-2">{repo.name}</h3>
                <p className="text-gray-600 mb-4">{repo.description || 'No description provided'}</p>
                <div className="flex gap-4">
                  <a href={repo.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    GitHub →
                  </a>
                  {repo.live_demo && (
                    <a href={repo.live_demo} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">
                      Live Demo →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No projects available yet.</p>
        )}
      </section>

      {portfolio.resume && (
        <section>
          <h2 className="text-2xl font-semibold mb-6">Resume</h2>
          <div className="bg-gray-50 p-8 rounded-lg whitespace-pre-wrap text-gray-800">
            {portfolio.resume}
          </div>
        </section>
      )}
    </div>
  );
}

export default Portfolio;