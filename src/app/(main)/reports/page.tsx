'use client';

import { PageHeader } from "@/components/PageHeader";
import { CategorySpendingChart } from "@/components/reports/CategorySpendingChart";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { type Expense } from "@/lib/types";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function ReportsPage() {
    const { user } = useAuth();
    const [expenses, setExpenses] = useState<Expense[]>([]);

    useEffect(() => {
        if(user && db) {
            const q = query(collection(db, "expenses"), where("userId", "==", user.uid));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const userExpenses = snapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        ...data,
                        date: data.date.toDate()
                    } as Expense;
                });
                setExpenses(userExpenses);
            });
            return () => unsubscribe();
        }
    }, [user]);

    return (
        <>
            <PageHeader title="Reports" />
            <div className="grid gap-6">
                <CategorySpendingChart data={expenses} />
            </div>
        </>
    )
}
