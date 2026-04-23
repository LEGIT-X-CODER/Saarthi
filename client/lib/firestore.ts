import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  serverTimestamp,
  increment,
  arrayUnion,
  arrayRemove,
  onSnapshot,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phoneNumber: string;
  bio?: string;
  location?: string;
  joinedAt: Date | Timestamp;
  lastLoginAt: Date | Timestamp;
  reputation: number;
  badgesEarned: string[];
  totalReports: number;
  totalComments: number;
}

export interface IncidentReport {
  id?: string;
  reporterId: string;
  reporterName: string;
  reporterAvatar?: string;
  title: string;
  description: string;
  category: 'theft' | 'harassment' | 'accident' | 'weather' | 'medical' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: {
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  images?: string[];
  status: 'pending' | 'verified' | 'resolved' | 'false_report';
  upvotes: number;
  downvotes: number;
  votedBy: string[];
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
  verifiedBy?: string;
  verifiedAt?: Date | Timestamp;
}

export interface Comment {
  id?: string;
  incidentId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  upvotes: number;
  downvotes: number;
  votedBy: string[];
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
  isEdited: boolean;
  parentCommentId?: string; // For replies
  replies?: Comment[];
}

export interface CommunityPost {
  id?: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  title: string;
  content: string;
  category: 'discussion' | 'question' | 'tip' | 'warning' | 'local-insights';
  tags: string[];
  upvotes: number;
  downvotes: number;
  votedBy: string[];
  commentCount: number;
  viewCount: number;
  isPinned: boolean;
  createdAt: Date | Timestamp;
  updatedAt: Date | Timestamp;
}

export interface SafetyRating {
  id?: string;
  locationId: string;
  userId: string;
  userName: string;
  rating: number; // 1-5 stars
  review?: string;
  category: 'general' | 'nighttime' | 'transportation' | 'tourist_areas';
  createdAt: Date | Timestamp;
}

export interface UserActivity {
  id?: string;
  userId: string;
  type: 'report_created' | 'comment_added' | 'post_created' | 'upvote' | 'badge_earned';
  targetId: string;
  targetType: 'incident' | 'comment' | 'post';
  description: string;
  createdAt: Date | Timestamp;
}

// ==========================================
// USER PROFILE SERVICES
// ==========================================

export class UserService {
  static async createOrUpdateProfile(userData: Partial<UserProfile>): Promise<UserProfile> {
    if (!db || !userData.uid) throw new Error('Database not available or missing user ID');

    const userRef = doc(db, 'users', userData.uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      // Update existing profile
      const updates: any = {
        ...userData,
        lastLoginAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      await updateDoc(userRef, updates);
      const existingData = userDoc.data() as UserProfile;
      return { ...existingData, ...userData, lastLoginAt: new Date(), updatedAt: new Date() } as UserProfile;
    } else {
      // Create new profile
      const newProfile: any = {
        uid: userData.uid!,
        email: userData.email || '',
        displayName: userData.displayName || '',
        photoURL: userData.photoURL || undefined,
        phoneNumber: userData.phoneNumber || '',
        bio: userData.bio || '',
        location: userData.location || '',
        joinedAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        reputation: 0,
        badgesEarned: [],
        totalReports: 0,
        totalComments: 0,
        ...userData
      };
      await setDoc(userRef, newProfile);
      return { ...newProfile, joinedAt: new Date(), lastLoginAt: new Date() } as UserProfile;
    }
  }

  static async getProfile(userId: string): Promise<UserProfile | null> {
    if (!db) throw new Error('Database not available');
    
    const userDoc = await getDoc(doc(db, 'users', userId));
    return userDoc.exists() ? userDoc.data() as UserProfile : null;
  }

  static async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
    if (!db) throw new Error('Database not available');
    
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  }

  static async awardBadge(userId: string, badge: string): Promise<void> {
    if (!db) throw new Error('Database not available');
    
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      badgesEarned: arrayUnion(badge),
      reputation: increment(10)
    });
  }
}

// ==========================================
// INCIDENT REPORT SERVICES
// ==========================================

export class IncidentService {
  static async createIncident(incidentData: {
    reporterId: string;
    reporterName: string;
    reporterAvatar?: string;
    title: string;
    description: string;
    category: IncidentReport['category'];
    severity: IncidentReport['severity'];
    location: IncidentReport['location'];
    images?: string[];
  }): Promise<string> {
    if (!db) throw new Error('Database not available');

    const incident: any = {
      ...incidentData,
      upvotes: 0,
      downvotes: 0,
      votedBy: [],
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'incidents'), incident);
    
    // Update user's total reports count
    await UserService.updateProfile(incidentData.reporterId, {
      totalReports: increment(1) as any
    });

    return docRef.id;
  }

  static async getIncidents(limit_count = 20): Promise<IncidentReport[]> {
    if (!db) throw new Error('Database not available');

    const q = query(
      collection(db, 'incidents'),
      orderBy('createdAt', 'desc'),
      limit(limit_count)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as IncidentReport));
  }

  static async getIncidentsByLocation(locationQuery: string): Promise<IncidentReport[]> {
    if (!db) throw new Error('Database not available');

    const q = query(
      collection(db, 'incidents'),
      where('location.address', '>=', locationQuery),
      where('location.address', '<=', locationQuery + '\uf8ff'),
      orderBy('location.address'),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as IncidentReport));
  }

  static async voteOnIncident(incidentId: string, userId: string, voteType: 'up' | 'down'): Promise<void> {
    if (!db) throw new Error('Database not available');

    const incidentRef = doc(db, 'incidents', incidentId);
    const incidentDoc = await getDoc(incidentRef);
    
    if (!incidentDoc.exists()) throw new Error('Incident not found');
    
    const incident = incidentDoc.data() as IncidentReport;
    const hasVoted = incident.votedBy?.includes(userId) || false;
    
    if (hasVoted) {
      throw new Error('User has already voted on this incident');
    }

    const updates: any = {
      votedBy: arrayUnion(userId),
      updatedAt: serverTimestamp()
    };

    if (voteType === 'up') {
      updates.upvotes = increment(1);
    } else {
      updates.downvotes = increment(1);
    }

    await updateDoc(incidentRef, updates);
  }

  static async updateIncidentStatus(incidentId: string, status: IncidentReport['status'], verifiedBy?: string): Promise<void> {
    if (!db) throw new Error('Database not available');

    const updates: any = {
      status,
      updatedAt: serverTimestamp()
    };

    if (status === 'verified' && verifiedBy) {
      updates.verifiedBy = verifiedBy;
      updates.verifiedAt = serverTimestamp();
    }

    await updateDoc(doc(db, 'incidents', incidentId), updates);
  }
}

// ==========================================
// COMMENT SERVICES
// ==========================================

export class CommentService {
  static async addComment(commentData: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    if (!db) throw new Error('Database not available');

    const comment: any = {
      ...commentData,
      upvotes: 0,
      downvotes: 0,
      votedBy: [],
      isEdited: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'comments'), comment);
    
    // Update user's total comments count
    await UserService.updateProfile(commentData.userId, {
      totalComments: increment(1) as any
    });

    return docRef.id;
  }

  static async getCommentsByIncident(incidentId: string): Promise<Comment[]> {
    if (!db) throw new Error('Database not available');

    const q = query(
      collection(db, 'comments'),
      where('incidentId', '==', incidentId),
      orderBy('createdAt', 'asc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Comment));
  }

  static async updateComment(commentId: string, content: string): Promise<void> {
    if (!db) throw new Error('Database not available');

    await updateDoc(doc(db, 'comments', commentId), {
      content,
      isEdited: true,
      updatedAt: serverTimestamp()
    });
  }

  static async deleteComment(commentId: string): Promise<void> {
    if (!db) throw new Error('Database not available');

    await deleteDoc(doc(db, 'comments', commentId));
  }

  static async voteOnComment(commentId: string, userId: string, voteType: 'up' | 'down'): Promise<void> {
    if (!db) throw new Error('Database not available');

    const commentRef = doc(db, 'comments', commentId);
    const commentDoc = await getDoc(commentRef);
    
    if (!commentDoc.exists()) throw new Error('Comment not found');
    
    const comment = commentDoc.data() as Comment;
    const hasVoted = comment.votedBy?.includes(userId) || false;
    
    if (hasVoted) {
      throw new Error('User has already voted on this comment');
    }

    const updates: any = {
      votedBy: arrayUnion(userId),
      updatedAt: serverTimestamp()
    };

    if (voteType === 'up') {
      updates.upvotes = increment(1);
    } else {
      updates.downvotes = increment(1);
    }

    await updateDoc(commentRef, updates);
  }
}

// ==========================================
// COMMUNITY POST SERVICES
// ==========================================

export class CommunityService {
  static async createPost(postData: Omit<CommunityPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    if (!db) throw new Error('Database not available');

    const post: any = {
      ...postData,
      upvotes: 0,
      downvotes: 0,
      votedBy: [],
      commentCount: 0,
      viewCount: 0,
      isPinned: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'community_posts'), post);
    return docRef.id;
  }

  static async getPosts(category?: string, limit_count = 20): Promise<CommunityPost[]> {
    if (!db) throw new Error('Database not available');

    try {
      console.log('Fetching posts for category:', category);
      let q;
      
      if (category && category !== 'all') {
        // Simple query for category filter to avoid composite index requirement
        console.log('Using category filter query');
        q = query(
          collection(db, 'community_posts'),
          where('category', '==', category),
          limit(limit_count)
        );
      } else {
        // For all posts, use simple ordering
        console.log('Using all posts query');
        q = query(
          collection(db, 'community_posts'),
          orderBy('createdAt', 'desc'),
          limit(limit_count)
        );
      }

      const snapshot = await getDocs(q);
      console.log('Raw snapshot size:', snapshot.size);
      
      let posts = snapshot.docs.map(doc => {
        const data = doc.data();
        console.log('Post data:', doc.id, data);
        return {
          id: doc.id,
          ...(data as object)
        } as CommunityPost;
      });
      
      // Manual sorting for category queries since we can't use composite index
      if (category && category !== 'all') {
        posts = posts.sort((a, b) => {
          const aTime = a.createdAt instanceof Timestamp ? a.createdAt.toDate().getTime() : 
                      a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
          const bTime = b.createdAt instanceof Timestamp ? b.createdAt.toDate().getTime() : 
                      b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
          return bTime - aTime; // Newest first
        });
      }
      
      console.log('Returning posts:', posts.length);
      return posts;
      
    } catch (error) {
      console.error('Error in getPosts:', error);
      
      // Fallback: Try to get all posts without any filters
      try {
        console.log('Trying fallback query...');
        const fallbackQuery = query(
          collection(db, 'community_posts'),
          limit(limit_count)
        );
        
        const fallbackSnapshot = await getDocs(fallbackQuery);
        console.log('Fallback snapshot size:', fallbackSnapshot.size);
        
        let allPosts = fallbackSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as CommunityPost));
        
        // Filter manually if category specified
        if (category && category !== 'all') {
          allPosts = allPosts.filter(post => post.category === category);
        }
        
        // Sort manually
        allPosts = allPosts.sort((a, b) => {
          const aTime = a.createdAt instanceof Timestamp ? a.createdAt.toDate().getTime() : 
                      a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
          const bTime = b.createdAt instanceof Timestamp ? b.createdAt.toDate().getTime() : 
                      b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
          return bTime - aTime;
        });
        
        console.log('Fallback returning posts:', allPosts.length);
        return allPosts;
        
      } catch (fallbackError) {
        console.error('Fallback query also failed:', fallbackError);
        return [];
      }
    }
  }

  static async incrementViewCount(postId: string): Promise<void> {
    if (!db) throw new Error('Database not available');

    await updateDoc(doc(db, 'community_posts', postId), {
      viewCount: increment(1)
    });
  }

  static async voteOnPost(postId: string, userId: string, voteType: 'up' | 'down'): Promise<void> {
    if (!db) throw new Error('Database not available');

    const postRef = doc(db, 'community_posts', postId);
    const postDoc = await getDoc(postRef);
    
    if (!postDoc.exists()) throw new Error('Post not found');
    
    const post = postDoc.data() as CommunityPost;
    const hasVoted = post.votedBy?.includes(userId) || false;
    
    if (hasVoted) {
      throw new Error('User has already voted on this post');
    }

    const updates: any = {
      votedBy: arrayUnion(userId),
      updatedAt: serverTimestamp()
    };

    if (voteType === 'up') {
      updates.upvotes = increment(1);
    } else {
      updates.downvotes = increment(1);
    }

    await updateDoc(postRef, updates);
  }
}

// ==========================================
// SAFETY RATING SERVICES
// ==========================================

export class SafetyRatingService {
  static async addRating(ratingData: Omit<SafetyRating, 'id' | 'createdAt'>): Promise<string> {
    if (!db) throw new Error('Database not available');

    const rating: any = {
      ...ratingData,
      createdAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'safety_ratings'), rating);
    return docRef.id;
  }

  static async getRatingsByLocation(locationId: string): Promise<SafetyRating[]> {
    if (!db) throw new Error('Database not available');

    const q = query(
      collection(db, 'safety_ratings'),
      where('locationId', '==', locationId),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as SafetyRating));
  }

  static async getAverageRating(locationId: string): Promise<{ average: number; count: number }> {
    const ratings = await this.getRatingsByLocation(locationId);
    
    if (ratings.length === 0) {
      return { average: 0, count: 0 };
    }

    const sum = ratings.reduce((acc, rating) => acc + rating.rating, 0);
    return {
      average: sum / ratings.length,
      count: ratings.length
    };
  }
}

// ==========================================
// REAL-TIME LISTENERS
// ==========================================

export class RealtimeService {
  static listenToIncidents(callback: (incidents: IncidentReport[]) => void): () => void {
    if (!db) throw new Error('Database not available');

    const q = query(
      collection(db, 'incidents'),
      orderBy('createdAt', 'desc'),
      limit(20)
    );

    return onSnapshot(q, (snapshot) => {
      const incidents = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as IncidentReport));
      callback(incidents);
    });
  }

  static listenToComments(incidentId: string, callback: (comments: Comment[]) => void): () => void {
    if (!db) throw new Error('Database not available');

    const q = query(
      collection(db, 'comments'),
      where('incidentId', '==', incidentId),
      orderBy('createdAt', 'asc')
    );

    return onSnapshot(q, (snapshot) => {
      const comments = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Comment));
      callback(comments);
    });
  }

  static listenToCommunityPosts(callback: (posts: CommunityPost[]) => void): () => void {
    if (!db) throw new Error('Database not available');

    const q = query(
      collection(db, 'community_posts'),
      orderBy('isPinned', 'desc'),
      orderBy('createdAt', 'desc'),
      limit(20)
    );

    return onSnapshot(q, (snapshot) => {
      const posts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as CommunityPost));
      callback(posts);
    });
  }
}

// ==========================================
// ANALYTICS & STATISTICS
// ==========================================

export class AnalyticsService {
  static async getUserStats(userId: string): Promise<{
    totalReports: number;
    totalComments: number;
    totalUpvotes: number;
    reputation: number;
    recentActivity?: Array<{
      type: string;
      description: string;
      createdAt: Date;
    }>;
  }> {
    if (!db) throw new Error('Database not available');

    const user = await UserService.getProfile(userId);
    if (!user) throw new Error('User not found');

    // Get user's incidents
    const incidentsQuery = query(
      collection(db, 'incidents'),
      where('reporterId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(5)
    );
    const incidentsSnapshot = await getDocs(incidentsQuery);
    
    // Get user's comments
    const commentsQuery = query(
      collection(db, 'comments'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(5)
    );
    const commentsSnapshot = await getDocs(commentsQuery);
    
    // Get user's community posts
    const postsQuery = query(
      collection(db, 'communityPosts'),
      where('authorId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(5)
    );
    const postsSnapshot = await getDocs(postsQuery);
    
    // Calculate total upvotes on user's content
    let totalUpvotes = 0;
    incidentsSnapshot.docs.forEach(doc => {
      const incident = doc.data() as IncidentReport;
      totalUpvotes += incident.upvotes || 0;
    });

    // Compile recent activity
    const recentActivity: Array<{
      type: string;
      description: string;
      createdAt: Date;
    }> = [];
    
    // Add incidents to activity
    incidentsSnapshot.docs.forEach(doc => {
      const incident = doc.data() as IncidentReport;
      recentActivity.push({
        type: 'report_created',
        description: `Reported an incident: ${incident.title}`,
        createdAt: incident.createdAt instanceof Timestamp ? incident.createdAt.toDate() : 
                   incident.createdAt instanceof Date ? incident.createdAt : new Date()
      });
    });
    
    // Add comments to activity
    commentsSnapshot.docs.forEach(doc => {
      const comment = doc.data() as Comment;
      recentActivity.push({
        type: 'comment_added',
        description: `Added a comment: "${comment.content.substring(0, 30)}${comment.content.length > 30 ? '...' : ''}"`,
        createdAt: comment.createdAt instanceof Timestamp ? comment.createdAt.toDate() : 
                   comment.createdAt instanceof Date ? comment.createdAt : new Date()
      });
    });
    
    // Add posts to activity
    postsSnapshot.docs.forEach(doc => {
      const post = doc.data() as CommunityPost;
      recentActivity.push({
        type: 'post_created',
        description: `Created a post: ${post.title}`,
        createdAt: post.createdAt instanceof Timestamp ? post.createdAt.toDate() : 
                   post.createdAt instanceof Date ? post.createdAt : new Date()
      });
    });
    
    // Sort all activities by date (newest first)
    recentActivity.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return {
      totalReports: user.totalReports || 0,
      totalComments: user.totalComments || 0,
      totalUpvotes,
      reputation: user.reputation || 0,
      recentActivity: recentActivity.slice(0, 10) // Return only the 10 most recent activities
    };
  }

  static async getLocationStats(locationQuery: string): Promise<{
    totalIncidents: number;
    severityBreakdown: { [key: string]: number };
    categoryBreakdown: { [key: string]: number };
    averageRating: number;
  }> {
    if (!db) throw new Error('Database not available');

    const incidents = await IncidentService.getIncidentsByLocation(locationQuery);
    
    const severityBreakdown = { low: 0, medium: 0, high: 0, critical: 0 };
    const categoryBreakdown: { [key: string]: number } = {};

    incidents.forEach(incident => {
      severityBreakdown[incident.severity]++;
      categoryBreakdown[incident.category] = (categoryBreakdown[incident.category] || 0) + 1;
    });

    // This would need a locationId mapping in a real implementation
    const averageRating = 0; // Placeholder

    return {
      totalIncidents: incidents.length,
      severityBreakdown,
      categoryBreakdown,
      averageRating
    };
  }
}

export default {
  UserService,
  IncidentService,
  CommentService,
  CommunityService,
  SafetyRatingService,
  RealtimeService,
  AnalyticsService
};