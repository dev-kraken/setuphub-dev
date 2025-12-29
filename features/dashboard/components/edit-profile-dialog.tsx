'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { IconBrandLinkedin, IconBrandX, IconLoader2, IconWorld } from '@tabler/icons-react';
import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { getUserProfile, updateUserProfile } from '../actions/update-profile';
import { type UpdateProfileInput, updateProfileSchema } from '../lib/schemas/profile-schema';
import { type UserProfileData } from '../types';

interface EditProfileDialogProps {
  children: React.ReactNode;
  initialProfile?: UserProfileData | null;
}

const EditProfileDialog = ({ children, initialProfile }: EditProfileDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);
  const hasFetchedRef = useRef(false);

  const form = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      bio: initialProfile?.bio ?? '',
      websiteUrl: initialProfile?.websiteUrl ?? '',
      twitterUsername: initialProfile?.twitterUsername ?? '',
      linkedinUrl: initialProfile?.linkedinUrl ?? '',
    },
  });

  // Fetch profile data
  const fetchProfileData = useCallback(async () => {
    if (initialProfile || hasFetchedRef.current) return;

    hasFetchedRef.current = true;
    setIsLoading(true);

    try {
      const response = await getUserProfile();
      if (response.success && response.data) {
        form.reset({
          bio: response.data.bio ?? '',
          websiteUrl: response.data.websiteUrl ?? '',
          twitterUsername: response.data.twitterUsername ?? '',
          linkedinUrl: response.data.linkedinUrl ?? '',
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [initialProfile, form]);

  // Fetch profile when dialog opens
  useEffect(() => {
    if (open && !initialProfile && !hasFetchedRef.current) {
      fetchProfileData();
    }
  }, [open, initialProfile, fetchProfileData]);

  const handleOpenChange = (newOpen: boolean) => {
    if (isPending) return;

    setOpen(newOpen);

    if (!newOpen) {
      form.reset({
        bio: initialProfile?.bio ?? '',
        websiteUrl: initialProfile?.websiteUrl ?? '',
        twitterUsername: initialProfile?.twitterUsername ?? '',
        linkedinUrl: initialProfile?.linkedinUrl ?? '',
      });
      hasFetchedRef.current = false;
    }
  };

  const onSubmit = (data: UpdateProfileInput) => {
    startTransition(async () => {
      const result = await updateUserProfile(data);

      if (!result.success) {
        toast.error(result.error ?? 'Failed to update profile');
        return;
      }

      toast.success('Profile updated successfully');
      setOpen(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-oxanium text-xl font-semibold text-white">Edit Profile</DialogTitle>
          <DialogDescription className="text-neutral-400">
            Update your bio and social links. All fields are optional.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <IconLoader2 className="size-8 animate-spin text-neutral-400" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Bio */}
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about yourself..."
                        className="min-h-24 resize-none"
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormDescription>Max 160 characters</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Website URL */}
              <FormField
                control={form.control}
                name="websiteUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <IconWorld className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-500" />
                        <Input
                          placeholder="https://yourwebsite.com"
                          className="pl-10"
                          {...field}
                          value={field.value ?? ''}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Twitter/X Username */}
              <FormField
                control={form.control}
                name="twitterUsername"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>X (Twitter)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <IconBrandX className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-500" />
                        <Input placeholder="username" className="pl-10" {...field} value={field.value ?? ''} />
                      </div>
                    </FormControl>
                    <FormDescription>Your X username without the @</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* LinkedIn URL */}
              <FormField
                control={form.control}
                name="linkedinUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <IconBrandLinkedin className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-500" />
                        <Input
                          placeholder="https://linkedin.com/in/username"
                          className="pl-10"
                          {...field}
                          value={field.value ?? ''}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={isPending}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <>
                      <IconLoader2 className="size-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

EditProfileDialog.displayName = 'EditProfileDialog';
export { EditProfileDialog };
