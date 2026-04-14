import MainHeader from "@/components/headers/MainHeader";
import MainFooter from "@/components/footer/MainFooter";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MainHeader />
      {children}
      <MainFooter />
    </>
  );
}
