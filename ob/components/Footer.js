
export default function Footer() {
  return (
    <footer className="bg-surface shadow-md py-4 mt-auto">
      <div className="container mx-auto px-4 text-center text-text-secondary">
        <p>&copy; {new Date().getFullYear()} Grant Website. All rights reserved.</p>
      </div>
    </footer>
  );
}