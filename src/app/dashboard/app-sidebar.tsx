"use client"

import * as React from "react"

import { NavProjects } from "@/app/dashboard/nav-projects"
import { NavUser } from "@/app/dashboard/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  CommandIcon,
  CarParking02Icon,
} from "@hugeicons/core-free-icons"
import { Link } from "react-router"
import { useUser } from "@/hooks/use-user"
import { useTranslation } from "react-i18next"
import { ROUTES } from "@/lib/routes"

export const AppSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  const user = useUser()
  const { t } = useTranslation()

  const data = {
    projects: [
      {
        icon: <HugeiconsIcon icon={CarParking02Icon} strokeWidth={2} />,
        name: ROUTES.users.label(),
        url: ROUTES.users.route,
				userRole: user.getRole
      },
    ],
    user: {
      avatar: "/avatars/shadcn.jpg",
      email: user.getIdentifier,
      name: user.getName,
    },
  }
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <HugeiconsIcon
                    icon={CommandIcon}
                    strokeWidth={2}
                    className="size-4"
                  />
                </div>
                <p className="grid flex-1 rtl:text-right text-sm leading-tight">
                  <span className="truncate font-medium">
                    {t("institute.name")}
                  </span>
                  <span className="truncate text-xs">
                    {t("institute.plan")}
                  </span>
                </p>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
