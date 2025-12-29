import { Link, useNavigate } from "@tanstack/react-router";
import { SidebarTrigger } from "../ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { LogOut, Moon, Sun, User } from "lucide-react";
import { useTheme } from "../providers/theme-provider";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useAuthStore } from "@/store/authStore";
import { NotificationBell } from "../privates/notifications/NotificationBell";

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <nav className="p-4 flex items-center justify-between sticky top-0  z-10 bg-background/90 backdrop-blur">
      {/* LEFT  */}
      <SidebarTrigger className="cursor-pointer" />

      {/* RIGHT  */}
      <div className="flex items-center gap-4">
        <Link to="/dashboard">Statistiques</Link>

        {/* NOTIFICATION BELL */}
        <NotificationBell />

        {/* THEME TOGGLE BUTTON (simplifié) */}
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {isDark ? (
            <Moon className="h-[1.2rem] w-[1.2rem]" />
          ) : (
            <Sun className="h-[1.2rem] w-[1.2rem]" />
          )}
        </Button>

        {/* USERS MENU  */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-white font-semibold">
                {user?.prenom?.charAt(0).toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" sideOffset={8} className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.prenom} {user?.nom}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild className="cursor-pointer">
              <Link to="/dashboard/profile" className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                <span>Mon Profil</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Déconnexion</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;
