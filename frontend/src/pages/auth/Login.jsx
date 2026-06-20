import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch {
      setError("E-mail ou senha inválidos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-8 shadow-sm"
        style={{
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-border)",
        }}
      >
        <div className="mb-8 text-center">
          <h1
            className="text-3xl font-bold"
            style={{ color: "var(--color-orange-primary)" }}
          >
            EmberDesk
          </h1>
          <p
            className="mt-2 text-sm"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Entre na sua conta
          </p>
        </div>

        {error && (
          <div
            className="mb-4 rounded-lg px-4 py-3 text-sm"
            style={{ backgroundColor: "#fee2e2", color: "#991b1b" }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label
              className="text-sm font-medium"
              style={{ color: "var(--color-text-primary)" }}
            >
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-lg px-3 py-2 text-sm outline-none transition-all"
              style={{
                backgroundColor: "var(--color-bg)",
                border: "1px solid var(--color-border)",
                color: "var(--color-text-primary)",
              }}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              className="text-sm font-medium"
              style={{ color: "var(--color-text-primary)" }}
            >
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="rounded-lg px-3 py-2 text-sm outline-none transition-all"
              style={{
                backgroundColor: "var(--color-bg)",
                border: "1px solid var(--color-border)",
                color: "var(--color-text-primary)",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-lg py-2 text-sm font-semibold text-white transition-all"
            style={{
              backgroundColor: loading
                ? "var(--color-orange-hover)"
                : "var(--color-orange-primary)",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
