
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AreaChart, LayoutDashboard, LoaderCircle, LogIn, LogOut, ReceiptText, Shapes, Target, User as UserIcon, Wallet } from 'lucide-react';
import { SidebarProvider, Sidebar, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset, SidebarHeader, SidebarTrigger, SidebarFooter } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { BottomNavbar } from '@/components/BottomNavbar';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/expenses', label: 'Expenses', icon: ReceiptText },
  { href: '/budgets', label: 'Budgets', icon: Target },
  { href: '/reports', label: 'Reports', icon: AreaChart },
  { href: '/categories', label: 'Categories', icon: Shapes },
];

const mobileNavItems = [
    ...navItems.slice(0, 4), // Show first 4 items
    { href: '/profile', label: 'Profile', icon: UserIcon },
];


function UserNav() {
  const { user, loading, logIn, logOut } = useAuth();

  if (loading) {
    return <Skeleton className="h-9 w-9 rounded-full" />;
  }

  if (!user) {
    return (
      <Button onClick={logIn}>
        <LogIn className="mr-2 h-4 w-4" />
        Login
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={cn("relative h-8 w-8 rounded-full", "group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:w-10")}>
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.photoURL || "https://placehold.co/40x40"} alt={user.displayName || "User"} />
            <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile">
            <UserIcon className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const isMobile = useIsMobile();
  
  if (loading) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
        </div>
    )
  }

  if (!user) {
    // This could be a dedicated login page
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-background">
        <div className="flex items-center gap-2 mb-8">
            <Wallet className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">FinanceFlow</h1>
        </div>
        <p className="mb-4 text-muted-foreground">Please log in to continue</p>
        <UserNav />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
              <Wallet className="h-5 w-5 text-primary" />
            </Button>
            <h1 className="text-xl font-bold text-white group-data-[collapsible=icon]:hidden">FinanceFlow</h1>
          </div>
        </SidebarHeader>
        <SidebarMenu className="flex-1">
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.label}
                >
                  <div>
                    <item.icon />
                    <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                  </div>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <SidebarFooter>
            <div className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
              <UserNav />
            </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <div className="flex items-center gap-2 md:hidden">
                <Wallet className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold">FinanceFlow</h1>
            </div>
            <div className="hidden md:block">
              <SidebarTrigger />
            </div>
            <div className="md:hidden">
              <UserNav />
            </div>
        </header>
        <main className="p-4 sm:px-6 sm:py-0 pb-20 md:pb-0">
         {children}
        </main>
        {isMobile && <BottomNavbar navItems={mobileNavItems} />}
      </SidebarInset>
    </SidebarProvider>
  );
}
