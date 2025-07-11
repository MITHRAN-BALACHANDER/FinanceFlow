
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { useState } from 'react';
import { Landmark } from 'lucide-react';

const incomeFormSchema = z.object({
  monthlyIncome: z.coerce.number().positive('Income must be a positive number.'),
});

type IncomeFormValues = z.infer<typeof incomeFormSchema>;

interface SetIncomeDialogProps {
  onSubmit: (data: IncomeFormValues) => void;
  currentIncome?: number;
}

export function SetIncomeDialog({ onSubmit, currentIncome }: SetIncomeDialogProps) {
    const [open, setOpen] = useState(false);

    const form = useForm<IncomeFormValues>({
        resolver: zodResolver(incomeFormSchema),
        defaultValues: {
            monthlyIncome: currentIncome || 0,
        },
    });
    
    // Update default value if currentIncome changes after initial render
    useState(() => {
        form.reset({ monthlyIncome: currentIncome || 0 });
    });


    const handleSubmit = (data: IncomeFormValues) => {
        onSubmit(data);
        setOpen(false);
    };


  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
        <Button variant="outline">
            <Landmark className="mr-2 h-4 w-4" /> Set Income
        </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
            <DialogTitle>Set Monthly Income</DialogTitle>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            <FormField
                control={form.control}
                name="monthlyIncome"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Monthly Income</FormLabel>
                    <FormControl>
                    <Input type="number" placeholder="2500.00" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <Button type="submit" className="w-full">Save Income</Button>
            </form>
        </Form>
        </DialogContent>
    </Dialog>
  );
}
