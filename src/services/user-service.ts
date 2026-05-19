type SignupInput = {
  name: string;
  email: string;
  password: string;
  partnerCode?: string;
};

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers
    }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error ?? "Request failed.");
  return data as T;
}

export function signUp(input: SignupInput) {
  return api<{ ok: true }>("/api/auth/signup", { method: "POST", body: JSON.stringify(input) });
}

export function signIn(email: string, password: string) {
  return api<{ ok: true }>("/api/auth/signin", { method: "POST", body: JSON.stringify({ email, password }) });
}

export function logout() {
  return api<{ ok: true }>("/api/auth/logout", { method: "POST" });
}

export function connectWithPartnerCode(_userId: string, code: string) {
  return api<{ ok: true }>("/api/partner", { method: "POST", body: JSON.stringify({ code }) });
}

export function syncTelegramConnected(_userId: string) {
  return Promise.resolve();
}
