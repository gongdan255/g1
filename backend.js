window.PaperBlogBackend = (() => {
  const config = window.BLOG_BACKEND_CONFIG || { provider: "local" };
  let supabaseClient = null;
  let supabaseModule = null;

  const isSupabase = () => config.provider === "supabase";
  const isLocal = () => !config.provider || config.provider === "local";

  const ensureSupabase = async () => {
    if (!isSupabase()) return null;
    if (supabaseClient) return supabaseClient;

    if (!config.supabaseUrl || !config.supabaseAnonKey) {
      throw new Error("Supabase 配置缺失，请填写 supabaseUrl 和 supabaseAnonKey。");
    }

    supabaseModule =
      supabaseModule ||
      (await import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm"));

    supabaseClient = supabaseModule.createClient(config.supabaseUrl, config.supabaseAnonKey);
    return supabaseClient;
  };

  const toStoredPost = (post) => ({
    id: post.id || post.slug,
    slug: post.slug || post.id,
    title: post.title,
    category: post.category || "随笔",
    date: post.date,
    readTime: post.readTime || post.read_time || "5 分钟",
    excerpt: post.excerpt || "",
    cover: post.cover || "",
    imageAlt: post.imageAlt || post.title,
    featured: post.featured || post.excerpt || post.title,
    body: Array.isArray(post.body)
      ? post.body
      : String(post.body || "")
          .split(/\n+/)
          .map((line) => line.trim())
          .filter(Boolean),
    notes: Array.isArray(post.notes) ? post.notes : [],
    related: Array.isArray(post.related) ? post.related : [],
    custom: Boolean(post.custom),
  });

  const uploadImage = async (file) => {
    if (!file) return "";
    if (isLocal()) return "";

    const client = await ensureSupabase();
    const ext = file.name.split(".").pop() || "png";
    const filePath = `covers/${crypto.randomUUID()}.${ext}`;
    const bucket = config.supabaseBucket || "blog-images";

    const { error: uploadError } = await client.storage.from(bucket).upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || "image/png",
    });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = client.storage.from(bucket).getPublicUrl(filePath);
    return data?.publicUrl || "";
  };

  const listPosts = async () => {
    if (isLocal()) {
      return window.PaperBlogData.getAllPosts().map(toStoredPost);
    }

    const client = await ensureSupabase();
    const table = config.supabaseTable || "posts";
    const { data, error } = await client.from(table).select("*").order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return (data || []).map(toStoredPost);
  };

  const getPost = async (slug) => {
    const posts = await listPosts();
    return posts.find((post) => post.slug === slug || post.id === slug) || null;
  };

  const createPost = async ({ title, category, excerpt, body, coverUrl, coverFile, notes }) => {
    if (isLocal()) {
      return window.PaperBlogData.createPost({
        title,
        category,
        excerpt,
        coverNote: excerpt,
        body,
        cover: coverUrl || "",
        imageAlt: title,
      });
    }

    const client = await ensureSupabase();
    const table = config.supabaseTable || "posts";
    const cover = coverFile ? await uploadImage(coverFile) : coverUrl || "";
    const now = new Date();
    const slug = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
      now.getDate()
    ).padStart(2, "0")}-${window.PaperBlogData.slugify(title)}`;

    const payload = {
      id: slug,
      slug,
      title,
      category,
      date: now.toISOString().slice(0, 10),
      read_time: "1 分钟",
      excerpt: excerpt || body.slice(0, 70),
      cover,
      image_alt: title,
      featured: excerpt || body.slice(0, 120),
      body: String(body || "")
        .split(/\n+/)
        .map((line) => line.trim())
        .filter(Boolean),
      notes: notes || [],
      related: [],
      created_at: now.toISOString(),
    };

    const { data, error } = await client.from(table).insert(payload).select().single();

    if (error) {
      throw error;
    }

    return toStoredPost(data);
  };

  return {
    isLocal,
    isSupabase,
    listPosts,
    getPost,
    createPost,
    uploadImage,
  };
})();
