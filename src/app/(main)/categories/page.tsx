'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/PageHeader';
import { useCategories } from '@/hooks/use-categories';
import { LoaderCircle, PlusCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

export default function CategoriesPage() {
  const { user } = useAuth();
  const { defaultCategories, userCategories, loading } = useCategories();
  const [newCategory, setNewCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim() || !user || !db) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'userCategories'), {
        name: newCategory.trim(),
        userId: user.uid,
      });
      toast({ title: 'Success', description: 'Category added successfully.' });
      setNewCategory('');
    } catch (error) {
      console.error('Error adding category:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to add category.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!db) return;
    try {
      await deleteDoc(doc(db, 'userCategories', categoryId));
      toast({ title: 'Success', description: 'Category deleted successfully.' });
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete category.' });
    }
  };

  return (
    <>
      <PageHeader title="Manage Categories" />

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Add New Category</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddCategory} className="flex gap-2">
              <Input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="e.g., Subscriptions"
                disabled={isSubmitting}
              />
              <Button type="submit" disabled={!newCategory.trim() || isSubmitting}>
                {isSubmitting ? <LoaderCircle className="animate-spin" /> : <PlusCircle />}
                <span className="ml-2 hidden sm:inline">Add</span>
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Categories</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-24">
                <LoaderCircle className="animate-spin" />
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 text-muted-foreground">Default</h4>
                  <div className="flex flex-wrap gap-2">
                    {defaultCategories.map((cat) => (
                      <Badge key={cat} variant="secondary">{cat}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-muted-foreground">Custom</h4>
                   {userCategories.length === 0 ? (
                    <p className="text-sm text-muted-foreground">You haven't added any custom categories yet.</p>
                   ) : (
                    <div className="flex flex-wrap gap-2">
                        {userCategories.map((cat) => (
                        <div key={cat.id} className="flex items-center gap-1 bg-secondary text-secondary-foreground rounded-full pl-3 pr-1 py-0.5 text-sm font-semibold">
                            <span>{cat.name}</span>
                            <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 rounded-full"
                            onClick={() => handleDeleteCategory(cat.id)}
                            >
                            <Trash2 className="h-3 w-3 text-destructive" />
                            </Button>
                        </div>
                        ))}
                    </div>
                   )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
