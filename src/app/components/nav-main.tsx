// "use client";

// import * as React from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import {
//   ChevronRight,
//   ChevronDown,
//   House,
//   ChartColumn,
//   FileSliders,
//   Cog,
//   ShieldEllipsis,
//   Folder,
// } from "lucide-react";
// import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/src/app/components/ui/collapsible";
// import { useMenuStore } from "@/store";

// interface NavItem {
//   id: number | string;
//   title: string;
//   url?: string | null;
//   items?: NavItem[];
//   icon?: React.ReactNode;
// }

// interface NavMainProps {
//   items: NavItem[];
//   isCollapsed?: boolean;
// }

// export function NavMain({ items, isCollapsed = false }: NavMainProps) {
//   const pathname = usePathname();
//   const { currentMenu, setCurrentMenu, currentSubMenu, setCurrentSubMenu } = useMenuStore();

//   // State to track if we've synced with the route
//   const [hasSynced, setHasSynced] = React.useState(false);

//   // Sync with current route - run only once after mount
//   React.useEffect(() => {
//     if (pathname && !hasSynced) {
//       let foundMatch = false;

//       // Check for submenu items first
//       for (const item of items) {
//         if (item.items) {
//           for (const child of item.items) {
//             if (child.url === pathname) {
//               setCurrentSubMenu(child.title);
//               setCurrentMenu(item.title);
//               foundMatch = true;
//               break;
//             }
//           }
//         }
//         if (foundMatch) break;
//       }

//       // If no submenu match found, check for direct menu items
//       if (!foundMatch) {
//         for (const item of items) {
//           if (item.url === pathname) {
//             setCurrentSubMenu(item.title);
//             setCurrentMenu(null);
//             foundMatch = true;
//             break;
//           }
//         }
//       }

//       // If no match found and we're not on dashboard, clear the state
//       if (!foundMatch && pathname !== "/ui/dashboard") {
//         setCurrentMenu(null);
//         setCurrentSubMenu(null);
//       }

//       setHasSynced(true);
//     }
//   }, [pathname, items, setCurrentMenu, setCurrentSubMenu, hasSynced]);

//   const onMenuItemClick = React.useCallback(
//     (menuId: string) => {
//       setCurrentMenu((prev) => (prev === menuId ? null : menuId));
//     },
//     [setCurrentMenu]
//   );

//   const onSubMenuClick = React.useCallback(
//     (subId: string) => {
//       setCurrentSubMenu(subId);
//     },
//     [setCurrentSubMenu]
//   );

//   // Map icon per parent id with default icon
//   const getParentIcon = (id: number | string) => {
//     switch (id) {
//       case 1: return <House className={isCollapsed ? "h-5 w-5" : "mr-2 h-4 w-4"} />;
//       case 4: return <ChartColumn className={isCollapsed ? "h-5 w-5" : "mr-2 h-4 w-4"} />;
//       case 2: return <FileSliders className={isCollapsed ? "h-5 w-5" : "mr-2 h-4 w-4"} />;
//       case 3: return <Cog className={isCollapsed ? "h-5 w-5" : "mr-2 h-4 w-4"} />;
//       case 22: return <ShieldEllipsis className={isCollapsed ? "h-6 w-6" : "mr-2 h-5 w-5"} />;
//       default: return <Folder className={isCollapsed ? "h-5 w-5" : "mr-2 h-4 w-4"} />;
//     }
//   };

//   // Use a consistent font weight class for all menu items
//   const menuItemClass = "font-semibold"; // Always semi-bold for menu items
//   const activeSubMenuClass = "font-bold"; // Bold only for active submenu items

//   if (isCollapsed) {
//     return (
//       <div className="space-y-2">
//         {items.map((item) => {
//           const isParent = item.items && item.items.length > 0;
//           const isMenuActive = currentMenu === item.title;

//           if (isParent) {
//             return (
//               <div key={item.title} className="relative group">
//                 <Collapsible>
//                   <CollapsibleTrigger
//                     className={`flex w-full items-center justify-center rounded-lg p-2 text-sm hover:bg-accent transition-colors ${menuItemClass} ${
//                       isMenuActive ? "bg-accent" : ""
//                     }`}
//                     onClick={() => onMenuItemClick(item.title)}
//                   >
//                     {getParentIcon(Number(item.id))}
//                   </CollapsibleTrigger>
//                 </Collapsible>

//                 {/* Tooltip for collapsed menu */}
//                 <div className="absolute left-full top-0 ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 whitespace-nowrap border font-semibold">
//                   {item.title}
//                 </div>

//                 {/* Dropdown menu for collapsed state */}
//                 {currentMenu === item.title && item.items && (
//                   <div className="absolute left-full top-0 ml-1 bg-popover rounded-md shadow-lg border z-40 min-w-[160px]">
//                     <div className="p-1">
//                       {item.items.map((child) => {
//                         const activeChild = currentSubMenu === child.title;
//                         return (
//                           <Link
//                             key={child.title}
//                             href={child.url || "#"}
//                             onClick={() => {
//                               onSubMenuClick(child.title);
//                               setCurrentMenu(null);
//                             }}
//                             className={`flex items-center rounded-md px-3 py-2 text-sm hover:bg-accent transition-colors ${menuItemClass} ${
//                               activeChild ? `bg-accent ${activeSubMenuClass}` : ""
//                             }`}
//                           >
//                             {child.title}
//                           </Link>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             );
//           }

//           // Standalone item in collapsed state
//           const activeItem = currentSubMenu === item.title;
//           return (
//             <div key={item.title} className="relative group">
//               <Link
//                 href={item.url || "#"}
//                 onClick={() => onSubMenuClick(item.title)}
//                 className={`flex items-center justify-center rounded-lg p-2 text-sm hover:bg-accent transition-colors ${menuItemClass} ${
//                   activeItem ? `bg-accent ${activeSubMenuClass}` : ""
//                 }`}
//               >
//                 {getParentIcon(Number(item.id))}
//               </Link>

//               {/* Tooltip for collapsed menu */}
//               <div className="absolute left-full top-0 ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 whitespace-nowrap border font-semibold">
//                 {item.title}
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     );
//   }

//   // Expanded state
//   return (
//     <div className="space-y-1">
//       {items.map((item) => {
//         const isParent = item.items && item.items.length > 0;
//         const isOpen = currentMenu === item.title;
//         const isMenuActive = currentMenu === item.title;

//         if (isParent) {
//           return (
//             <Collapsible
//               key={item.title}
//               open={isOpen}
//               className="group/collapsible"
//             >
//               <CollapsibleTrigger
//                 className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-accent transition-colors ${menuItemClass}`}
//                 onClick={() => onMenuItemClick(item.title)}
//               >
//                 <div className="flex items-center">
//                   {getParentIcon(Number(item.id))}
//                   <span>{item.title}</span>
//                 </div>
//                 {isOpen ? (
//                   <ChevronDown className="h-4 w-4" />
//                 ) : (
//                   <ChevronRight className="h-4 w-4" />
//                 )}
//               </CollapsibleTrigger>

//               <CollapsibleContent className="CollapsibleContent">
//                 <div className="ml-4 mt-1 space-y-1">
//                   {item.items?.map((child) => {
//                     const activeChild = currentSubMenu === child.title;
//                     return (
//                       <Link
//                         key={child.title}
//                         href={child.url || "#"}
//                         onClick={() => onSubMenuClick(child.title)}
//                         className={`flex items-center rounded-md px-3 py-1.5 text-sm hover:bg-accent transition-colors ${menuItemClass} ${
//                           activeChild ? `bg-accent ${activeSubMenuClass}` : ""
//                         }`}
//                       >
//                         {child.icon && <span className="mr-2">{child.icon}</span>}
//                         {child.title}
//                       </Link>
//                     );
//                   })}
//                 </div>
//               </CollapsibleContent>
//             </Collapsible>
//           );
//         }

//         // Standalone item
//         const activeItem = currentSubMenu === item.title;
//         return (
//           <Link
//             key={item.title}
//             href={item.url || "#"}
//             onClick={() => onSubMenuClick(item.title)}
//             className={`flex items-center rounded-lg px-3 py-2 text-sm hover:bg-accent transition-colors ${menuItemClass} ${
//               activeItem ? `bg-accent ${activeSubMenuClass}` : ""
//             }`}
//           >
//             {getParentIcon(Number(item.id))}
//             {item.title}
//           </Link>
//         );
//       })}
//     </div>
//   );
// }