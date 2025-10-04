import * as React from "react";
import "./globals.css";
import { AppSidebar } from "@/src/app/components/app-sidebar";
import { ThemeProvider } from "@/src/app/components/theme-provider";
import { Separator } from "@/src/app/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/src/app/components/ui/sidebar";
import { Toaster } from "@/src/app/components/ui/sonner";
import { cn } from "@/src/app/lib/utils";
import { Inter as FontSans } from "next/font/google";
import { Button } from "@/src/app/components/ui/button";
import {isNotEmpty,} from "../../utils/common/common-function/common-function";
import { cookies } from "next/headers";
import { BreadcrumbNav } from "../components/customized/breadcrum-nav";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  preload: false,
});

// Dummy user — replace with session later
let mockUser = {
  name: "Rithik Nadar",
  emailId: "rithik@example.com",
  mobileNo: "9876543210",
  avatar: "/assets/images/avatar.png",
};

// Raw menuList (flat from DB)
let mockMenuList = [
  { ID: 84, MENU: "Reports", PARENTMENUID: 0, SOURCELINK: {}, ORDERID: 2 },
  { ID: 85,MENU: "Report 1",PARENTMENUID: 84,SOURCELINK: "/ui/reports/report1",ORDERID: {},},
  { ID: 89,MENU: "Report 2",PARENTMENUID: 84,SOURCELINK: "/ui/reports/report2",ORDERID: {},},
  { ID: 22, MENU: "Masters", PARENTMENUID: 0, SOURCELINK: {}, ORDERID: 1 },
  { ID: 23, MENU: "Menu", PARENTMENUID: 0, SOURCELINK: {}, ORDERID: 3 },
  { ID: 31,MENU: "Menu",PARENTMENUID: 23,SOURCELINK: "/ui/menu",ORDERID: {},},
  { ID: 32,MENU: "Menu Permission",PARENTMENUID: 23,SOURCELINK: "/ui/menu/menu-permission",ORDERID: {},},
  { ID: 33, MENU: "User", PARENTMENUID: 0, SOURCELINK: {}, ORDERID: 4 },
  { ID: 34,MENU: "User",PARENTMENUID: 33,SOURCELINK: "/ui/user",ORDERID: {},},
  { ID: 35,MENU: "User Group",PARENTMENUID: 33,SOURCELINK: "/ui/user/user-group",ORDERID: {},},
  { ID: 36, MENU: "Valuation Uploads", PARENTMENUID: 0, SOURCELINK: {}, ORDERID: 5 },
  { ID: 37, MENU: "Upload", PARENTMENUID: 36, SOURCELINK: "/ui/valuation-uploads", ORDERID: {},},
];

export const GoToLogin = () => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Unauthorized</h1>
          <p className="text-lg mb-4">
            You are not authorized to view this page.
          </p>
          <p className="text-sm text-gray-500">
            Please log in to access the application.
          </p>

          <a className="mt-4" href="/ui/login">
            <Button className="mt-4">Go to Login</Button>
          </a>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const defaultOpen = true;

  if (!isNotEmpty((await cookies()).get("sessionID")?.value)) {
    return <GoToLogin />;
  }


  let menuList = (await cookies()).get("menu")?.value ?? [];

  return (
    // REMOVED: <html> and <body> tags
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider defaultOpen={defaultOpen}>
        <div className="flex h-screen w-full transition-all duration-300 ease-in-out">
          {/* Sidebar */}
          <div
            className={cn(
              "flex-shrink-0 overflow-hidden transition-all duration-300 ease-in-out",
              "group-data-[state=collapsed]/sidebar-wrapper:w-16",
              "group-data-[state=expanded]/sidebar-wrapper:w-[30%] group-data-[state=expanded]/sidebar-wrapper:max-w-xs"
            )}
          >
            <AppSidebar user={userData} menuList={menuList} />
          </div>

          {/* Main content area */}
          <div
            className={cn(
              "flex-1 min-w-0 transition-all duration-300 ease-in-out",
              "group-data-[state=collapsed]/sidebar-wrapper:w-[calc(100%-4rem)]",
              "group-data-[state=expanded]/sidebar-wrapper:w-[70%]"
            )}
          >
            <SidebarInset>
              {/* Header */}
              <header className="flex h-10 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-10">
                <div className="flex items-center gap-2 px-4 w-full">
                  <SidebarTrigger className="w-7 h-7" variant="outline" />
                  <Separator
                    orientation="vertical"
                    className="mr-2 data-[orientation=vertical]:h-6"
                  />
                  <BreadcrumbNav menuList={menuList} />
                </div>
              </header>

              {/* Scrollable content area */}
              <div className="h-[calc(100vh-4rem)] flex flex-col">
                <div className="flex-1 overflow-hidden flex flex-col">
                  <div className="flex-1 overflow-y-auto p-3">
                    {children}
                  </div>
                </div>
              </div>

              <Toaster />
            </SidebarInset>
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}