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
    <div className="w-full">
      <PageHeader title="Expenses">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <PlusCircle className="mr-2 h-4 w-4" /> 
              <span className="hidden xs:inline">Add Expense</span>
              <span className="xs:hidden">Add</span>
            </Button>
          </DialogTrigger>
          <DialogContent
            className="mx-4 w-[calc(100vw-2rem)] max-w-[425px] sm:mx-0 sm:w-full"
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
          className="w-full max-w-sm"
        />
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block rounded-md border">
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

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => {
            const expense = row.original as Expense;
            return (
              <div key={row.id} className="bg-white border rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">
                      {expense.description}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {expense.category}
                    </p>
                  </div>
                  <div className="text-right ml-2 flex-shrink-0">
                    <p className="font-semibold text-sm">
                       ₹{expense.amount?.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {expense.date ? new Date(expense.date).toLocaleDateString() : 'No date'}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs text-gray-400">
                   {expense.paymentMethod}
                  </span>
                  <div className="flex space-x-1">
                    {/* Action buttons would be rendered here based on your columns setup */}
                    {row.getVisibleCells()
                      .filter(cell => cell.column.id === 'actions')
                      .map((cell) => (
                        <div key={cell.id} className="flex space-x-1">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No results.</p>
          </div>
        )}
      </div>

      {/* Responsive Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 sm:space-x-2 py-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="w-20"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="w-20"
          >
            Next
          </Button>
        </div>
        
        {/* Page info - hidden on very small screens */}
        <div className="hidden sm:block text-sm text-gray-500">
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount()}
        </div>
      </div>
    </div>
  );
}