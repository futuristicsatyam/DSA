"use client";

import { API_URL } from "../constants";

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    }
  });

  const payload = await response.json();

  if (!response.ok) {
    const message = Array.isArray(payload.message) ? payload.message.join(", ") : payload.message;
    throw new Error(message || "Request failed");
  }

  return payload.data as T;
}
