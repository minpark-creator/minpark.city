export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 pt-8 pb-10 text-[13px] text-muted">
      <span>©{year}</span>
    </footer>
  );
}
