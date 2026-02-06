'use client';

export default function TeamSection({ adType, teamMembers: serverTeamMembers = [] }) {
  const isVideo = adType === 'video';

  // Use server team members if available, otherwise fallback to hardcoded
  const hasTeamMembers = serverTeamMembers && serverTeamMembers.length > 0;

  // Fallback hardcoded team members
  const fallbackTeamMembers = isVideo
    ? [
      { name: 'Sayan Bhattacharjee', role: 'UI/UX Designer' },
      { name: 'Pradip Mondal', role: 'Graphic Designer' },
      { name: 'Shrestha samadder', role: 'Video Editor' },
    ]
    : [
      { name: 'Sayan Bhattacharjee', role: 'UI/UX Designer' },
      { name: 'Pradip Mondal', role: 'Graphic Designer' },
      { name: 'Shrestha samadder', role: 'Video Editor' },
    ];

  const teamMembers = hasTeamMembers && serverTeamMembers.length > 0
    ? serverTeamMembers.map(member => ({
      name: member.name,
      role: member.role,
      bio: member.bio,
      image: member.image,
      socialLinks: member.socialLinks,
    }))
    : fallbackTeamMembers;

  return (
    <section id="team" className="py-10 md:py-20 bg-gradient-to-b from-purple-50 via-white to-purple-50 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-purple-200/20 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-indigo-200/20 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-sm font-semibold shadow-lg">
              Our Team
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-900 via-purple-700 to-indigo-700 bg-clip-text text-transparent mb-6">
            Meet Our Creative Team
          </h2>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
            The talented professionals behind every successful ad campaign - each bringing their unique expertise to create content that converts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {teamMembers.map((member, index) => (
            <div
              key={`${index}-${member.name || index}`}
              className="group relative mb-24"
            >
              {/* Card Image Container */}
              <div className="h-[450px] w-full overflow-hidden bg-gray-200 relative">
                {member.image?.url ? (
                  <img
                    src={member.image.url}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-300">
                    {/* Placeholder generic avatar if no image */}
                    <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Overlapping Info Box - moved outside to avoid clipping */}
              <div className="absolute bottom-0 left-0 right-0 px-6 translate-y-1/2 z-10">
                <div className="bg-white p-6 text-center">
                  <h3 className="text-xl font-bold text-slate-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-0">
                    {member.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
