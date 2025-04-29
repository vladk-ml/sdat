/**
 * Project API for SeekerAug (Flask backend)
 * Provides functions to list, create, and delete projects via the backend.
 */

const API_BASE = "http://localhost:5000"; // Ensure this matches your Flask port

// Generic function to handle API responses
async function handleResponse(res, operation) {
  if (!res.ok) {
    let errorMsg = `Failed to ${operation}`;
    try {
      const errorData = await res.json();
      errorMsg = errorData.error || errorMsg;
    } catch (e) { /* Ignore JSON parsing error */ }
    throw new Error(`${errorMsg} (Status: ${res.status})`);
  }
  const data = await res.json();
  if (data.status !== "success") {
    throw new Error(data.error || `Failed to ${operation}`);
  }
  return data;
}


export async function listProjects({ archived = null, limit = null, sortBy = 'last_accessed', sortDesc = true } = {}) {
  const params = new URLSearchParams();
  if (archived !== null) params.append('archived', archived ? 'true' : 'false');
  if (limit !== null) params.append('limit', limit);
  if (sortBy) params.append('sort_by', sortBy);
  if (sortDesc !== null) params.append('sort_desc', sortDesc ? 'true' : 'false');

  const url = `${API_BASE}/projects/list?${params.toString()}`;
  const res = await fetch(url);
  const data = await handleResponse(res, 'list projects');
  return data.projects || [];
}

// Specific functions using listProjects
export async function getRecentProjects(limit = 5) {
  return listProjects({ archived: false, limit: limit, sortBy: 'last_accessed', sortDesc: true });
}

export async function getArchivedProjects() {
  return listProjects({ archived: true, sortBy: 'last_accessed', sortDesc: true });
}


export async function createProject(name) {
  const res = await fetch(`${API_BASE}/project/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ project_name: name }),
  });
  const data = await handleResponse(res, 'create project');
  return data.project_path; // Backend returns project_path now
}

// Note: Backend endpoint is POST /project/delete, expecting { name: name } in body
export async function deleteProject(name) {
  const res = await fetch(`${API_BASE}/project/delete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: name }),
  });
  await handleResponse(res, 'delete project');
  return true;
}

export async function renameProject(oldName, newName) {
  const res = await fetch(`${API_BASE}/project/rename`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ old_name: oldName, new_name: newName }),
  });
  const data = await handleResponse(res, 'rename project');
  return data.new_path;
}

// --- New API Functions ---

export async function markProjectAccessed(name) {
  const res = await fetch(`${API_BASE}/project/${encodeURIComponent(name)}/accessed`, {
    method: "PUT",
  });
  const data = await handleResponse(res, 'mark project accessed');
  return data.last_accessed;
}

export async function archiveProject(name) {
  const res = await fetch(`${API_BASE}/project/${encodeURIComponent(name)}/archive`, {
    method: "PUT",
  });
  await handleResponse(res, 'archive project');
  return true;
}

export async function restoreProject(name) {
  const res = await fetch(`${API_BASE}/project/${encodeURIComponent(name)}/restore`, {
    method: "PUT",
  });
  await handleResponse(res, 'restore project');
  return true;
}

export async function openProjectLocation(name) {
  const res = await fetch(`${API_BASE}/project/${encodeURIComponent(name)}/open_location`, {
    method: "POST",
  });
  await handleResponse(res, 'open project location');
  return true;
}

export async function importProjectImages(projectName, files) {
  const formData = new FormData();
  formData.append('project_name', projectName);
  for (const file of files) {
    formData.append('files[]', file);
  }
  const res = await fetch(`${API_BASE}/dataset/import`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to import images');
  }
  return res.json();
}

export async function listProjectImages(projectName) {
  const res = await fetch(`${API_BASE}/dataset/list`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ project_name: projectName }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to list images');
  }
  return res.json();
}

export async function intakeToRefined(projectName) {
  const res = await fetch(`${API_BASE}/dataset/intake`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ project_name: projectName }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to intake to refined dataset');
  }
  const data = await res.json();
  if (data.status !== "success") {
    throw new Error(data.error || 'Failed to intake to refined dataset');
  }
  return data.metadata;
}

export async function getRawMetadata(projectName) {
  const url = `${API_BASE}/raw/metadata?project_name=${encodeURIComponent(projectName)}`;
  const res = await fetch(url);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to load raw metadata');
  }
  const data = await res.json();
  if (data.status !== "success") {
    throw new Error(data.error || 'Failed to load raw metadata');
  }
  return data.metadata;
}

export async function getAnnotation(projectName, imageFilename) {
  const url = `${API_BASE}/annotation?project_name=${encodeURIComponent(projectName)}&image_filename=${encodeURIComponent(imageFilename)}`;
  const res = await fetch(url);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to load annotation');
  }
  const data = await res.json();
  if (data.status !== "success") {
    throw new Error(data.error || 'Failed to load annotation');
  }
  return data.annotation;
}

export async function saveAnnotation(projectName, imageFilename, annotation) {
  const res = await fetch(`${API_BASE}/annotation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      project_name: projectName,
      image_filename: imageFilename,
      annotation: annotation
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to save annotation');
  }
  const data = await res.json();
  if (data.status !== "success") {
    throw new Error(data.error || 'Failed to save annotation');
  }
  return true;
}

// Rename an image in a project
export async function renameProjectImage(projectName, imageId, newFilename) {
  const res = await fetch(`${API_BASE}/image/rename`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      project_name: projectName,
      image_id: imageId,
      new_filename: newFilename
    }),
  });
  await handleResponse(res, 'rename image');
  return true;
}

// Delete an image in a project
export async function deleteProjectImage(projectName, imageId) {
  const res = await fetch(`${API_BASE}/image/delete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      project_name: projectName,
      image_id: imageId
    }),
  });
  await handleResponse(res, 'delete image');
  return true;
}
