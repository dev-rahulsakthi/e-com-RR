"use client"

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/src/app/components/ui/breadcrumb"
import { usePathname } from "next/navigation"
import React from "react"

type MenuItem = {
  ID: number
  MENU: string
  PARENTMENUID: number
  SOURCELINK: string | object
  ORDERID: number | object
}

// ✅ Build breadcrumb trail (exact match > startsWith)
const getBreadcrumbTrail = (menuList: MenuItem[], currentPath: string) => {
  // Step 1: Exact match first
  let currentMenu = menuList.find(
    (item) => typeof item.SOURCELINK === "string" && item.SOURCELINK === currentPath
  )

  // Step 2: Fallback → startsWith
  if (!currentMenu) {
    currentMenu = menuList.find(
      (item) =>
        typeof item.SOURCELINK === "string" &&
        item.SOURCELINK !== "" &&
        currentPath.startsWith(item.SOURCELINK as string)
    )
  }

  if (!currentMenu) return []

  const trail = [currentMenu]
  let parentId = currentMenu.PARENTMENUID

  // Climb up parent menus
  while (parentId !== 0) {
    const parent = menuList.find((item) => item.ID === parentId)
    if (parent) {
      trail.unshift(parent)
      parentId = parent.PARENTMENUID
    } else {
      break
    }
  }

  return trail
}

export function BreadcrumbNav({ menuList }: { menuList: MenuItem[] }) {
  const pathname = usePathname()
  const trail = getBreadcrumbTrail(menuList, pathname)

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {trail.map((item, index) => (
            <React.Fragment key={item.ID}>
              <BreadcrumbItem>
                {index < trail.length - 1 ? (
                  <BreadcrumbLink
                  >
                    {item.MENU}
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage className="font-semibold">{item.MENU}</BreadcrumbPage>
                )}
              </BreadcrumbItem>

              {index < trail.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
} 