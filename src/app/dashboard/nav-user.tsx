"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  UnfoldMoreIcon,
  LogoutIcon,
} from "@hugeicons/core-free-icons"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import { useTranslation } from "react-i18next"
import { useDir } from "@/hooks/use-dir"
import { User } from "@/lib/user"
import { Role } from "@/types"

export const NavUser = ({
  user,
}: {
  readonly user: {
    name: string
    email: string
    avatar: string
		role: Role
  }
}) => {
  const { isMobile } = useSidebar()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const dir = useDir()

  const signOut = async () => {
    const [success, result] = await User.signOut()
    if (!success) {
      toast.error(t(result))
      return
    }
    toast.success(t(result))
    await navigate("/login")
  }

	const monogram = user.name
		.split(" ")
		.map((part) => part.trim())
		.filter(Boolean)
		.map((part) => part[0])
		.join("")

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu dir={dir}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className={`rtl:text-right data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground`}
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">
									{monogram}
								</AvatarFallback>
              </Avatar>
              <p className="grid flex-1 text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </p>
              <HugeiconsIcon
                icon={UnfoldMoreIcon}
                strokeWidth={2}
                className="ml-auto size-4"
              />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel dir={dir} className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">{monogram}</AvatarFallback>
                </Avatar>
                <p className="grid flex-1 rtl:text-right text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
									<span className="truncate text-xs">{user.role} - {user.email}</span>
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Select
              onValueChange={(value) => {
                i18n.changeLanguage(value).catch(() => undefined)
              }}
            >
              <SelectTrigger dir={dir} className="w-full">
                <SelectValue placeholder={t("nav.user.change_language")} />
              </SelectTrigger>
              <SelectContent dir={dir}>
                <SelectGroup>
                  <SelectLabel>{t("nav.user.languages")}</SelectLabel>
                  <SelectItem value="en" disabled={i18n.language === "en"}>
                    {t("nav.user.english")}
                  </SelectItem>
                  <SelectItem value="ar" disabled={i18n.language === "ar"}>
                    {t("nav.user.arabic")}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                signOut().catch(() => undefined)
              }}
            >
              <HugeiconsIcon
                icon={LogoutIcon}
                className="rtl:rotate-180"
                strokeWidth={2}
              />
              {t("nav.user.logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
