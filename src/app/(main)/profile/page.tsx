
'use client';

import { useState, type ChangeEvent } from 'react';
import { useAuth } from '@/context/AuthContext';
import { auth, db } from '@/lib/firebase';
import { updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PageHeader } from '@/components/PageHeader';
import { useToast } from '@/hooks/use-toast';
import { LoaderCircle } from 'lucide-react';

const profileFormSchema = z.object({
  displayName: z.string().min(2, 'Display name must be at least 2 characters.'),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '');

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      displayName: user?.displayName || '',
    },
  });

  const handleUpdateProfile = async (data: ProfileFormValues) => {
    if (!user || !auth) return;
    setIsSubmitting(true);
    try {
      await updateProfile(auth.currentUser!, { displayName: data.displayName });
      setUser({ ...user, displayName: data.displayName });
      toast({ title: 'Success', description: 'Your profile has been updated.' });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to update profile.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !user || !db) return;
    const file = e.target.files[0];
    const storage = getStorage();
    const storageRef = ref(storage, `profile-pictures/${user.uid}`);

    setIsUploading(true);
    try {
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      await updateProfile(auth.currentUser!, { photoURL: downloadURL });
      setUser({ ...user, photoURL: downloadURL });
      setPhotoURL(downloadURL);
      toast({ title: 'Success', description: 'Profile picture updated.' });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to upload new picture.' });
    } finally {
      setIsUploading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-full">
        <LoaderCircle className="animate-spin" />
      </div>
    );
  }

  return (
    <>
      <PageHeader title="Your Profile" />
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="items-center">
              <div className="relative">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={photoURL || "https://placehold.co/128x128"} alt={user.displayName || 'User'} />
                  <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                    <LoaderCircle className="animate-spin text-white" />
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="text-center">
              <Button asChild variant="outline">
                <label htmlFor="file-upload" className="cursor-pointer">
                  Change Picture
                </label>
              </Button>
              <Input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/*" disabled={isUploading} />
              <p className="text-xs text-muted-foreground mt-2">JPG, PNG, GIF up to 5MB</p>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Profile Details</CardTitle>
              <CardDescription>Update your display name here.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleUpdateProfile)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="displayName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Display Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <LoaderCircle className="animate-spin mr-2" />}
                    Save Changes
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
