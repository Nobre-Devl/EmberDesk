import { useAuth } from "../../hooks/useAuth";

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div
      className="min-h-screen p-8"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1
            className="text-2xl font-bold"
            style={{ color: "var(--color-text-primary)" }}
          >
            Dashboard
          </h1>
          <button
            onClick={logout}
            className="text-sm px-4 py-2 rounded-lg"
            style={{
              color: "var(--color-text-secondary)",
              border: "1px solid var(--color-border)",
            }}
          >
            Sair
          </button>
        </div>

        <div
          className="rounded-xl p-6"
          style={{
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
          }}
        >
          <p style={{ color: "var(--color-text-primary)" }}>
            Bem-vindo, <strong>{user?.name}</strong>!
          </p>
          <p
            className="mt-1 text-sm"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {user?.company?.name} — {user?.role}
          </p>
        </div>
      </div>
    </div>
  );
}
