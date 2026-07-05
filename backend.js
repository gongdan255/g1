window.JournalBackend = (() => {
  const config = window.JOURNAL_BACKEND_CONFIG || { provider: "local" };
  let supabaseClient = null;
  let supabaseModule = null;

  const isSupabase = () => config.provider === "supabase";
  const isLocal = () => !config.provider || config.provider === "local";

  const ensureSupabase = async () => {
    if (!isSupabase()) return null;
    if (supabaseClient) return supabaseClient;

    if (!config.supabaseUrl || !config.supabaseAnonKey) {
      throw new Error("Supabase 配置缺失，请填写地址和匿名 Key。");
    }

    supabaseModule =
      supabaseModule ||
      (await import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm"));

    supabaseClient = supabaseModule.createClient(config.supabaseUrl, config.supabaseAnonKey);
    return supabaseClient;
  };

  const toArray = (value) => (Array.isArray(value) ? value : []);

  const normalizeEntry = (entry) => ({
    id: entry.id,
    type: entry.type || "diary",
    title: entry.title || "未命名记录",
    date: entry.date || new Date().toISOString().slice(0, 10),
    category: entry.category || "",
    mood: entry.mood || "",
    weather: entry.weather || "",
    location: entry.location || "",
    tags: toArray(entry.tags),
    summary: entry.summary || "",
    cover: entry.cover || "",
    readTime: entry.readTime || entry.read_time || "3 分钟",
    littleThings: toArray(entry.littleThings || entry.little_things),
    photos: toArray(entry.photos),
    body: toArray(entry.body),
    custom: true,
    source: "remote",
    createdAt: entry.createdAt || entry.created_at || "",
  });

  const slugify = (value) =>
    String(value || "entry")
      .trim()
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || "entry";

  const buildEntryId = (type, date, title) =>
    `${type}-${date}-${slugify(title)}-${crypto.randomUUID().slice(0, 8)}`;

  const uploadBlob = async (blob, folder) => {
    const client = await ensureSupabase();
    const bucket = config.supabaseBucket || "blog-images";
    const extension = (blob.type.split("/")[1] || "png").replace(/[^a-z0-9]/gi, "") || "png";
    const path = `${folder}/${crypto.randomUUID()}.${extension}`;

    let error = null;
    try {
      const result = await client.storage.from(bucket).upload(path, blob, {
        cacheControl: "3600",
        upsert: false,
        contentType: blob.type || "image/png",
      });
      error = result.error;
    } catch (uploadError) {
      error = uploadError;
    }

    if (error) {
      const message =
        error instanceof TypeError && /fetch/i.test(error.message || "")
          ? "网络上传被浏览器拦截或中断。手机端请优先用 Edge / Chrome / Safari 打开，并避免在微信内置浏览器上传超大原图。"
          : error.message || "未知错误";
      throw new Error(
        `媒体上传失败：${message} 请确认存储桶 ${bucket} 已创建并允许匿名上传。`
      );
    }

    const { data } = client.storage.from(bucket).getPublicUrl(path);
    return data?.publicUrl || "";
  };

  const dataUrlToBlob = (value) => {
    const matched = String(value || "").match(/^data:(.+?);base64,(.+)$/);
    if (!matched) {
      throw new Error("图片数据格式不正确，暂时无法上传。");
    }

    const [, mimeType, base64] = matched;
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);

    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }

    return new Blob([bytes], { type: mimeType });
  };

  const maybeUploadAsset = async (value, folder) => {
    if (!value) return "";
    if (!isSupabase()) return value;
    if (value instanceof Blob) return uploadBlob(value, folder);
    if (/^https?:\/\//i.test(value)) return value;
    if (!/^data:image\//i.test(value)) return value;

    const blob = dataUrlToBlob(value);
    return uploadBlob(blob, folder);
  };

  const maybeUploadPhotos = async (photos) => {
    const uploaded = [];
    for (const photo of toArray(photos)) {
      const src = await maybeUploadAsset(photo?.src || "", "albums");
      if (!src) continue;
      uploaded.push({
        src,
        caption: photo?.caption || "",
      });
    }
    return uploaded;
  };

  const publicUrlToStoragePath = (url) => {
    const bucket = config.supabaseBucket || "blog-images";
    const marker = `/storage/v1/object/public/${bucket}/`;
    const index = String(url || "").indexOf(marker);
    if (index === -1) return "";
    return decodeURIComponent(String(url).slice(index + marker.length).split("?")[0]);
  };

  const cleanupEntryAssets = async (client, entry) => {
    const bucket = config.supabaseBucket || "blog-images";
    const paths = [
      publicUrlToStoragePath(entry?.cover),
      ...toArray(entry?.photos).map((photo) => publicUrlToStoragePath(photo?.src)),
    ].filter(Boolean);
    if (!paths.length) return;
    await client.storage.from(bucket).remove([...new Set(paths)]);
  };

  const listEntries = async () => {
    if (isLocal()) return [];

    const client = await ensureSupabase();
    const table = config.supabaseTable || "journal_entries";
    const { data, error } = await client
      .from(table)
      .select("*")
      .order("date", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return (data || []).map(normalizeEntry);
  };

  const createEntry = async (payload) => {
    if (isLocal()) {
      return null;
    }

    const client = await ensureSupabase();
    const table = config.supabaseTable || "journal_entries";
    const date = payload.date || new Date().toISOString().slice(0, 10);
    const type = payload.type || "diary";
    const uploadedPhotos = type === "album" ? await maybeUploadPhotos(payload.photos) : [];
    const cover =
      (await maybeUploadAsset(
        payload.cover || (type === "album" ? uploadedPhotos[0]?.src || "" : ""),
        type === "album" ? "albums" : "covers"
      )) || (type === "album" ? uploadedPhotos[0]?.src || "" : "");

    const entry = {
      id: buildEntryId(type, date, payload.title),
      type,
      title: payload.title || "未命名记录",
      date,
      category: type === "post" ? payload.category || "随笔" : payload.category || "",
      mood: payload.mood || "平静",
      weather: payload.weather || "晴",
      location: payload.location || "",
      tags: toArray(payload.tags),
      summary: payload.summary || "",
      cover,
      read_time: payload.readTime || "3 分钟",
      little_things: toArray(payload.littleThings),
      photos: uploadedPhotos,
      body: toArray(payload.body),
      created_at: new Date().toISOString(),
    };

    const { data, error } = await client.from(table).insert(entry).select().single();

    if (error) {
      throw error;
    }

    return normalizeEntry(data);
  };

  const deleteEntry = async (id) => {
    if (isLocal()) return false;
    const client = await ensureSupabase();
    const table = config.supabaseTable || "journal_entries";
    const { data: existing } = await client.from(table).select("cover, photos").eq("id", id).maybeSingle();
    await cleanupEntryAssets(client, existing);
    const { error } = await client.from(table).delete().eq("id", id);
    if (error) {
      throw error;
    }
    return true;
  };

  return {
    isLocal,
    isSupabase,
    listEntries,
    createEntry,
    deleteEntry,
  };
})();
