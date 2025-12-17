import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "../ui/sidebar";
import {getRandomTextColor } from "../Global/CustomStyles/styles";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import {
  Book,
  ChevronDown,
  ChevronUp,
  FolderLock,
  GraduationCap,
  Home,
  Images,
  ShieldCheck,
  User2,
  UserLock,
  // Users2,
  Video,
  MessageCircle,
  Bell,
  Share2,
  Folder,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useState, useEffect } from "react";

const SidebarLink = ({
  to,
  icon: Icon,
  label,
}: {
  to: string;
  icon: any;
  label: string;
}) => {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const isActive = currentPath === to || currentPath.startsWith(to);

  return (
    <SidebarMenuButton
      asChild
      className={cn(
        "flex items-center gap-2 rounded-md px-3 py-2 transition-all hover:bg-gray-100 dark:hover:bg-gray-800",
        isActive ? "bg-blue-600 text-white font-semibold" : ""
      )}
    >
      <Link to={to}>
        <Icon className="h-4 w-4" />
        {label}
      </Link>
    </SidebarMenuButton>
  );
};

interface AnimatedCollapsibleProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

const AnimatedCollapsible = ({
  title,
  children,
  defaultOpen = false,
  className,
}: AnimatedCollapsibleProps) => {
  const storageKey = `sidebar-${title.toLowerCase().replace(/\s+/g, "-")}`;

  const [isOpen, setIsOpen] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved !== null ? JSON.parse(saved) : defaultOpen;
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(isOpen));
  }, [isOpen, storageKey]);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className={cn("group/collapsible", className)}
    >
      <SidebarGroup>
        <SidebarGroupLabel asChild>
          <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-sm font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180">
            {title}
            <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
          </CollapsibleTrigger>
        </SidebarGroupLabel>
        <CollapsibleContent className="overflow-hidden transition-all duration-200 ease-in-out data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
          <SidebarGroupContent>
            <SidebarMenu className="py-1">{children}</SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
};

export const AppSidebar = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };

  return (
    <Sidebar collapsible="icon">
      {/* Header */}
      <SidebarHeader className="py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <span className={`text-xl font-bold tracking-wide ${getRandomTextColor()}`}>MIA-BF</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarSeparator />

     
      <AnimatedCollapsible title="Administration">
       / <SidebarMenuItem>
          <SidebarLink to="/dashboard/role" icon={UserLock} label="Role" />
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarLink
            to="/dashboard/permission"
            icon={ShieldCheck}
            label="Permissions"
          />
        </SidebarMenuItem>
        
        
       
       
        <SidebarMenuItem>
          <SidebarLink
            to="/dashboard/users"
            icon={GraduationCap}
            label="Users"
          />
        </SidebarMenuItem>
      </AnimatedCollapsible>

      <AnimatedCollapsible title="Messagerie & Contacts">
        <SidebarMenuItem>
          <SidebarLink
            to="/dashboard/messages"
            icon={MessageCircle}
            label="Messages"
          />
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarLink
            to="/dashboard/notifications"
            icon={Bell}
            label="Notifications"
          />
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarLink
            to="/dashboard/contact"
            icon={GraduationCap}
            label="Contacts"
          />
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarLink
            to="/dashboard/categorie"
            icon={Folder}
            label="Catégories"
          />
        </SidebarMenuItem>
      </AnimatedCollapsible>

     
    

      {/* Content */}
      <SidebarContent>
        {/* Groupe Fonctionnalités */}
        <SidebarGroup>
         
          <SidebarGroupAction>
            <span className="sr-only">Add Project</span>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu className="flex flex-col gap-2.5">
              <SidebarMenuItem>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 className="h-4 w-4" />
                  {user ? <p>{user?.nom}</p> : <p>MIA-BF</p>}
                  <ChevronUp className="ml-auto h-4 w-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="bg-red-500 cursor-pointer"
                >
                  Deconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};