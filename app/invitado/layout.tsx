// app/invitado/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Modo Invitado",
  description: "Juega como invitado en modo claro",
};

export default function InvitadoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white text-black min-h-screen">
      {children}
    </div>
  );
}
