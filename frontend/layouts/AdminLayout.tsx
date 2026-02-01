import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function AdminLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-primary text-white p-4">
        <h1 className="text-lg font-semibold">Admin Dashboard</h1>
      </header>

      <main className="p-4">{children}</main>
    </div>
  );
}
