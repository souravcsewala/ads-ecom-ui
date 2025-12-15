'use client';

export default function TeamSection({ adType, teamMembers: serverTeamMembers = [] }) {
  const isVideo = adType === 'video';

  // Use server team members if available, otherwise fallback to hardcoded
  const hasTeamMembers = serverTeamMembers && serverTeamMembers.length > 0;
  
  // Fallback hardcoded team members
  const fallbackTeamMembers = isVideo
    ? [
        { name: 'Indira', role: 'Chief Winreach' },
        { name: 'Priyal', role: 'Ad Whisperer' },
        { name: 'Nica', role: 'Cloud Optimization' },
      ]
    : [
        { name: 'Trisha', role: 'Chief Of Growth' },
        { name: 'Priyali', role: 'Ad Whisperer' },
        { name: 'Naina', role: 'Head Of Creative' },
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
    <section id="team" className="py-20 bg-gradient-to-b from-purple-50 via-white to-purple-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-purple-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full text-sm font-semibold shadow-lg">
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
              className="relative group"
            >
              {/* Card */}
              <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-purple-100 hover:border-purple-300 relative overflow-hidden">
                {/* Decorative gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50/0 to-indigo-50/0 group-hover:from-purple-50/50 group-hover:to-indigo-50/50 transition-all duration-300"></div>
                
                <div className="relative z-10 text-center">
                  {/* Profile Image */}
                  <div className="relative mb-6 inline-block">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-400 via-indigo-500 to-purple-600 mx-auto flex items-center justify-center shadow-2xl overflow-hidden ring-4 ring-purple-100 group-hover:ring-purple-300 transition-all duration-300 transform group-hover:scale-105">
                      {member.image?.url ? (
                        <img 
                          src={member.image.url} 
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-5xl font-bold text-white">{member.name[0]}</span>
                      )}
                    </div>
                    {/* Decorative circle behind image */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-300 to-indigo-400 blur-xl opacity-50 -z-10 group-hover:opacity-70 transition-opacity"></div>
                  </div>
                  
                  {/* Name */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-purple-700 transition-colors">
                    {member.name}
                  </h3>
                  
                  {/* Role */}
                  <div className="inline-block px-4 py-2 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full mb-4">
                    <p className="text-purple-700 font-semibold text-sm">{member.role}</p>
                  </div>
                  
                  {/* Bio */}
                  {member.bio && (
                    <p className="text-gray-600 mt-4 leading-relaxed text-sm">
                      {member.bio}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

