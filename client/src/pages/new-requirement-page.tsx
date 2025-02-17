import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Input } from '@/components/ui/input';
import { addRequirement } from '@/api/requirement';
import { useMutation } from '@tanstack/react-query';
import { Check, Loader } from 'lucide-react';

const formSchema = z.object({
  title: z.string().min(2, {
    message: 'Title must be at least 2 characters.',
  }),
  appName: z.enum(['DRIVADO', 'TRACKLIMO'], {
    required_error: 'Please select an app name.',
  }),
  carName: z.string().min(2, {
    message: 'Section Name must be at least 2 characters.',
  }),
  requirements: z
    .string()
    .min(10, {
      message: 'Bio must be at least 10 characters.',
    })
    .max(160, {
      message: 'Bio must not be longer than 30 characters.',
    }),
});

export default function NewRequirmentPage() {
  // const queryClient = useQueryClient();

  const [showSuccess, setShowSuccess] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowSuccess(false);
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [showSuccess]);

  const mutation = useMutation({
    mutationFn: addRequirement,
    onSuccess: () => {
      console.log('trigg');
      form.reset();
      setShowSuccess(true);
      // console.log('Requirement added:', data);
      // // Optionally invalidate and refetch related queries (e.g., requirement list)
      // queryClient.invalidateQueries(['requirements']);
    },
    onError: (error: any) => {
      console.error(
        'Error adding requirement:',
        error.response?.data?.message || error.message
      );
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      appName: 'DRIVADO',
      carName: '',
      requirements: '',
      title: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
  }

  return (
    <div className="max-w-sm mx-auto w-full">
      <Form {...form}>
        <h2 className="text-2xl">Fill Requirement Form</h2>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Subject" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="appName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>App Name</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a verified App to display" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem
                      className="hover:cursor-pointer"
                      value="DRIVADO"
                    >
                      DRIVADO
                    </SelectItem>
                    <SelectItem
                      className="hover:cursor-pointer"
                      value="TRACKLIMO"
                    >
                      TRACKLIMO
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="carName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Car Name</FormLabel>
                <FormControl>
                  <Input placeholder="Car Model Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="requirements"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Requirements / Updates</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us a little bit about requirement"
                    className="resize-y min-h-40"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            className="w-full flex items-center justify-center"
            type="submit"
            disabled={mutation.isPending}
          >
            {mutation.isPending && <Loader className="size-4 animate-spin" />}
            {mutation.isSuccess && showSuccess && (
              <Check className="size-4 text-green-500" />
            )}
            <span>Submit Requirement</span>
          </Button>
        </form>
      </Form>
    </div>
  );
}
