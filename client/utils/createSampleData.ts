// Demo script to create sample incidents in Firestore
// This can be run from the browser console when logged in

import { IncidentService, CommentService, CommunityService } from '@/lib/firestore';

export const createSampleData = async (currentUser: any, userProfile: any) => {
  if (!currentUser || !userProfile) {
    console.error('User not authenticated');
    return;
  }

  console.log('Creating sample incidents...');

  try {
    // Sample incident 1
    const incident1Id = await IncidentService.createIncident({
      reporterId: currentUser.uid,
      reporterName: userProfile.displayName,
      reporterAvatar: currentUser.photoURL,
      title: 'Theft at Central Station',
      description: 'Witnessed a pickpocket targeting tourists at the main entrance. The suspect was wearing a dark hoodie and appeared to be working with another individual. Be extra cautious with bags and valuables in this area.',
      category: 'theft',
      severity: 'medium',
      location: {
        address: 'Central Station, Platform 1-2',
        coordinates: { lat: 40.7128, lng: -74.0060 }
      }
    });

    // Sample incident 2
    const incident2Id = await IncidentService.createIncident({
      reporterId: currentUser.uid,
      reporterName: userProfile.displayName,
      reporterAvatar: currentUser.photoURL,
      title: 'Road Accident on Main Street',
      description: 'Multi-car collision blocking two lanes. Emergency services are on scene. Traffic is heavily backed up. Consider alternative routes through Oak Avenue or Pine Street.',
      category: 'accident',
      severity: 'high',
      location: {
        address: 'Main Street & 5th Avenue Intersection',
        coordinates: { lat: 40.7589, lng: -73.9851 }
      }
    });

    // Sample incident 3
    const incident3Id = await IncidentService.createIncident({
      reporterId: currentUser.uid,
      reporterName: userProfile.displayName,
      reporterAvatar: currentUser.photoURL,
      title: 'Severe Weather Warning',
      description: 'Heavy thunderstorm approaching from the west. Strong winds and hail reported. Seek indoor shelter immediately if you are in the downtown area.',
      category: 'weather',
      severity: 'critical',
      location: {
        address: 'Downtown District',
        coordinates: { lat: 40.7831, lng: -73.9712 }
      }
    });

    console.log('Sample incidents created successfully!');
    console.log('Incident IDs:', { incident1Id, incident2Id, incident3Id });

    // Add sample comments
    await CommentService.addComment({
      incidentId: incident1Id,
      userId: currentUser.uid,
      userName: userProfile.displayName,
      userAvatar: currentUser.photoURL,
      content: 'I saw this happen too! Police arrived within 10 minutes. The area seems to have increased security now.',
      upvotes: 0,
      downvotes: 0,
      votedBy: [],
      isEdited: false
    });

    await CommentService.addComment({
      incidentId: incident2Id,
      userId: currentUser.uid,
      userName: userProfile.displayName,
      userAvatar: currentUser.photoURL,
      content: 'Traffic is clearing up now. Oak Avenue is a good alternative route if you need to get through the area.',
      upvotes: 0,
      downvotes: 0,
      votedBy: [],
      isEdited: false
    });

    console.log('Sample comments added successfully!');

    // Create a sample community post
    const postId = await CommunityService.createPost({
      authorId: currentUser.uid,
      authorName: userProfile.displayName,
      authorAvatar: currentUser.photoURL,
      title: 'Safety Tips for Downtown Area',
      content: 'Based on recent incidents, here are some safety recommendations for the downtown area:\\n\\n1. Keep valuables secure and out of sight\\n2. Travel in groups when possible, especially at night\\n3. Stay aware of your surroundings at transit stations\\n4. Have emergency contacts readily available\\n\\nStay safe everyone!',
      category: 'tip',
      tags: ['safety', 'downtown', 'prevention'],
      upvotes: 0,
      downvotes: 0,
      votedBy: [],
      commentCount: 0,
      viewCount: 0,
      isPinned: false
    });

    console.log('Sample community post created:', postId);

  } catch (error) {
    console.error('Error creating sample data:', error);
  }
};

// Expose to window for easy testing
if (typeof window !== 'undefined') {
  (window as any).createSampleData = createSampleData;
}