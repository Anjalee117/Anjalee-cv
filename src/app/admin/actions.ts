"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import {
  assertValidImage, cleanText, cleanList,
  assertValidUrlOrEmpty, assertValidEmailOrEmpty, assertValidHexColor,
  assertValidSectionItems, ValidationError,
} from "@/lib/validate";

async function checked<T extends { error: { message: string } | null }>(operation: PromiseLike<T>): Promise<T> {
  const result = await operation;
  if (result.error) throw new Error(result.error.message);
  return result;
}

async function requireUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: isAdmin, error } = await supabase.rpc("is_portfolio_admin");
  if (error || !isAdmin) throw new Error("This account does not have portfolio admin access.");
  return supabase;
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function saveProfile(_previous: { error?: string; success?: string }, formData: FormData): Promise<{ error?: string; success?: string }> {
  try {
    await updateProfile(formData);
    return { success: "Profile saved. Your portfolio has been updated." };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return { error: error instanceof Error ? error.message : "Could not save. Please try again." };
  }
}

// ---------- PROFILE ----------
export async function updateProfile(formData: FormData) {
  const supabase = await requireUser();

  const name = cleanText(formData.get("name"), 100);
  const tagline = cleanText(formData.get("tagline"), 200);
  const bio = cleanText(formData.get("bio"), 1000);
  const roles = cleanList(formData.get("roles"), 6, 40);
  const email = assertValidEmailOrEmpty(formData.get("email"));
  const linkedin_url = assertValidUrlOrEmpty(formData.get("linkedin_url"), "LinkedIn URL");
  const github_url = assertValidUrlOrEmpty(formData.get("github_url"), "GitHub URL");
  const resume_url = assertValidUrlOrEmpty(formData.get("resume_url"), "Resume URL");
  const accent_color = assertValidHexColor(formData.get("accent_color"), "#EE8FB5");

  if (!name) throw new ValidationError("Name can't be empty.");

  await checked(supabase.from("profile").update({
    name, tagline, bio, roles, email, linkedin_url, github_url, resume_url, accent_color,
    updated_at: new Date().toISOString(),
  }).eq("id", 1));

  updateTag("portfolio");
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function uploadProfilePic(formData: FormData) {
  const supabase = await requireUser();
  const file = formData.get("file") as File;
  assertValidImage(file);

  const ext = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif" }[file.type];
  const path = `profile/avatar-${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(path, file, { upsert: true });
  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from("media").getPublicUrl(path);
  await checked(supabase.from("profile").update({ profile_pic_url: data.publicUrl }).eq("id", 1));

  updateTag("portfolio");
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function uploadResume(formData: FormData) {
  const supabase = await requireUser();
  const file = formData.get("file");
  if (!(file instanceof File) || file.type !== "application/pdf" || !file.size || file.size > 5 * 1024 * 1024) {
    throw new ValidationError("Choose a PDF under 5MB.");
  }
  const signature = new TextDecoder().decode(await file.slice(0, 5).arrayBuffer());
  if (signature !== "%PDF-") throw new ValidationError("The file must be a valid PDF.");
  const path = `resume/${crypto.randomUUID()}.pdf`;
  const { error } = await supabase.storage.from("media").upload(path, file);
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from("media").getPublicUrl(path);
  await checked(supabase.from("profile").update({ resume_url: data.publicUrl }).eq("id", 1));
  updateTag("portfolio");
  revalidatePath("/");
  revalidatePath("/admin");
}

// ---------- SECTIONS ----------
export async function addSection(formData: FormData) {
  const supabase = await requireUser();
  const layout = String(formData.get("layout") || "text");
  if (!["text", "two-col", "cards", "tags"].includes(layout)) throw new ValidationError("Invalid layout.");

  const title = cleanText(formData.get("title"), 80);
  if (!title) throw new ValidationError("Section title can't be empty.");
  // One shared field on the "add" form, interpreted per layout — kept simple so
  // the add form doesn't need per-layout conditional fields.
  const raw = cleanText(formData.get("body"), 1000);

  let content: Record<string, unknown> = { items: [] };
  if (layout === "text") content = { body: raw };
  if (layout === "tags") content = { tags: cleanList(raw, 40, 40) };

  const { data: last } = await checked(supabase.from("sections").select("position").order("position", { ascending: false }).limit(1));

  await checked(supabase.from("sections").insert({ title, layout, content, position: (last?.[0]?.position ?? -1) + 1 }));

  updateTag("portfolio");
  revalidatePath("/");
  revalidatePath("/admin/sections");
}

export async function updateSection(id: string, formData: FormData) {
  const supabase = await requireUser();
  const layout = String(formData.get("layout") || "text");
  if (!["text", "two-col", "cards", "tags"].includes(layout)) throw new ValidationError("Invalid layout.");
  const title = cleanText(formData.get("title"), 80);
  if (!title) throw new ValidationError("Section title can't be empty.");

  let content: Record<string, unknown>;
  if (layout === "text") {
    content = { body: cleanText(formData.get("body"), 1000) };
  } else if (layout === "tags") {
    content = { tags: cleanList(formData.get("tags_text"), 40, 40) };
  } else {
    if (formData.has("items_json")) {
      content = { items: assertValidSectionItems(String(formData.get("items_json") || "[]")) };
    } else {
      const { data } = await checked(supabase.from("sections").select("content").eq("id", id).single());
      if (!data) throw new ValidationError("Section not found.");
      content = data.content;
    }
  }

  await checked(supabase.from("sections").update({ title, layout, content }).eq("id", id));

  updateTag("portfolio");
  revalidatePath("/");
  revalidatePath("/admin/sections");
}

export async function toggleSectionVisible(id: string, visible: boolean) {
  const supabase = await requireUser();
  await checked(supabase.from("sections").update({ visible }).eq("id", id));
  updateTag("portfolio");
  revalidatePath("/");
  revalidatePath("/admin/sections");
}

export async function moveSection(id: string, direction: "up" | "down") {
  const supabase = await requireUser();
  const { data: all } = await checked(supabase.from("sections").select("id,position").order("position"));
  if (!all) return;
  const idx = all.findIndex((s) => s.id === id);
  const swapIdx = direction === "up" ? idx - 1 : idx + 1;
  if (idx < 0 || swapIdx < 0 || swapIdx >= all.length) return;

  const a = all[idx], b = all[swapIdx];
  await checked(supabase.from("sections").update({ position: b.position }).eq("id", a.id));
  await checked(supabase.from("sections").update({ position: a.position }).eq("id", b.id));

  updateTag("portfolio");
  revalidatePath("/");
  revalidatePath("/admin/sections");
}

export async function deleteSection(id: string) {
  const supabase = await requireUser();
  await checked(supabase.from("sections").delete().eq("id", id));
  updateTag("portfolio");
  revalidatePath("/");
  revalidatePath("/admin/sections");
}

// ---------- PROJECTS ----------
export async function addProject(formData: FormData) {
  const supabase = await requireUser();

  const title = cleanText(formData.get("title"), 100);
  if (!title) throw new ValidationError("Project title can't be empty.");
  const description = cleanText(formData.get("description"), 500);
  const tech_stack = cleanList(formData.get("tech_stack"), 12, 30);
  const link_url = assertValidUrlOrEmpty(formData.get("link_url"), "Website URL");
  const repo_url = assertValidUrlOrEmpty(formData.get("repo_url"), "Repository URL");

  const { data: last } = await checked(supabase.from("projects").select("position").order("position", { ascending: false }).limit(1));

  await checked(supabase.from("projects").insert({
    title, description, tech_stack, link_url, repo_url, position: (last?.[0]?.position ?? -1) + 1,
  }));

  updateTag("portfolio");
  revalidatePath("/");
  revalidatePath("/admin/projects");
}

export async function updateProject(id: string, formData: FormData) {
  const supabase = await requireUser();

  const title = cleanText(formData.get("title"), 100);
  if (!title) throw new ValidationError("Project title can't be empty.");
  const description = cleanText(formData.get("description"), 500);
  const tech_stack = cleanList(formData.get("tech_stack"), 12, 30);
  const link_url = assertValidUrlOrEmpty(formData.get("link_url"), "Website URL");
  const repo_url = assertValidUrlOrEmpty(formData.get("repo_url"), "Repository URL");

  await checked(supabase.from("projects").update({ title, description, tech_stack, link_url, repo_url }).eq("id", id));

  updateTag("portfolio");
  revalidatePath("/");
  revalidatePath("/admin/projects");
}

export async function uploadProjectImage(id: string, formData: FormData) {
  const supabase = await requireUser();
  const file = formData.get("file") as File;
  assertValidImage(file);

  const ext = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif" }[file.type];
  const path = `projects/${id}-${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(path, file, { upsert: true });
  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from("media").getPublicUrl(path);
  await checked(supabase.from("projects").update({ image_url: data.publicUrl }).eq("id", id));

  updateTag("portfolio");
  revalidatePath("/");
  revalidatePath("/admin/projects");
}

export async function toggleProjectVisible(id: string, visible: boolean) {
  const supabase = await requireUser();
  await checked(supabase.from("projects").update({ visible }).eq("id", id));
  updateTag("portfolio");
  revalidatePath("/");
  revalidatePath("/admin/projects");
}

export async function moveProject(id: string, direction: "up" | "down") {
  const supabase = await requireUser();
  const { data: all } = await checked(supabase.from("projects").select("id,position").order("position"));
  if (!all) return;
  const idx = all.findIndex((s) => s.id === id);
  const swapIdx = direction === "up" ? idx - 1 : idx + 1;
  if (idx < 0 || swapIdx < 0 || swapIdx >= all.length) return;

  const a = all[idx], b = all[swapIdx];
  await checked(supabase.from("projects").update({ position: b.position }).eq("id", a.id));
  await checked(supabase.from("projects").update({ position: a.position }).eq("id", b.id));

  updateTag("portfolio");
  revalidatePath("/");
  revalidatePath("/admin/projects");
}

export async function deleteProject(id: string) {
  const supabase = await requireUser();
  await checked(supabase.from("projects").delete().eq("id", id));
  updateTag("portfolio");
  revalidatePath("/");
  revalidatePath("/admin/projects");
}

async function uploadFeedback(operation: () => Promise<void>): Promise<{ error?: string; success?: string }> {
  try { await operation(); return { success: "Upload saved. Your portfolio has been updated." }; }
  catch (error) {
    if (isRedirectError(error)) throw error;
    return { error: error instanceof Error ? error.message : "Upload failed. Please try again." };
  }
}
export async function saveProfilePicture(_previous: { error?: string; success?: string }, formData: FormData) {
  return uploadFeedback(() => uploadProfilePic(formData));
}
export async function saveResume(_previous: { error?: string; success?: string }, formData: FormData) {
  return uploadFeedback(() => uploadResume(formData));
}
export async function saveProjectImage(id: string, _previous: { error?: string; success?: string }, formData: FormData) {
  return uploadFeedback(() => uploadProjectImage(id, formData));
}

// Experience photos live inside the existing section JSON; no schema changes.
async function getExperienceItem(sectionId: string, index: number, title: string) {
  const supabase = await requireUser();
  const { data } = await checked(supabase.from("sections").select("title,content").eq("id", sectionId).single());
  const section = data as { title: string; content: import("@/lib/types").Section["content"] };
  if (!section.title.toLowerCase().includes("experience") || !Number.isInteger(index) || index < 0) throw new ValidationError("Invalid experience.");
  const item = section.content.items?.[index];
  if (!item || item.title !== title) throw new ValidationError("This experience has changed. Refresh the page and try again.");
  return { supabase, content: section.content, item };
}

export async function addExperiencePhoto(sectionId: string, index: number, title: string, formData: FormData) {
  return uploadFeedback(async () => {
    const { supabase, content, item } = await getExperienceItem(sectionId, index, title);
    if ((item.photos?.length ?? 0) >= 12) throw new ValidationError("Maximum 12 photos per experience.");
    const file = formData.get("file");
    if (!(file instanceof File)) throw new ValidationError("Select an image.");
    assertValidImage(file);
    const extension = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif" }[file.type];
    const path = `experiences/${sectionId}/${crypto.randomUUID()}.${extension}`;
    await checked(supabase.storage.from("media").upload(path, file));
    const { data } = supabase.storage.from("media").getPublicUrl(path);
    const items = [...content.items!];
    items[index] = { ...item, photos: [...(item.photos ?? []), { url: data.publicUrl, path }] };
    try {
      await checked(supabase.from("sections").update({ content: { ...content, items } }).eq("id", sectionId).eq("content", JSON.stringify(content)).select("id").single());
    } catch {
      await supabase.storage.from("media").remove([path]);
      throw new ValidationError("Another edit changed this experience. Refresh and try again.");
    }
    updateTag("portfolio");
    revalidatePath("/experience");
    revalidatePath("/admin/sections");
  });
}

export async function removeExperiencePhoto(sectionId: string, index: number, title: string, path: string) {
  return uploadFeedback(async () => {
    const { supabase, content, item } = await getExperienceItem(sectionId, index, title);
    if (!path.startsWith(`experiences/${sectionId}/`) || !item.photos?.some(photo => photo.path === path)) throw new ValidationError("Photo not found.");
    const items = [...content.items!];
    items[index] = { ...item, photos: item.photos.filter(photo => photo.path !== path) };
    await checked(supabase.from("sections").update({ content: { ...content, items } }).eq("id", sectionId).eq("content", JSON.stringify(content)).select("id").single());
    await supabase.storage.from("media").remove([path]);
    updateTag("portfolio");
    revalidatePath("/experience");
    revalidatePath("/admin/sections");
  });
}


export async function saveExperienceDetails(sectionId: string, index: number, originalTitle: string, formData: FormData) {
  return uploadFeedback(async () => {
    const { supabase, content, item } = await getExperienceItem(sectionId, index, originalTitle);
    const title = cleanText(formData.get("title"), 120);
    if (!title) throw new ValidationError("Experience title is required.");
    const items = [...content.items!];
    items[index] = { ...item, title, body: cleanText(formData.get("body"), 2000), tag: cleanText(formData.get("tag"), 60) };
    await checked(supabase.from("sections").update({ content: { ...content, items } }).eq("id", sectionId).eq("content", JSON.stringify(content)).select("id").single());
    updateTag("portfolio");
    revalidatePath("/");
    revalidatePath("/experience");
    revalidatePath("/admin/sections");
  });
}

export async function addExperienceDetails(sectionId: string, formData: FormData) {
  return uploadFeedback(async () => {
    const supabase = await requireUser();
    const { data } = await checked(supabase.from("sections").select("title,content").eq("id", sectionId).single());
    if (!data) throw new ValidationError("Section not found.");
    if (!data.title.toLowerCase().includes("experience")) throw new ValidationError("Invalid experience section.");
    const content = data.content as import("@/lib/types").Section["content"];
    const title = cleanText(formData.get("title"), 120);
    if (!title) throw new ValidationError("Experience title is required.");
    if ((content.items?.length ?? 0) >= 24) throw new ValidationError("Maximum 24 experiences.");
    const items = [...(content.items ?? []), { title, body: cleanText(formData.get("body"), 2000), tag: cleanText(formData.get("tag"), 60), photos: [] }];
    await checked(supabase.from("sections").update({ content: { ...content, items } }).eq("id", sectionId).eq("content", JSON.stringify(content)).select("id").single());
    updateTag("portfolio");
    revalidatePath("/");
    revalidatePath("/experience");
    revalidatePath("/admin/sections");
  });
}
