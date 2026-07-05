const data = window.JournalData;
const backend = window.JournalBackend;
const page = document.body.dataset.page;
const params = new URLSearchParams(window.location.search);
const defaultCover = data.images.home;

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const typeLabel = {
  diary: "日记",
  post: "文章",
  album: "相册",
};

let currentEntries = [];

const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const fmtDate = (date) => String(date || "").replaceAll("-", ".");
const entryHref = (entry) =>
  entry.type === "album" ? `./album.html?id=${encodeURIComponent(entry.id)}` : `./post.html?id=${encodeURIComponent(entry.id)}`;

const sortEntries = (entries) =>
  entries.slice().sort((a, b) => {
    const dateCompare = String(b.date || "").localeCompare(String(a.date || ""));
    if (dateCompare !== 0) return dateCompare;
    return String(b.id || "").localeCompare(String(a.id || ""));
  });

const mergeEntries = (...groups) => {
  const map = new Map();
  groups.flat().forEach((entry) => {
    if (!entry?.id) return;
    if (!map.has(entry.id)) {
      map.set(entry.id, entry);
      return;
    }
    const existing = map.get(entry.id);
    if (existing?.source !== "remote" && entry?.source === "remote") {
      map.set(entry.id, entry);
    }
  });
  return sortEntries([...map.values()]);
};

const entries = () => currentEntries;
const findEntry = (id) => entries().find((entry) => entry.id === id);
const entriesByType = (type) => entries().filter((entry) => entry.type === type);

const includesText = (entry, query) => {
  if (!query) return true;
  const haystack = [
    entry.title,
    entry.summary,
    entry.location,
    entry.mood,
    entry.weather,
    entry.category,
    ...(entry.tags || []),
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(query.toLowerCase());
};

const tagsHtml = (tags = []) =>
  tags.length ? `<div class="tag-list">${tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>` : "";

const actionBarHtml = (entry) => `
  <div class="entry-actions">
    <a class="btn btn-secondary" href="${
      entry.type === "diary" ? "./diary.html" : entry.type === "album" ? "./albums.html" : "./posts.html"
    }">返回列表</a>
    ${
      entry.source === "local"
        ? `<button class="btn btn-danger" type="button" data-delete-entry="${escapeHtml(entry.id)}">删除这条${
            typeLabel[entry.type] || "记录"
          }</button>`
        : ""
    }
  </div>
`;

const cardHtml = (entry) => `
  <article class="entry-card">
    <a href="${entryHref(entry)}">
      <img src="${escapeHtml(entry.cover || defaultCover)}" alt="${escapeHtml(entry.title)}" />
      <div class="entry-card-body">
        <div class="card-meta">${escapeHtml(entry.category || typeLabel[entry.type])} · ${fmtDate(entry.date)} · ${escapeHtml(
          entry.mood || ""
        )}</div>
        <h3>${escapeHtml(entry.title)}</h3>
        <p>${escapeHtml(entry.summary)}</p>
        ${tagsHtml(entry.tags)}
      </div>
    </a>
  </article>
`;

const diaryHtml = (entry) => `
  <article class="diary-card">
    <time>${fmtDate(entry.date)} · ${escapeHtml(entry.weather || "")}</time>
    <h3><a href="${entryHref(entry)}">${escapeHtml(entry.title)}</a></h3>
    <p>${escapeHtml(entry.summary)}</p>
    <div class="meta">${escapeHtml(entry.mood || "")} / ${escapeHtml(entry.location || "")}</div>
    ${tagsHtml(entry.tags)}
  </article>
`;

const albumCardHtml = (album) => {
  const photos = album.photos?.length
    ? album.photos
    : [{ src: album.cover || defaultCover, caption: album.title }];

  return `
    <article class="album-card">
      <a href="./album.html?id=${encodeURIComponent(album.id)}">
        <div class="album-stack">
          ${photos
            .slice(0, 3)
            .map((photo) => `<img src="${escapeHtml(photo.src)}" alt="${escapeHtml(photo.caption || album.title)}" />`)
            .join("")}
        </div>
        <div class="album-card-body">
          <div class="card-meta">${fmtDate(album.date)} · ${escapeHtml(album.location || "")} · ${photos.length} 张照片</div>
          <h3>${escapeHtml(album.title)}</h3>
          <p>${escapeHtml(album.summary)}</p>
          ${tagsHtml(album.tags)}
        </div>
      </a>
    </article>
  `;
};

const setActiveNav = () => {
  const detailEntry = findEntry(params.get("id"));
  $$("[data-nav]").forEach((link) => {
    const key = link.dataset.nav;
    const active =
      key === page ||
      (page === "entry" && detailEntry?.type === "diary" && key === "diary") ||
      (page === "entry" && detailEntry?.type === "post" && key === "posts") ||
      (page === "album" && key === "albums");
    link.classList.toggle("active", active);
  });
};

const makeFilters = (container, values, onChange) => {
  if (!container) return;
  let active = "全部";
  const render = () => {
    container.innerHTML = ["全部", ...values]
      .map((value) => `<button class="chip ${value === active ? "active" : ""}" type="button" data-value="${escapeHtml(value)}">${escapeHtml(value)}</button>`)
      .join("");
  };
  container.addEventListener("click", (event) => {
    const button = event.target.closest(".chip");
    if (!button) return;
    active = button.dataset.value;
    render();
    onChange(active);
  });
  render();
};

const wireDeleteButtons = () => {
  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-delete-entry]");
    if (!button) return;
    const entry = findEntry(button.dataset.deleteEntry);
    if (!entry || entry.source !== "local") return;
    const ok = window.confirm(`确定要删除《${entry.title}》吗？`);
    if (!ok) return;
    data.deleteEntry(entry.id);
    currentEntries = mergeEntries(currentEntries.filter((item) => item.id !== entry.id));
    window.location.href = entry.type === "album" ? "./albums.html" : entry.type === "diary" ? "./diary.html" : "./posts.html";
  });
};

const renderHome = () => {
  const all = entries();
  const diaries = entriesByType("diary");
  const posts = entriesByType("post");
  const albums = entriesByType("album");
  const today = diaries[0] || all[0];
  const review = data.getReviews()[0];

  $("#todayTitle").textContent = new Intl.DateTimeFormat("zh-CN", {
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(new Date());
  $("#todayMood").textContent = today?.mood || "平静";
  $("#todayWeather").textContent = today?.weather || "晴";
  $("#todayCount").textContent = `${all.length} 条`;
  $("#homeLittleThings").innerHTML = (today?.littleThings?.length
    ? today.littleThings
    : ["写下一件小事", "挑一张照片", "给今天留一句话"])
    .slice(0, 4)
    .map((thing) => `<span>${escapeHtml(thing)}</span>`)
    .join("");

  $("#homeDiaries").innerHTML = diaries.slice(0, 3).map(diaryHtml).join("");
  $("#homePosts").innerHTML = posts
    .slice(0, 4)
    .map(
      (post) => `
        <a class="entry-row" href="${entryHref(post)}">
          <span class="meta">${fmtDate(post.date)}</span>
          <span><strong>${escapeHtml(post.title)}</strong><br /><small>${escapeHtml(post.summary)}</small></span>
        </a>
      `
    )
    .join("");
  $("#homeAlbums").innerHTML = albums
    .slice(0, 3)
    .map(
      (album) => `
        <a class="album-mini" href="./album.html?id=${encodeURIComponent(album.id)}">
          <img src="${escapeHtml(album.cover || album.photos?.[0]?.src || defaultCover)}" alt="${escapeHtml(album.title)}" />
          <span><strong>${escapeHtml(album.title)}</strong><br /><small>${fmtDate(album.date)} · ${
            album.photos?.length || 0
          } 张照片</small></span>
        </a>
      `
    )
    .join("");
  $("#homeReview").innerHTML = review
    ? `
        <h3>${escapeHtml(review.title)}</h3>
        <p>${escapeHtml(review.summary)}</p>
        <div class="review-metrics">${review.highlights.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div>
        ${tagsHtml(review.keywords)}
      `
    : "";
};

const renderDiaries = () => {
  const list = $("#diaryList");
  const search = $("#diarySearch");
  const diaries = entriesByType("diary");
  let filter = "全部";
  const moods = [...new Set(diaries.map((item) => item.mood).filter(Boolean))];

  const render = () => {
    const query = search.value.trim();
    const filtered = diaries.filter((item) => (filter === "全部" || item.mood === filter) && includesText(item, query));
    list.innerHTML = filtered
      .map(
        (item) => `
          <article class="timeline-item">
            <div class="timeline-date">${fmtDate(item.date)}<br /><span>${escapeHtml(item.weather || "")}</span></div>
            <div>
              <div class="meta">${escapeHtml(item.mood || "")} · ${escapeHtml(item.location || "")}</div>
              <h3><a href="${entryHref(item)}">${escapeHtml(item.title)}</a></h3>
              <p>${escapeHtml(item.summary)}</p>
              ${
                item.littleThings?.length
                  ? `<div class="little-list">${item.littleThings.map((thing) => `<span>${escapeHtml(thing)}</span>`).join("")}</div>`
                  : ""
              }
              ${tagsHtml(item.tags)}
            </div>
          </article>
        `
      )
      .join("");
  };

  search.addEventListener("input", render);
  makeFilters($("#diaryFilters"), moods, (value) => {
    filter = value;
    render();
  });
  render();
};

const renderPosts = () => {
  const list = $("#postList");
  const search = $("#postSearch");
  const posts = entriesByType("post");
  let filter = "全部";
  const categories = [...new Set(posts.map((item) => item.category).filter(Boolean))];

  const render = () => {
    const query = search.value.trim();
    const filtered = posts.filter((item) => (filter === "全部" || item.category === filter) && includesText(item, query));
    list.innerHTML = filtered.map(cardHtml).join("");
  };

  search.addEventListener("input", render);
  makeFilters($("#postFilters"), categories, (value) => {
    filter = value;
    render();
  });
  render();
};

const renderAlbums = () => {
  const list = $("#albumList");
  const search = $("#albumSearch");
  const albums = entriesByType("album");
  let filter = "全部";
  const tags = [...new Set(albums.flatMap((album) => album.tags || []))].filter((tag) => tag !== "相册");

  const render = () => {
    const query = search.value.trim();
    const filtered = albums.filter((album) => (filter === "全部" || album.tags?.includes(filter)) && includesText(album, query));
    list.innerHTML = filtered.map(albumCardHtml).join("");
  };

  search.addEventListener("input", render);
  makeFilters($("#albumFilters"), tags, (value) => {
    filter = value;
    render();
  });
  render();
};

const renderEntryDetail = () => {
  const entry = findEntry(params.get("id")) || entriesByType("post")[0] || entriesByType("diary")[0];
  if (!entry) return;
  document.title = `${entry.title} | 慢慢记`;
  document.body.dataset.detailType = entry.type;

  $("#entryDetail").innerHTML = `
    <article>
      <header class="article-hero detail-${entry.type} reveal">
        <p class="eyebrow">${escapeHtml(typeLabel[entry.type] || "记录")}</p>
        <h1>${escapeHtml(entry.title)}</h1>
        <div class="article-meta">
          <span>${fmtDate(entry.date)}</span>
          <span>${escapeHtml(entry.type === "post" ? entry.category || "" : entry.mood || "")}</span>
          <span>${escapeHtml(entry.weather || "")}</span>
          <span>${escapeHtml(entry.location || "")}</span>
          ${entry.type === "post" && entry.readTime ? `<span>${escapeHtml(entry.readTime)}</span>` : ""}
        </div>
        ${entry.cover ? `<img class="article-cover" src="${escapeHtml(entry.cover)}" alt="${escapeHtml(entry.title)}" />` : ""}
        ${tagsHtml(entry.tags)}
      </header>
      <div class="article-content detail-${entry.type} reveal">
        ${entry.summary ? `<p><strong>${escapeHtml(entry.summary)}</strong></p>` : ""}
        ${(entry.body || []).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
        ${
          entry.littleThings?.length
            ? `<div class="little-list">${entry.littleThings.map((thing) => `<span>${escapeHtml(thing)}</span>`).join("")}</div>`
            : ""
        }
        ${actionBarHtml(entry)}
      </div>
    </article>
  `;
};

const renderAlbumDetail = () => {
  const album = findEntry(params.get("id")) || entriesByType("album")[0];
  if (!album) return;
  document.title = `${album.title} | 慢慢记`;

  $("#albumDetail").innerHTML = `
    <article>
      <header class="article-hero detail-album reveal">
        <p class="eyebrow">Photo Story</p>
        <h1>${escapeHtml(album.title)}</h1>
        <div class="article-meta">
          <span>${fmtDate(album.date)}</span>
          <span>${escapeHtml(album.location || "")}</span>
          <span>${escapeHtml(album.mood || "")}</span>
          <span>${escapeHtml(album.weather || "")}</span>
          <span>${album.photos?.length || 0} 张照片</span>
        </div>
        ${tagsHtml(album.tags)}
      </header>
      <div class="article-content detail-album reveal">
        ${(album.body || []).length ? album.body.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("") : `<p>${escapeHtml(album.summary || "")}</p>`}
        <div class="photo-story">
          ${(album.photos || [])
            .map(
              (photo) => `
                <figure>
                  <img src="${escapeHtml(photo.src)}" alt="${escapeHtml(photo.caption || album.title)}" />
                  <figcaption>${escapeHtml(photo.caption || "")}</figcaption>
                </figure>
              `
            )
            .join("")}
        </div>
        ${actionBarHtml(album)}
      </div>
    </article>
  `;
};

const renderCalendar = () => {
  const all = entries();
  const currentMonth = (all[0]?.date || new Date().toISOString().slice(0, 10)).slice(0, 7);
  const [year, month] = currentMonth.split("-").map(Number);
  const first = new Date(year, month - 1, 1);
  const days = new Date(year, month, 0).getDate();
  const offset = first.getDay();
  const byDate = all.reduce((acc, item) => {
    acc[item.date] = acc[item.date] || [];
    acc[item.date].push(item);
    return acc;
  }, {});

  const cells = [];
  for (let index = 0; index < offset; index += 1) {
    cells.push(`<div class="calendar-cell empty"></div>`);
  }
  for (let day = 1; day <= days; day += 1) {
    const date = `${currentMonth}-${String(day).padStart(2, "0")}`;
    const dayEntries = byDate[date] || [];
    cells.push(`
      <a class="calendar-cell" href="${dayEntries[0] ? entryHref(dayEntries[0]) : "#"}">
        <strong>${day}</strong>
        <span class="meta">${dayEntries.length ? dayEntries.map((item) => typeLabel[item.type]).join(" / ") : ""}</span>
        <div class="dots">${dayEntries.map(() => `<span class="dot"></span>`).join("")}</div>
      </a>
    `);
  }

  $("#calendarGrid").innerHTML = `
    <div class="calendar-head"><h2>${year} 年 ${month} 月</h2><span class="meta">${all.length} 条记录</span></div>
    <div class="calendar-days">${["日", "一", "二", "三", "四", "五", "六"].map((day) => `<span>${day}</span>`).join("")}</div>
    <div class="calendar-cells">${cells.join("")}</div>
  `;

  const moods = all.map((item) => item.mood).filter(Boolean);
  const topMood = moods.reduce((best, mood) => {
    const bestCount = moods.filter((item) => item === best).length;
    const moodCount = moods.filter((item) => item === mood).length;
    return moodCount > bestCount ? mood : best;
  }, moods[0] || "平静");

  $("#calendarSummary").innerHTML = `
    <p class="panel-label">Month Summary</p>
    <h2>${currentMonth}</h2>
    <p>这个月已经保存 ${all.filter((item) => item.date.startsWith(currentMonth)).length} 条记录。</p>
    <div class="review-metrics">
      <span>常见心情：${escapeHtml(topMood)}</span>
      <span>日记：${entriesByType("diary").length}</span>
      <span>相册：${entriesByType("album").length}</span>
    </div>
  `;
};

const renderReviews = () => {
  $("#reviewList").innerHTML = data
    .getReviews()
    .map(
      (review) => `
        <article class="review-card">
          <div class="meta">${escapeHtml(review.month)}</div>
          <h3>${escapeHtml(review.title)}</h3>
          <p>${escapeHtml(review.summary)}</p>
          <div class="review-metrics">${review.highlights.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div>
          ${tagsHtml(review.keywords)}
        </article>
      `
    )
    .join("");
};

const parseLines = (value) => String(value || "").split(/\n+/).map((line) => line.trim()).filter(Boolean);
const parseTags = (value) => String(value || "").split(/[,，]/).map((tag) => tag.trim()).filter(Boolean);
const parsePhotos = (value) =>
  parseLines(value)
    .map((line) => {
      const [src, caption = ""] = line.split("|").map((part) => part.trim());
      return { src, caption };
    })
    .filter((photo) => photo.src);

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    if (!file) {
      resolve("");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const getBodyByType = (formData, type) => {
  if (type === "post") return parseLines(formData.get("bodyPost"));
  if (type === "album") return parseLines(formData.get("bodyAlbum"));
  return parseLines(formData.get("bodyDiary"));
};

const wirePublish = () => {
  const form = $("#publishForm");
  const draftStatus = $("#draftStatus");
  const localCoverInput = $("#coverFile");
  const localAlbumInput = $("#albumFiles");
  const coverPreview = $("#coverPreview");
  const albumPreview = $("#albumPreview");
  let localCoverDataUrl = "";
  let localAlbumPhotos = [];

  if (!form) return;

  const setType = () => {
    document.body.dataset.entryType = new FormData(form).get("type") || "diary";
  };

  const updateCoverPreview = () => {
    const url = localCoverDataUrl || String(form.elements.cover?.value || "").trim();
    coverPreview.innerHTML = url ? `<img src="${escapeHtml(url)}" alt="封面预览" />` : `<span>封面预览</span>`;
  };

  const updateAlbumPreview = () => {
    const linkPhotos = parsePhotos(form.elements.photos?.value || "");
    const photos = [...localAlbumPhotos, ...linkPhotos].slice(0, 5);
    albumPreview.innerHTML = photos.length
      ? photos
          .map(
            (photo) => `
              <figure>
                <img src="${escapeHtml(photo.src)}" alt="${escapeHtml(photo.caption || "相册图片")}" />
                <figcaption>${escapeHtml(photo.caption || "本地图片")}</figcaption>
              </figure>
            `
          )
          .join("")
      : `<span>选择本地图片或填写图片链接后，这里会显示预览。</span>`;
  };

  $$('input[name="type"]', form).forEach((input) => input.addEventListener("change", setType));
  form.elements.cover?.addEventListener("input", updateCoverPreview);
  form.elements.photos?.addEventListener("input", updateAlbumPreview);
  setType();
  updateCoverPreview();
  updateAlbumPreview();

  localCoverInput?.addEventListener("change", async () => {
    localCoverDataUrl = await readFileAsDataUrl(localCoverInput.files?.[0]);
    updateCoverPreview();
  });

  localAlbumInput?.addEventListener("change", async () => {
    const files = [...(localAlbumInput.files || [])].slice(0, 5);
    localAlbumPhotos = await Promise.all(
      files.map(async (file, index) => ({
        src: await readFileAsDataUrl(file),
        caption: `本地照片 ${index + 1}`,
      }))
    );
    updateAlbumPreview();
  });

  const draft = data.getDraft();
  draftStatus.textContent = draft ? `有一份 ${typeLabel[draft.type] || "记录"} 草稿：${draft.title || "未命名"}` : "当前没有草稿。";

  $("#saveDraftBtn").addEventListener("click", () => {
    const draftPayload = Object.fromEntries(new FormData(form).entries());
    data.saveDraft(draftPayload);
    draftStatus.textContent = `草稿已保存：${draftPayload.title || "未命名"}`;
  });

  $("#restoreDraftBtn").addEventListener("click", () => {
    const saved = data.getDraft();
    if (!saved) return;
    Object.entries(saved).forEach(([key, value]) => {
      const field = form.elements[key];
      if (!field) return;
      if (field instanceof RadioNodeList) {
        [...field].forEach((item) => {
          item.checked = item.value === value;
        });
      } else {
        field.value = value;
      }
    });
    setType();
    updateCoverPreview();
    updateAlbumPreview();
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const type = String(formData.get("type") || "diary");
    const photos = [...localAlbumPhotos, ...parsePhotos(formData.get("photos"))].slice(0, 5);
    const payload = {
      type,
      title: String(formData.get("title") || "").trim(),
      date: String(formData.get("date") || "").trim(),
      mood: String(formData.get("mood") || "平静").trim(),
      weather: String(formData.get("weather") || "晴").trim(),
      location: String(formData.get("location") || "").trim(),
      category: type === "post" ? String(formData.get("category") || "随笔").trim() : "",
      tags: parseTags(formData.get("tags")),
      summary: String(formData.get("summary") || "").trim(),
      cover: localCoverDataUrl || String(formData.get("cover") || "").trim(),
      littleThings: parseLines(formData.get("littleThings")),
      photos,
      body: getBodyByType(formData, type),
    };

    if (!payload.title) {
      window.alert("先写一个标题吧。");
      return;
    }
    if (!payload.summary && payload.body.length) {
      payload.summary = payload.body[0];
    }
    if (type === "album" && photos.length < 3) {
      window.alert("相册集至少放 3 张照片，可以用本地上传或图片链接。");
      return;
    }

    try {
      const created =
        backend?.isSupabase?.() ? await backend.createEntry(payload) : data.createEntry(payload);

      if (!created) {
        throw new Error("发布失败，未获得新记录。");
      }

      currentEntries = mergeEntries([created], currentEntries);
      data.clearDraft();
      window.location.href = entryHref(created);
    } catch (error) {
      console.error(error);
      window.alert(`发布失败：${error?.message || "请检查后端配置。"}`);
    }
  });
};

const loadSharedEntries = async () => {
  const localEntries = data.getEntries();
  if (!backend?.isSupabase?.()) {
    return localEntries;
  }

  try {
    const remoteEntries = await backend.listEntries();
    return mergeEntries(remoteEntries, localEntries);
  } catch (error) {
    console.warn("共享内容加载失败，已回退到本地内容。", error);
    return localEntries;
  }
};

const boot = async () => {
  currentEntries = await loadSharedEntries();
  setActiveNav();
  wireDeleteButtons();

  if (page === "home") renderHome();
  if (page === "diary") renderDiaries();
  if (page === "posts") renderPosts();
  if (page === "albums") renderAlbums();
  if (page === "entry") renderEntryDetail();
  if (page === "album") renderAlbumDetail();
  if (page === "calendar") renderCalendar();
  if (page === "review") renderReviews();
  if (page === "publish") wirePublish();
};

boot();
