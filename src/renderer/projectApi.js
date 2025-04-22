/**
 * Project API for SeekerAug (Flask backend)
 * Provides functions to list, create, and delete projects via the backend.
 */

const API_BASE = "http://localhost:5000";

export async function listProjects() {
  const res = await fetch(`${API_BASE}/projects/list`);
  if (!res.ok) throw new Error("Failed to list projects");
  const data = await res.json();
  return data.projects || [];
}

export async function createProject(name) {
  const res = await fetch(`${API_BASE}/projects/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ project_name: name })
  });
  if (!res.ok) throw new Error("Failed to create project");
  const data = await res.json();
  if (data.status !== "success") throw new Error(data.error || "Failed to create project");
  return data.project;
}

export async function deleteProject(name) {
  const res = await fetch(`${API_BASE}/projects/delete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ project_name: name })
  });
  if (!res.ok) throw new Error("Failed to delete project");
  const data = await res.json();
  if (data.status !== "success") throw new Error(data.error || "Failed to delete project");
  return true;
}
