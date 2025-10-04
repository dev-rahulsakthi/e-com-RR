// import { create } from "zustand";
// import { devtools, persist } from "zustand/middleware";

// interface MenuState {
//   currentMenu: string | null;
//   currentSubMenu: string | null;
//   setCurrentMenu: (
//     menu: string | null | ((prev: string | null) => string | null)
//   ) => void;
//   setCurrentSubMenu: (submenu: string | null) => void;
// }

// const useMenuStore = create<MenuState>()(
//   persist(
//     (set) => ({
//       currentMenu: null,
//       currentSubMenu: null,
//       setCurrentMenu: (menu) =>
//         set((state) => ({
//           currentMenu:
//             typeof menu === "function" ? menu(state.currentMenu) : menu,
//         })),
//       setCurrentSubMenu: (submenu) => set({ currentSubMenu: submenu }),
//     }),
//     {
//       name: "menu-store", // unique name for localStorage
//     }
//   )
// );
 
// const GridStore = (set: any) => ({
//   pageLength: 15,
//   subGridPageLength: 15,
//   setPageLength: (pagelength: number) =>
//     set(() => ({ pageLength: pagelength })),
//   setSubGridPageLength: (pagelength: number) =>
//     set(() => ({ subGridPageLength: pagelength })),
// });
// const useGridStore = create(
//   devtools(
//     persist(GridStore, {
//       name: "grid-store",
//       partialize: (state) => ({
//         pageLength: state.pageLength,
//         subGridPageLength: state.subGridPageLength,
//       }),
//     })
//   )
// );

// interface LogoState {
//   logoImage: string | null;
//   setLogoImage: (imageBase64: string) => void;
// }
// const useLogoStore = create<LogoState>()(
//   persist(
//     (set) => ({
//       logoImage: "",
//       setLogoImage: (imageBase64: string) => set({ logoImage: imageBase64 }),
//     }),
//     {
//       name: "company-logo",
//     }
//   )
// );
// export { useMenuStore, useGridStore, useLogoStore };
