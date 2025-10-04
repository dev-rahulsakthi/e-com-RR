export const metadata = {
  title: "Dristi PF",
  description: "Dristi PF",
  icons: {
    icon: "/assets/images/JADE.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
