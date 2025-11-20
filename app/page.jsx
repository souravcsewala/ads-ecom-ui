import Header from '../components/Header';
import InteractivePage from '../components/InteractivePage';
import axios from 'axios';
import { prodServerUrl } from '../global/server';

// Create axios instance for server-side requests
const serverApiClient = axios.create({
  baseURL: `${prodServerUrl}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Server Component - Fetches data on server
export default async function Home() {
  // Fetch all dynamic data on the server
  let plans = [];
  let demoContent = [];
  let teamMembers = [];

  try {
    // Fetch plans, demo content, and team members in parallel
    const [plansResponse, demoContentResponse, teamResponse] = await Promise.allSettled([
      serverApiClient.get('/plans'),
      serverApiClient.get('/demo-content'),
      serverApiClient.get('/team'),
    ]);

    if (plansResponse.status === 'fulfilled' && plansResponse.value.data?.success) {
      plans = plansResponse.value.data.plans || [];
    }

    if (demoContentResponse.status === 'fulfilled' && demoContentResponse.value.data?.success) {
      demoContent = demoContentResponse.value.data.contents || [];
    }

    if (teamResponse.status === 'fulfilled' && teamResponse.value.data?.success) {
      teamMembers = teamResponse.value.data.teamMembers || [];
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    // Continue with empty arrays if API fails
  }

  return (
    <div className="min-h-screen bg-purple-50/20">
      <Header />
      <InteractivePage 
        plans={plans}
        demoContent={demoContent}
        teamMembers={teamMembers}
        initialAdType="image"
      />
    </div>
  );
}

