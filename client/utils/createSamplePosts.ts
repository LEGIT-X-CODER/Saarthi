// Utility to create sample community posts for testing
import { CommunityService } from '@/lib/firestore';

export const createSamplePosts = async (currentUser: any, userProfile: any) => {
  if (!currentUser || !userProfile) {
    console.error('User not authenticated');
    return;
  }

  console.log('Creating sample community posts...');

  try {
    // Sample posts data
    const samplePosts = [
      {
        title: "Best Safety Tips for Solo Travelers",
        content: "Here are some essential safety tips I've learned from traveling alone:\n\n1. Always share your itinerary with someone you trust\n2. Keep emergency contacts easily accessible\n3. Avoid walking alone at night in unfamiliar areas\n4. Trust your instincts - if something feels wrong, it probably is\n5. Blend in with locals when possible to avoid standing out as a tourist\n\nStay safe everyone! 🛡️",
        category: "tip",
        tags: ["solo-travel", "safety", "tips", "beginners"]
      },
      {
        title: "Question: Safe areas in downtown?",
        content: "Planning to visit downtown area this weekend. Any recommendations for safe areas to explore? I'm particularly interested in:\n\n- Good restaurants with good safety records\n- Parks that are well-lit and patrolled\n- Shopping areas that are busy during evening hours\n\nThanks in advance for your suggestions!",
        category: "question",
        tags: ["downtown", "safety", "recommendations", "restaurants"]
      },
      {
        title: "Warning: Pickpockets near Central Station",
        content: "⚠️ BEWARE ⚠️\n\nJust witnessed multiple pickpocket incidents near Central Station today between 3-5 PM. The perpetrators were working in groups and targeting tourists with visible valuables.\n\nSafety tips:\n- Keep wallets in front pockets\n- Avoid displaying expensive phones/cameras\n- Stay alert in crowded areas\n- Consider alternative routes if possible\n\nReported to local authorities. Please stay vigilant!",
        category: "warning",
        tags: ["warning", "pickpockets", "central-station", "urgent"]
      },
      {
        title: "Local Insights: Night Markets Safety",
        content: "As a local resident, here are some insider tips for visiting night markets safely:\n\n🌙 Best Times to Visit:\n- Arrive early (6-7 PM) when it's still light\n- Avoid peak crowd hours (8-9 PM) for better navigation\n\n🛡️ Safety Tips:\n- Stick to well-lit areas\n- Keep a buddy system\n- Know exit routes in advance\n- Have emergency numbers saved\n\nThe night market near City Hall is generally safer than the one downtown.",
        category: "local-insights",
        tags: ["local-insights", "night-markets", "safety", "city-hall"]
      },
      {
        title: "Discussion: Emergency Response Times",
        content: "I've noticed varying response times from emergency services in different parts of the city. In my experience:\n\n🟢 Fast Response (under 10 mins):\n- Downtown financial district\n- Near major hospitals\n\n🟡 Average Response (10-20 mins):\n- Residential suburbs\n- Industrial areas\n\n🔴 Slow Response (20+ mins):\n- Remote outskirts\n\nHas anyone else experienced similar patterns? What factors do you think affect response times?",
        category: "discussion",
        tags: ["discussion", "emergency-services", "response-times", "city-planning"]
      }
    ];

    // Create posts
    const postIds = [];
    for (const postData of samplePosts) {
      try {
        const postId = await CommunityService.createPost({
          authorId: currentUser.uid,
          authorName: userProfile.displayName || currentUser.email?.split('@')[0] || 'Anonymous',
          authorAvatar: userProfile.photoURL || '',
          title: postData.title,
          content: postData.content,
          category: postData.category as any,
          tags: postData.tags,
          upvotes: 0,
          downvotes: 0,
          votedBy: [],
          commentCount: 0,
          viewCount: 0,
          isPinned: false
        });
        
        postIds.push(postId);
        console.log(`Created post: ${postId} - ${postData.title}`);
      } catch (error) {
        console.error(`Failed to create post: ${postData.title}`, error);
      }
    }

    console.log('Sample posts creation completed!', { postIds });
    return postIds;
    
  } catch (error) {
    console.error('Error creating sample posts:', error);
    throw error;
  }
};

// Expose to window for easy testing
if (typeof window !== 'undefined') {
  (window as any).createSamplePosts = createSamplePosts;
}