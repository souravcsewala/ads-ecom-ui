'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminTeamApi } from '../../../lib/adminApi';

export default function TeamPage() {
  const router = useRouter();
  const [teamMembers, setTeamMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setIsLoading(true);
      const response = await adminTeamApi.getAll();
      if (response.success) {
        setTeamMembers(response.teamMembers || []);
      } else {
        setTeamMembers([]);
      }
    } catch (error) {
      // For test mode - silently handle network errors
      console.log('No backend connection - showing empty state');
      setTeamMembers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    router.push('/admin/team/create');
  };

  const handleEdit = (member) => {
    router.push(`/admin/team/edit/${member._id}`);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this team member?')) {
      return;
    }

    try {
      const response = await adminTeamApi.delete(id);
      if (response.success) {
        fetchTeamMembers();
      }
    } catch (error) {
      // For test mode - silently handle network errors
      console.log('No backend connection - test mode');
      // In test mode, just remove from local state
      setTeamMembers(teamMembers.filter(m => m._id !== id));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Team</h1>
          <p className="text-gray-600 mt-1">Manage team members for the frontend</p>
        </div>
        <button
          onClick={handleCreate}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
        >
          + Add Team Member
        </button>
      </div>

      {/* Team List */}
      {teamMembers.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow-md text-center">
          <p className="text-gray-600 text-lg">No team members found</p>
          <button
            onClick={handleCreate}
            className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Add Your First Team Member
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member) => (
            <div
              key={member._id}
              className="bg-white p-6 rounded-lg shadow-md border-2 border-gray-200 text-center"
            >
              <div className="mb-4">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 mx-auto flex items-center justify-center shadow-lg overflow-hidden">
                  {member.image?.url ? (
                    <img
                      src={member.image.url}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl font-bold text-white">{member.name[0]}</span>
                  )}
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
              <p className="text-purple-600 font-semibold mb-2">{member.role}</p>
              {member.bio && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{member.bio}</p>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  member.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {member.isActive ? 'Active' : 'Inactive'}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(member)}
                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(member._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

