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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { categories, type Budget } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { useState } from 'react';
import { PlusCircle } from 'lucide-react';


const budgetFormSchema = z.object({
  amount: z.coerce.number().positive('Amount must be a positive number.'),
  category: z.enum(categories),
});

type BudgetFormValues = z.infer<typeof budgetFormSchema>;

interface AddBudgetDialogProps {
  onSubmit: (data: Omit<Budget, 'id' | 'userId'>) => void;
}

export function AddBudgetDialog({ onSubmit }: AddBudgetDialogProps) {
    const [open, setOpen] = useState(false);

    const form = useForm<BudgetFormValues>({
        resolver: zodResolver(budgetFormSchema),
        defaultValues: {
            amount: 0,
        },
    });

    const handleSubmit = (data: BudgetFormValues) => {
        onSubmit(data);
        setOpen(false);
        form.reset();
    };


  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
        <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Set Budget
        </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
            <DialogTitle>Set Budget</DialogTitle>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                    </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Budget Amount</FormLabel>
                    <FormControl>
                    <Input type="number" placeholder="300.00" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <Button type="submit" className="w-full">Save Budget</Button>
            </form>
        </Form>
        </DialogContent>
    </Dialog>
  );
}
