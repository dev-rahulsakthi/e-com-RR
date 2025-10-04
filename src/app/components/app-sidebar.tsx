"use client";

import * as React from "react";
import { NavMain } from "@/src/app/components/nav-main";
import { NavUser } from "@/src/app/components/nav-user";
import { ModeToggle } from "./mode-toggle";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/src/app/components/ui/sidebar";

// Raw menu type
interface RawMenuItem {
  ID: number;
  MENU: string;
  SOURCELINK?: string | null | {};
  PARENTMENUID: number;
  ORDERID?: number | {};
}

interface SidebarProps {
  user: {
    name: string;
    emailId: string;
    mobileNo: string;
    avatar: string;
  };
  menuList: RawMenuItem[];
}

// Build children recursively
function buildChildren(menuList: RawMenuItem[], parentId: number) {
  return menuList
    .filter((i) => i?.PARENTMENUID === parentId)
    .sort((a, b) => (Number(a?.ORDERID) || 0) - (Number(b?.ORDERID) || 0))
    .map((it) => ({
      id: it.ID,
      title: it.MENU,
      url:
        it.SOURCELINK && typeof it.SOURCELINK !== "object"
          ? String(it.SOURCELINK)
          : null,
      items: buildChildren(menuList, it.ID),
    }));
}

// Build top-level menus
function buildMenuTree(menuList: RawMenuItem[]) {
  return menuList
    .filter(
      (ele, ind) =>
        ind === menuList.findIndex((elem) => elem.MENU === ele.MENU)
    )
    .filter((i) => i?.PARENTMENUID === 0)
    .sort((a, b) => (Number(a?.ORDERID) || 0) - (Number(b?.ORDERID) || 0))
    .map((it) => ({
      id: it.ID,
      title: it.MENU,
      url:
        it.SOURCELINK && typeof it.SOURCELINK !== "object"
          ? String(it.SOURCELINK)
          : null,
      items: buildChildren(menuList, it.ID),
    }));
}

export function AppSidebar({ user, menuList }: SidebarProps) {
  // transform raw flat menu into nested
  const navMain = React.useMemo(() => buildMenuTree(menuList), [menuList]);

  // Use the sidebar hook to get collapsed state
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center justify-center space-x-2">
          <a href="/dashboard" className="flex items-center">
            <img
              alt="Company Logo"
              src="/assets/images/kotaklogo.png"
              className="w-[90%] h-[90%] rounded-full"
            />
          </a>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <NavMain items={navMain} isCollapsed={isCollapsed} />
      </SidebarContent>

      <SidebarFooter className="p-2">
        <div className={`${isCollapsed ? 'flex justify-center mb-2' : 'flex justify-start mb-2'}`}>
          <ModeToggle />
        </div>
        <NavUser user={user} isCollapsed={isCollapsed} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}