'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Measurement, MeasurementFormData, MeasurementImage } from '@/lib/types/measurement';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { X } from 'lucide-react';
import { useMeasurementService } from '@/lib/hooks/useMeasurementService';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(1, 'Description is required'),
  normalValue: z.string().min(1, 'Normal value is required'),
  searchTerms: z.array(z.string()),
  references: z.array(z.string()).optional().default([]),
  images: z.array(z.object({
    caption: z.string(),
    url: z.string(),
    file: z.any().optional(),
  })),
});

interface MeasurementFormProps {
  measurement?: Measurement | null;
  onClose: () => void;
}

export function MeasurementForm({ measurement, onClose }: MeasurementFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const measurementService = useMeasurementService();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: measurement?.title || '',
      category: measurement?.category || '',
      description: measurement?.description || '',
      normalValue: measurement?.normalValue || '',
      searchTerms: measurement?.searchTerms || [],
      references: measurement?.references || [],
      images: measurement?.images || [],
    },
  });

  const handleImageUpload = async (file: File): Promise<MeasurementImage> => {
    if (!measurement?.id) {
      // For new measurements, we'll use a temporary ID
      const tempId = Date.now().toString();
      return measurementService.uploadImage(file, tempId);
    }
    return measurementService.uploadImage(file, measurement.id);
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);

      // Handle image uploads first
      const imagePromises = data.images
        .filter((img) => img.file)
        .map((img) => handleImageUpload(img.file as File));

      const uploadedImages = await Promise.all(imagePromises);
      const existingImages = data.images.filter((img) => !img.file);

      const finalData: MeasurementFormData = {
        ...data,
        images: [...existingImages, ...uploadedImages],
      };

      if (measurement?.id) {
        await measurementService.update(measurement.id, finalData);
        toast({
          title: 'Success',
          description: 'Measurement updated successfully',
        });
      } else {
        await measurementService.create(finalData);
        toast({
          title: 'Success',
          description: 'Measurement created successfully',
        });
      }

      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save measurement',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;

    const newImages = Array.from(files).map((file) => ({
      caption: file.name,
      url: URL.createObjectURL(file),
      file,
    }));

    const currentImages = form.getValues('images');
    form.setValue('images', [...currentImages, ...newImages]);
  };

  const removeImage = (index: number) => {
    const currentImages = form.getValues('images');
    const newImages = currentImages.filter((_, i) => i !== index);
    form.setValue('images', newImages);
  };

  const handleSearchTermsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const terms = event.target.value.split(',').map((term) => term.trim());
    form.setValue('searchTerms', terms);
  };

  const handleReferencesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const refs = event.target.value.split(',').map((ref) => ref.trim());
    form.setValue('references', refs);
  };

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {measurement ? 'Edit Measurement' : 'Add New Measurement'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="normalValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Normal Value</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="searchTerms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Search Terms (comma-separated)</FormLabel>
                  <FormControl>
                    <Input
                      value={field.value.join(', ')}
                      onChange={handleSearchTermsChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="references"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>References (comma-separated)</FormLabel>
                  <FormControl>
                    <Input
                      value={field.value.join(', ')}
                      onChange={handleReferencesChange}
                      placeholder="e.g., Smith et al. 2020, Journal of Radiology 2019"
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Optional: Add references for the normal values
                  </p>
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Images</FormLabel>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="mb-4"
              />

              <div className="grid grid-cols-2 gap-4">
                {form.watch('images').map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image.url}
                      alt={image.caption}
                      className="w-full h-40 object-cover rounded-md"
                    />
                    <Input
                      value={image.caption}
                      onChange={(e) => {
                        const images = form.getValues('images');
                        images[index].caption = e.target.value;
                        form.setValue('images', images);
                      }}
                      className="mt-2"
                      placeholder="Image caption"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 