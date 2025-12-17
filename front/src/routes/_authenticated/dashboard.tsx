import { AppSidebar } from '@/components/privates/app-sidebar'
import Navbar from '@/components/privates/Navbar'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { SidebarProvider } from '@/components/ui/sidebar'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import Cookies from "js-cookie";

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: DashboardLayout,
})

function DashboardLayout() {
  const defaultOpen = Cookies.get("sidebar_state") === "true";

  // const { auth } = Route.useRouteContext()
  // const [isLoggingOut, setIsLoggingOut] = useState(false)

  // const handleLogout = () => {
  //   setIsLoggingOut(true)
  //   auth.logout()
  // }

  return (
     <ThemeProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <main className="w-full">
          <Navbar /> 
          <div className="p-4">
            <Outlet />
          </div>
        </main>
      </SidebarProvider>
    </ThemeProvider>
  )
}