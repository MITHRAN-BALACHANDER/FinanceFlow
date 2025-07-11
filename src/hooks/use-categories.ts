
'use client';

import { useEffect, useState, useMemo } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { defaultCategories, type UserCategory } from '@/lib/types';

export function useCategories() {
  const { user } = useAuth();
  const [userCategories, setUserCategories] = useState<UserCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && db) {
      setLoading(true);
      const q = query(collection(db, 'userCategories'), where('userId', '==', user.uid));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const categories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserCategory));
        setUserCategories(categories);
        setLoading(false);
      }, () => {
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
        setLoading(false);
    }
  }, [user]);

  const allCategories = useMemo(() => {
    const customCategoryNames = userCategories.map(c => c.name);
    return [...defaultCategories, ...customCategoryNames];
  }, [userCategories]);

  return { defaultCategories, userCategories, allCategories, loading };
}
