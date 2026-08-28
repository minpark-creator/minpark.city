import Header from "./Header";
import Footer from "./Footer";
import BackToTop from "./BackToTop";

type Props = {
  children: React.ReactNode;
  /** Small uppercase label above the page title. */
  eyebrow?: string;
  title?: string;
  /** One line under the title, in serif. */
  intro?: string;
  /** Tint behind the page header. "none" leaves it white. */
  wash?: "blue" | "lime" | "pink" | "none";
};

/**
 * Every inner page opens the same way: a tinted band carrying an eyebrow, a
 * big blue title and an optional line of prose, then the content on white.
 * The top padding clears the fixed header.
 */
export default function PageShell({
  children,
  eyebrow,
  title,
  intro,
  wash = "blue",
}: Props) {
  return (
    <>
      <Header />

      <main>
        {title && (
          <section className={wash === "none" ? undefined : `wash-${wash}`}>
            <div className="px-4 sm:px-5 pt-[112px] sm:pt-[150px] pb-10 sm:pb-14">
              {eyebrow && <p className="label eyebrow">{eyebrow}</p>}
              <h1 className="display mt-3 text-[24px] sm:text-[37px] max-w-[24ch]">
                {title}
              </h1>
              {intro && (
                <p className="mt-5 max-w-[62ch] text-muted">
                  {intro}
                </p>
              )}
            </div>
          </section>
        )}

        <div
          className={`px-4 sm:px-5 ${
            title ? "" : "pt-[112px] sm:pt-[150px]"
          } pb-20`}
        >
          {children}
        </div>
      </main>

      <Footer />
      <BackToTop />
    </>
  );
}
