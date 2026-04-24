import Header from "./Header";
import Footer from "./Footer";

export default function PageShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-[1200px] px-6 sm:px-10 lg:px-16">
      <Header />
      <main className="pb-16">{children}</main>
      <Footer />
    </div>
  );
}
