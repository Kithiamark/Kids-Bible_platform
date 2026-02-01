import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function StudentLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-primary-light text-primary-dark p-4">
        <h1 className="text-lg font-semibold">My Bible Journey</h1>
      </header>

      <main className="p-4">{children}</main>
    </div>
  );
}
