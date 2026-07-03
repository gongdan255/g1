const blog = window.PaperBlogData;
const backend = window.PaperBlogBackend;

const todayText = document.getElementById("todayText");
const cursorGlow = document.querySelector(".cursor-glow");
const revealNodes = document.querySelectorAll(".reveal");
const articleHero = document.getElementById("articleHero");
const articleTitle = document.getElementById("articleTitle");
const articleSubtitle = document.getElementById("articleSubtitle");
const articleCategory = document.getElementById("articleCategory");
const articleDate = document.getElementById("articleDate");
const articleReadTime = document.getElementById("articleReadTime");
const articleTags = document.getElementById("articleTags");
const articleContent = document.getElementById("articleContent");
const relatedLinks = document.getElementById("relatedLinks");
const publishForm = document.querySelector(".publish-form");
const saveDraftBtn = document.getElementById("saveDraftBtn");
const coverPreview = document.getElementById("coverPreview");
const coverUrlInput = publishForm?.elements.coverUrl;
const coverFileInput = publishForm?.elements.coverFile;
const postsCatalog = document.getElementById("postsCatalog");
const categoryFilters = document.getElementById("categoryFilters");

const dateFormatter = new Intl.DateTimeFormat("zh-CN", {
  month: "long",
  day: "numeric",
  weekday: "long",
});

const defaultCover =
  "https://images.unsplash.com/photo-1513267048331-5611cad62e41?auto=format&fit=crop&w=1200&q=80";

let allPosts = [];
let selectedCoverFile = null;
let selectedCoverUrl = "";
let revealObserver = null;

const categoryOrder = ["旅行", "读书", "日常", "随笔", "回忆", "夜晚", "灵感"];
const categoryAliases = {
  生活: "日常",
};

const getCategoryLabel = (value) => categoryAliases[value] || value || "未分类";

const sortPostsByDateDesc = (posts) =>
  posts.slice().sort((a, b) => {
    const dateCompare = String(b.date || "").localeCompare(String(a.date || ""));
    if (dateCompare !== 0) return dateCompare;
    return String(b.slug || "").localeCompare(String(a.slug || ""));
  });

const formatDateLabel = (dateStr) => String(dateStr || "").replaceAll("-", "/");

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const attachTiltEffects = (nodes) => {
  nodes.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const bounds = card.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 8;
      const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * -8;
      card.style.transform = `translateY(-6px) perspective(900px) rotateX(${y}deg) rotateY(${x}deg)`;
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });
};

const setCoverPreview = (src, label = "封面预览") => {
  if (!coverPreview) return;

  if (src) {
    coverPreview.classList.add("has-image");
    coverPreview.style.backgroundImage = `linear-gradient(180deg, rgba(255,255,255,0.1), rgba(85,60,48,0.16)), url("${src}")`;
    coverPreview.innerHTML = `<span>${escapeHtml(label)}</span>`;
    return;
  }

  coverPreview.classList.remove("has-image");
  coverPreview.style.backgroundImage = "";
  coverPreview.innerHTML = "<span>封面预览</span>";
};

const getQueryParam = (key) => new URLSearchParams(window.location.search).get(key);

const normalizePost = (post) => ({
  ...post,
  slug: post.slug || post.id,
  category: getCategoryLabel(post.category),
  body: Array.isArray(post.body) ? post.body : [],
  notes: Array.isArray(post.notes) ? post.notes : [],
  related: Array.isArray(post.related) ? post.related : [],
});

const loadPosts = async () => {
  if (backend) {
    try {
      const posts = await backend.listPosts();
      return sortPostsByDateDesc(posts.map(normalizePost));
    } catch (error) {
      console.warn("后端加载失败，已回退到本地内容。", error);
    }
  }

  return sortPostsByDateDesc(blog.getAllPosts().map(normalizePost));
};

const renderHomePage = () => {
  const featuredCard = document.querySelector(".featured-card");
  const homeCards = document.querySelectorAll(".page-shell .post-grid .post-card");
  const latestPosts = allPosts.slice(0, 4);

  if (featuredCard && latestPosts[0]) {
    const [image, body] = featuredCard.querySelectorAll(".featured-image, .card-body");
    const title = body?.querySelector("h3");
    const paragraph = body?.querySelectorAll("p")?.[1];
    const link = body?.querySelector(".text-link");
    const category = body?.querySelector(".eyebrow");

    if (image) {
      image.style.backgroundImage = `linear-gradient(150deg, rgba(255,255,255,0.08), rgba(96,65,52,0.05)), radial-gradient(circle at 30% 20%, rgba(255,240,220,0.42), transparent 28%), url("${latestPosts[0].cover || defaultCover}")`;
      image.setAttribute("aria-label", latestPosts[0].imageAlt || latestPosts[0].title);
    }
    if (category) category.textContent = `本周${latestPosts[0].category}`;
    if (title) title.textContent = latestPosts[0].title;
    if (paragraph) paragraph.textContent = latestPosts[0].featured;
    if (link) link.href = `./post.html?id=${encodeURIComponent(latestPosts[0].slug)}`;
  }

  homeCards.forEach((card, index) => {
    const post = latestPosts[index];
    if (!post) return;

    const thumb = card.querySelector(".post-thumb");
    const title = card.querySelector("h3");
    const excerpt = card.querySelector("p");
    const meta = card.querySelector(".post-meta");
    const time = card.querySelector("time");
    const span = meta?.querySelector("span");

    if (thumb) {
      thumb.style.backgroundImage = `url("${post.cover || defaultCover}")`;
      thumb.setAttribute("aria-label", post.imageAlt || post.title);
    }
    if (span) span.textContent = post.category;
    if (time) time.textContent = post.date;
    if (title) title.textContent = post.title;
    if (excerpt) excerpt.textContent = post.excerpt;

    card.style.cursor = "pointer";
    card.addEventListener("click", () => {
      window.location.href = `./post.html?id=${encodeURIComponent(post.slug)}`;
    });
  });
};

const renderPostsList = () => {
  if (categoryFilters) {
    const sections = categoryOrder
      .filter((category) => allPosts.some((post) => getCategoryLabel(post.category) === category))
      .map(
        (category) => `
          <a href="#category-${encodeURIComponent(category)}">${category}</a>
        `
      )
      .join("");

    categoryFilters.innerHTML = sections;
  }

  if (!postsCatalog) return;

  const groupedPosts = categoryOrder.map((category) => ({
    category,
    posts: allPosts
      .filter((post) => getCategoryLabel(post.category) === category)
      .slice()
      .sort((a, b) => String(b.date || "").localeCompare(String(a.date || ""))),
  })).filter((group) => group.posts.length > 0);

  postsCatalog.innerHTML = groupedPosts
    .map(
      (group) => `
        <section class="category-section reveal category-anchor" id="category-${encodeURIComponent(group.category)}">
          <div class="category-heading">
            <h3>${escapeHtml(group.category)}</h3>
            <span>${group.posts.length} 篇</span>
          </div>
          <div class="category-grid">
            ${group.posts
              .map(
                (post) => `
                  <article class="post-card float-card" data-tilt>
                    <div class="post-thumb" style="background-image:url('${post.cover || defaultCover}')"></div>
                    <div class="post-content">
                      <div class="post-meta"><span>${escapeHtml(post.category)}</span><time>${escapeHtml(post.date)}</time></div>
                      <h3><a href="./post.html?id=${encodeURIComponent(post.slug)}">${escapeHtml(post.title)}</a></h3>
                      <p>${escapeHtml(post.excerpt)}</p>
                    </div>
                  </article>
                `
              )
              .join("")}
          </div>
        </section>
      `
    )
    .join("");

  attachTiltEffects(postsCatalog.querySelectorAll("[data-tilt]"));
};

const renderPostDetail = () => {
  if (!articleHero) return;

  const requestedId = getQueryParam("id") || allPosts[0]?.slug;
  const post = allPosts.find((item) => item.slug === requestedId || item.id === requestedId) || allPosts[0];

  if (!post) return;

  document.title = `${post.title} | 我的博客`;
  articleHero.style.background = `
    linear-gradient(180deg, rgba(255, 248, 240, 0.9), rgba(255, 248, 240, 0.9)),
    url("${post.cover || defaultCover}")
  `;
  articleHero.style.backgroundSize = "cover";
  articleHero.style.backgroundPosition = "center";

  if (articleTitle) articleTitle.textContent = post.title;
  if (articleSubtitle) articleSubtitle.textContent = post.featured || post.excerpt;
  if (articleCategory) articleCategory.textContent = post.category;
  if (articleDate) articleDate.textContent = formatDateLabel(post.date);
  if (articleReadTime) articleReadTime.textContent = `阅读 ${post.readTime || "5 分钟"}`;
  if (articleTags) articleTags.textContent = `标签：${post.category} / 随笔`;

  if (articleContent) {
    const bodyHtml = (post.body || [])
      .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
      .join("");

    articleContent.innerHTML = `
      <p>这是一篇关于“${escapeHtml(post.category)}”的记录。它不是为了证明什么，只是想把今天的感受轻轻收好。</p>
      ${bodyHtml}
      <blockquote>${escapeHtml(post.featured || post.excerpt)}</blockquote>
      <p>如果你也正好在某个不太急的晚上读到这里，希望这篇小小的文字能陪你把呼吸放慢一点。</p>
    `;
  }

  if (relatedLinks) {
    const relatedTitles =
      post.related?.length > 0
        ? post.related
        : allPosts.filter((item) => item.category === post.category && item.slug !== post.slug).slice(0, 3).map((item) => item.title);

    const related = relatedTitles
      .map((title) => {
        const relatedPost = allPosts.find((item) => item.title === title);
        if (!relatedPost) return "";
        return `<a class="related-link" href="./post.html?id=${encodeURIComponent(relatedPost.slug)}">${escapeHtml(relatedPost.title)}</a>`;
      })
      .filter(Boolean)
      .join("");

    relatedLinks.innerHTML = related || '<p class="muted">暂无相关文章。</p>';
  }
};

const renderAboutData = () => {
  const aboutPortrait = document.querySelector(".about-portrait");
  if (aboutPortrait) {
    aboutPortrait.style.backgroundImage =
      'url("https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80")';
  }
};

const restoreDraft = () => {
  if (!publishForm) return;
  const raw = localStorage.getItem("paper-diary.draft.v1");
  if (!raw) return;

  try {
    const draft = JSON.parse(raw);
    publishForm.elements.title.value = draft.title || "";
    publishForm.elements.category.value = draft.category || "随笔";
    publishForm.elements.excerpt.value = draft.excerpt || "";
    publishForm.elements.coverUrl.value = draft.coverUrl || "";
    publishForm.elements.body.value = draft.body || "";
    if (draft.coverDataUrl) {
      selectedCoverUrl = draft.coverDataUrl;
      setCoverPreview(draft.coverDataUrl, "草稿封面");
    } else if (draft.coverUrl) {
      setCoverPreview(draft.coverUrl, "草稿封面");
    }
  } catch {
    // Ignore broken drafts and start fresh.
  }
};

const wireCoverPreview = () => {
  if (!publishForm) return;

  coverUrlInput?.addEventListener("input", () => {
    const value = String(coverUrlInput.value || "").trim();
    if (value) {
      selectedCoverUrl = value;
      selectedCoverFile = null;
      if (coverFileInput) coverFileInput.value = "";
      setCoverPreview(value, "网络封面");
      return;
    }
    if (!selectedCoverFile) {
      selectedCoverUrl = "";
      setCoverPreview("");
    }
  });

  coverFileInput?.addEventListener("change", async () => {
    const file = coverFileInput.files?.[0];
    if (!file) return;

    selectedCoverFile = file;
    if (coverUrlInput) coverUrlInput.value = "";

    const reader = new FileReader();
    reader.onload = () => {
      selectedCoverUrl = String(reader.result || "");
      setCoverPreview(selectedCoverUrl, "本地封面");
    };
    reader.readAsDataURL(file);
  });
};

const wirePublishPage = () => {
  if (!publishForm) return;

  publishForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(publishForm);
    const title = String(formData.get("title") || "").trim();
    const category = String(formData.get("category") || "随笔").trim();
    const excerpt = String(formData.get("excerpt") || "").trim();
    const body = String(formData.get("body") || "").trim();
    const coverUrl = String(formData.get("coverUrl") || "").trim();

    if (!title || !body) {
      window.alert("请先填写标题和正文。");
      return;
    }

    const payload = {
      title,
      category,
      excerpt,
      coverUrl: selectedCoverFile ? selectedCoverUrl : coverUrl,
      coverFile: selectedCoverFile || null,
      body,
      notes: [
        "这是一篇新发布的日记。",
        "它先在浏览器里生成，如果配置了后端，也会同步到服务器。",
      ],
    };

    try {
      const created = backend ? await backend.createPost(payload) : blog.createPost(payload);
      localStorage.removeItem("paper-diary.draft.v1");
      window.location.href = `./post.html?id=${encodeURIComponent(created.slug || created.id)}`;
    } catch (error) {
      console.error(error);
      window.alert("发布失败了，请检查后端配置或稍后重试。");
    }
  });

  if (saveDraftBtn) {
    saveDraftBtn.addEventListener("click", () => {
      const formData = new FormData(publishForm);
      const draft = {
        title: String(formData.get("title") || ""),
        category: String(formData.get("category") || "随笔"),
        excerpt: String(formData.get("excerpt") || ""),
        coverUrl: String(formData.get("coverUrl") || ""),
        coverDataUrl: selectedCoverUrl || "",
        body: String(formData.get("body") || ""),
      };

      localStorage.setItem("paper-diary.draft.v1", JSON.stringify(draft));
      window.alert("草稿已保存到当前浏览器。");
    });
  }
};

const bootstrap = async () => {
  document.body.classList.add("js-enabled");

  if (todayText) {
    todayText.textContent = dateFormatter.format(new Date());
  }

  if (cursorGlow) {
    window.addEventListener("pointermove", (event) => {
      cursorGlow.style.transform = `translate(${event.clientX}px, ${event.clientY}px) translate(-50%, -50%)`;
    });
  }

if ("IntersectionObserver" in window) {
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.16 }
    );

    revealNodes.forEach((node) => revealObserver.observe(node));
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (!target) {
        return;
      }

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  allPosts = await loadPosts();
  renderHomePage();
  renderPostsList();
  renderPostDetail();
  renderAboutData();
  wireCoverPreview();
  wirePublishPage();
  restoreDraft();
  if (revealObserver && postsCatalog) {
    postsCatalog.querySelectorAll(".reveal").forEach((node) => revealObserver.observe(node));
    document.querySelectorAll(".page-shell .reveal").forEach((node) => node.classList.add("is-visible"));
  }
  attachTiltEffects(document.querySelectorAll("[data-tilt]"));
};

bootstrap();
