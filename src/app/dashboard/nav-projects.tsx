"use client"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link } from "react-router"
import { t } from "i18next"
import type { Role } from "@/types"

export const NavProjects = ({
  projects,
}: {
  readonly projects: {
    name: string
    url: string
    icon: React.ReactNode
		role: Role
		userRole: Role
  }[]
}) => (
	<SidebarGroup className="group-data-[collapsible=icon]:hidden">
		<SidebarGroupLabel>{t("nav.projects.title")}</SidebarGroupLabel>
		<SidebarMenu>
			{projects.map((item) => (
				<SidebarMenuItem key={item.name}>
					<SidebarMenuButton asChild {...(item.userRole !== 'manager' && item.role === 'manager' ? { 'aria-disabled': 'true' } : {})}>
						<Link to={item.url}>
							{item.icon}
							<span>{item.name}</span>
						</Link>
					</SidebarMenuButton>
				</SidebarMenuItem>
			))}
		</SidebarMenu>
	</SidebarGroup>
)
