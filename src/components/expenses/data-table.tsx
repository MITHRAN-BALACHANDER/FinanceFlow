'use client';

import * as React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { ExpenseForm } from './expense-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { Expense } from '@/lib/types';
import { getColumns } from './columns';
import { PageHeader } from '../PageHeader';
import { Input } from '../ui/input';
import { useAuth } from '@/context/AuthContext';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  deleteDoc,
  doc,
  orderBy,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function ExpensesDataTable() {
  const { user } = useAuth();
  const [data, setData] = React.useState<Expense[]>([]);
  const [open, setOpen] = React.useState(false);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  // Compose Firestore query with sorting (currently only supports one sort)
  React.useEffect(() => {
    if (!user?.uid || !db) return;

    // Build base query with userId filter
    let q = query(collection(db, 'expenses'), where('userId', '==', user.uid));

    // Apply sorting if set (only one column supported here for example)
    if (sorting.length > 0) {
      const sort = sorting[0];
      q = query(q, orderBy(sort.id, sort.desc ? 'desc' : 'asc'));
    }

    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const expensesData = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          date:
            data.date && typeof data.date.toDate === 'function'
              ? data.date.toDate()
              : data.date || null,
        } as Expense;
      });
      setData(expensesData);
    });

    return () => unsubscribe();
  }, [user?.uid, db, sorting]); // re-run if sorting changes

  const deleteExpense = React.useCallback(
    async (id: string) => {
      if (!db) return;
      await deleteDoc(doc(db, 'expenses', id));
    },
    [db]
  );

  const addExpense = async (expense: Omit<Expense, 'id'>) => {
    if (!user?.uid || !db) return;
    await addDoc(collection(db, 'expenses'), { ...expense, userId: user.uid });
  };

  const columns = React.useMemo(() => getColumns({ deleteExpense }), [deleteExpense]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  // For DialogContent accessibility warning:
  // Provide id for description and link aria-describedby
  const dialogDescriptionId = "dialog-description";

  return (
    <div>
      <PageHeader title="Expenses">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent
            className="sm:max-w-[425px]"
            aria-describedby={dialogDescriptionId} // Fixes accessibility warning
          >
            <DialogHeader>
              <DialogTitle>Add Expense</DialogTitle>
              {/* Add description element for screen readers */}
              <p id={dialogDescriptionId} className="sr-only">
                Form to add a new expense
              </p>
            </DialogHeader>
            <ExpenseForm onSubmit={addExpense} setOpen={setOpen} />
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by description..."
          value={(table.getColumn('description')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('description')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
