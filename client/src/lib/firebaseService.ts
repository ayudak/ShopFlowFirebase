import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { getFirebaseInstances, getFirestorePaths } from '@/lib/firebase';
import type { FirebaseReview, FirebaseLicense, FirebaseContactMessage } from '@shared/schema';

class MockDataStore {

  private reviews: Array<FirebaseReview & { id: string }>;

  private users: Array<{ id: string; email: string; role: string }>;

  private licenses: Array<{ userId: string; licenses: Array<FirebaseLicense & { id: string }> }>;

  private contactMessages: Array<FirebaseContactMessage & { id: string }>;



  constructor() {

    this.reset();

  }



  reset() {

    this.reviews = [

      {

        id: 'mock-review-1',

        userId: 'mock-user-id',

        userEmail: 'mock@example.com',

        rating: 5,

        comment: 'Excellent POS system! Very easy to use and great support.',

        createdAt: new Date().toISOString(),

      },

      {

        id: 'mock-review-2',

        userId: 'mock-user-2',

        userEmail: 'demo@example.com',

        rating: 4,

        comment: 'Good features, highly recommended!',

        createdAt: new Date().toISOString(),

      },

    ];



    this.users = [

      { id: 'mock-user-id', email: 'mock@example.com', role: 'admin' },

      { id: 'mock-user-2', email: 'demo@example.com', role: 'user' },

    ];



    this.licenses = [

      {

        userId: 'mock-user-id',

        licenses: [{

          id: 'mock-license-1',

          userId: 'mock-user-id',

          type: 'Enterprise',

          isActive: true,

          createdAt: new Date().toISOString(),

          updatedAt: new Date().toISOString(),

          expiryDate: '2025-12-31',

        }],

      },

      {

        userId: 'mock-user-2',

        licenses: [{

          id: 'mock-license-2',

          userId: 'mock-user-2',

          type: 'Trial',

          isActive: true,

          createdAt: new Date().toISOString(),

          updatedAt: new Date().toISOString(),

          expiryDate: '2025-03-31',

        }],

      },

    ];



    this.contactMessages = [];

  }



  getReviews(): Array<FirebaseReview & { id: string }> {

    return [...this.reviews];

  }



  addReview(review: FirebaseReview & { id: string }) {

    this.reviews.unshift(review);

  }



  deleteReview(id: string) {

    this.reviews = this.reviews.filter(r => r.id !== id);

  }



  addContactMessage(message: FirebaseContactMessage & { id: string }) {

    this.contactMessages.unshift(message);

  }



  getUsers(): Array<{ id: string; email: string; role: string }> {

    return [...this.users];

  }



  getLicenses(): Array<{ userId: string; licenses: Array<FirebaseLicense & { id: string }> }> {
    return JSON.parse(JSON.stringify(this.licenses));
  }

  getUserLicense(userId: string): (FirebaseLicense & { id: string }) | null {
    const userLicenses = this.licenses.find(ul => ul.userId === userId);
    if (!userLicenses || userLicenses.licenses.length === 0) {
      return null;
    }
    const activeLicense = userLicenses.licenses.find(l => l.isActive);
    const license = activeLicense || userLicenses.licenses[0];
    return JSON.parse(JSON.stringify(license));
  }

  addLicense(userId: string, license: FirebaseLicense & { id: string }) {
    const userLicenses = this.licenses.find(ul => ul.userId === userId);
    if (userLicenses) {
      userLicenses.licenses.push(license);
    } else {
      this.licenses.push({
        userId,
        licenses: [license],
      });
    }
  }

  updateLicense(userId: string, licenseId: string, updates: Partial<FirebaseLicense>) {
    const userLicenses = this.licenses.find(ul => ul.userId === userId);
    if (userLicenses) {
      const license = userLicenses.licenses.find(l => l.id === licenseId);
      if (license) {
        Object.assign(license, updates);
      }
    }
  }

  deleteLicense(userId: string, licenseId: string) {
    const userLicenses = this.licenses.find(ul => ul.userId === userId);
    if (userLicenses) {
      userLicenses.licenses = userLicenses.licenses.filter(l => l.id !== licenseId);
    }
  }
}

const mockStore = new MockDataStore();

if (import.meta.hot) {
  import.meta.hot.accept(() => {
    mockStore.reset();
  });
  
  import.meta.hot.dispose(() => {
    mockStore.reset();
  });
}

export class FirebaseService {
  static getInstances() {
    try {
      const firebase = getFirebaseInstances();
      return firebase;
    } catch (error) {
      console.warn('Firebase instances not available:', error);
      return null;
    }
  }

  static isMockMode(): boolean {
    return this.getInstances() === null;
  }

  static resetMockData() {
    mockStore.reset();
  }

  static async createReview(review: Omit<FirebaseReview, 'createdAt'>): Promise<string> {
    const firebase = this.getInstances();

    if (!firebase) {
      const newReview = {
        id: `mock-review-${Date.now()}`,
        ...review,
        createdAt: new Date().toISOString(),
      };
      mockStore.addReview(newReview);
      return newReview.id;
    }

    const { db } = firebase;
    const paths = getFirestorePaths();

    const reviewData = {
      ...review,
      createdAt: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, paths.reviews), reviewData);
    return docRef.id;
  }

  static async getReviews(): Promise<Array<FirebaseReview & { id: string }>> {
    const firebase = this.getInstances();

    if (!firebase) {
      return mockStore.getReviews();
    }

    const { db } = firebase;
    const paths = getFirestorePaths();

    const q = query(collection(db, paths.reviews), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Array<FirebaseReview & { id: string }>;
  }

  static async deleteReview(reviewId: string): Promise<void> {
    const firebase = this.getInstances();

    if (!firebase) {
      mockStore.deleteReview(reviewId);
      return;
    }

    const { db } = firebase;
    const paths = getFirestorePaths();

    await deleteDoc(doc(db, paths.reviews, reviewId));
  }

  static async getUserLicense(userId: string): Promise<(FirebaseLicense & { id: string }) | null> {
    const firebase = this.getInstances();

    if (!firebase) {
      return mockStore.getUserLicense(userId);
    }

    const { db } = firebase;
    const paths = getFirestorePaths();

    const snapshot = await getDocs(collection(db, paths.userLicenses(userId)));
    if (snapshot.empty) {
      return null;
    }

    const activeLicense = snapshot.docs.find((doc) => doc.data().isActive);
    const licenseDoc = activeLicense || snapshot.docs[0];

    return {
      id: licenseDoc.id,
      ...licenseDoc.data(),
    } as FirebaseLicense & { id: string };
  }

  static async createLicense(userId: string, license: Omit<FirebaseLicense, 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const firebase = this.getInstances();

    const licenseData: FirebaseLicense = {
      userId,
      ...license,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (!firebase) {
      const newLicense = {
        id: `mock-license-${Date.now()}`,
        ...licenseData,
      };
      
      mockStore.addLicense(userId, newLicense);
      
      return newLicense.id;
    }

    const { db } = firebase;
    const paths = getFirestorePaths();

    const docRef = await addDoc(collection(db, paths.userLicenses(userId)), licenseData);
    return docRef.id;
  }

  static async updateLicense(userId: string, licenseId: string, updates: Partial<FirebaseLicense>): Promise<void> {
    const firebase = this.getInstances();

    const updateData = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    if (!firebase) {
      mockStore.updateLicense(userId, licenseId, updateData);
      return;
    }

    const { db } = firebase;
    const paths = getFirestorePaths();

    await updateDoc(doc(db, paths.userLicenses(userId), licenseId), updateData);
  }

  static async deleteLicense(userId: string, licenseId: string): Promise<void> {
    const firebase = this.getInstances();

    if (!firebase) {
      mockStore.deleteLicense(userId, licenseId);
      return;
    }

    const { db } = firebase;
    const paths = getFirestorePaths();

    await deleteDoc(doc(db, paths.userLicenses(userId), licenseId));
  }

  static async getAllUsers(): Promise<Array<{ id: string; email: string; role: string }>> {
    const firebase = this.getInstances();

    if (!firebase) {
      return mockStore.getUsers();
    }

    const { db } = firebase;

    const snapshot = await getDocs(collection(db, 'users'));
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      email: doc.data().email || '',
      role: doc.data().role || 'user',
    }));
  }

  static async getAllUserLicenses(): Promise<Array<{ userId: string; licenses: Array<FirebaseLicense & { id: string }> }>> {
    const firebase = this.getInstances();

    if (!firebase) {
      return mockStore.getLicenses();
    }

    const { db } = firebase;
    const users = await this.getAllUsers();

    const userLicensesPromises = users.map(async (user) => {
      const paths = getFirestorePaths();
      const snapshot = await getDocs(collection(db, paths.userLicenses(user.id)));
      const licenses = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Array<FirebaseLicense & { id: string }>;

      return {
        userId: user.id,
        licenses,
      };
    });

    return Promise.all(userLicensesPromises);
  }

  static async createContactMessage(message: Omit<FirebaseContactMessage, 'createdAt'>): Promise<string> {
    const firebase = this.getInstances();

    const messageData = {
      ...message,
      createdAt: new Date().toISOString(),
    };

    if (!firebase) {
      const newMessage = {
        id: `mock-message-${Date.now()}`,
        ...messageData,
      };
      mockStore.addContactMessage(newMessage);
      return newMessage.id;
    }

    const { db } = firebase;
    const paths = getFirestorePaths();

    const docRef = await addDoc(collection(db, paths.contactMessages), messageData);
    return docRef.id;
  }
}
