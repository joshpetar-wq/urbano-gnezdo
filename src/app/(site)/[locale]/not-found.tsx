import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap section">
      <p className="h1">404</p>
      <p className="lead mt-4">Страницата не е пронајдена. / Page not found.</p>
      <p className="mt-8 flex gap-3">
        <Link href="/mk" className="btn btn-primary">Почетна</Link>
        <Link href="/en" className="btn btn-ghost">Home</Link>
      </p>
    </div>
  );
}
