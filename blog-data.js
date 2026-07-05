window.JournalData = (() => {
  const STORAGE_KEY = "warm-journal.entries.v2";
  const DRAFT_KEY = "warm-journal.draft.v2";
  const DELETED_KEY = "warm-journal.deleted.v2";

  const images = {
    sea: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80",
    desk: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1400&q=80",
    home: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80",
    rain: "https://images.unsplash.com/photo-1498575207490-9a1e3c3f8f0d?auto=format&fit=crop&w=1400&q=80",
    city: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=1400&q=80",
    window: "https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=1400&q=80",
    flowers: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1400&q=80",
    coffee: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1400&q=80",
    street: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
  };

  const baseEntries = [
    {
      id: "diary-2026-07-04",
      type: "diary",
      title: "把窗帘拉开一点",
      date: "2026-07-04",
      mood: "平静",
      weather: "晴",
      location: "家里",
      tags: ["日常", "房间", "整理"],
      summary: "没有特别大的事，只是认真地把房间收拾了一遍。",
      littleThings: ["换了干净桌布", "给花瓶添水", "读完两页旧书"],
      body: [
        "早上醒来的时候，阳光正好落在窗帘边。我没有急着看手机，只是先把窗帘拉开一点，让房间慢慢亮起来。",
        "后来把桌面擦干净，重新摆了花瓶和台灯。很多时候，生活不需要被完全改变，只要挪开一点杂物，就会重新变得能呼吸。",
      ],
      featured: true,
    },
    {
      id: "post-2026-07-03-sea-breeze",
      type: "post",
      title: "在海边的风里，重新认识了慢",
      category: "旅行",
      date: "2026-07-03",
      readTime: "6 分钟",
      mood: "松弛",
      weather: "微风",
      location: "海边",
      cover: images.sea,
      tags: ["旅行", "海", "慢下来"],
      summary: "海浪不是催促，而是一遍遍提醒：有些事本来就可以慢慢来。",
      body: [
        "出发前我以为这趟旅行会很充实，列了很多想去的地方和想拍的照片。真正抵达海边以后，我最先记住的不是景点，而是风。",
        "风吹过来的时候，衣角会轻轻往后退一点，头发也会乱一下，像有人在提醒你别一直绷着。我坐在长椅上，什么都不做，只看潮水一遍又一遍把沙子推平。",
        "那一刻我突然意识到，很多时候我们不是不累，只是太习惯往前赶，忘了自己其实也需要停一下。",
      ],
    },
    {
      id: "post-2026-06-29-lamp-book",
      type: "post",
      title: "一盏台灯，一本旧书，和一晚安静",
      category: "读书",
      date: "2026-06-29",
      readTime: "5 分钟",
      mood: "安静",
      weather: "夜晚",
      location: "书桌",
      cover: images.desk,
      tags: ["读书", "夜晚", "摘录"],
      summary: "读到某一页时，会像有人从很远的地方轻轻碰了一下自己。",
      body: [
        "这本书我已经读过很多次，边角有点卷了，里面夹着一张旧书签。每次重新翻开，我都会先停在扉页看一眼。",
        "今晚的台灯开得很暖，桌面像被轻轻照出了一圈安静的边界。我读到一句特别喜欢的话，忍不住在页边写了一点自己的话。",
        "阅读有时候不是为了得到答案，而是为了确认：原来我不是一个人这样想。",
      ],
    },
    {
      id: "album-2026-06-28-weekend-window",
      type: "album",
      title: "周末窗边的四张照片",
      date: "2026-06-28",
      mood: "温柔",
      weather: "晴转阴",
      location: "家里",
      tags: ["相册", "周末", "窗边"],
      summary: "一组关于光、桌面、花和咖啡的周末片段。",
      cover: images.window,
      photos: [
        { src: images.window, caption: "上午十点，光刚好落在窗框上。" },
        { src: images.flowers, caption: "花瓶里的花开得很慢，颜色很轻。" },
        { src: images.coffee, caption: "咖啡还热着，书翻到一半。" },
        { src: images.home, caption: "收拾后的角落，终于有一点呼吸感。" },
      ],
      body: [
        "这个周末没有出远门，只是在家里慢慢整理。照片拍得很少，但每一张都像给那天留了一个小小的标记。",
      ],
      featured: true,
    },
    {
      id: "diary-2026-06-26",
      type: "diary",
      title: "雨停之前买了一杯热牛奶",
      date: "2026-06-26",
      mood: "疲惫",
      weather: "雨",
      location: "便利店",
      tags: ["雨天", "便利店", "小事"],
      summary: "雨声把城市洗得很轻，热牛奶像一个临时停靠点。",
      littleThings: ["带了伞但鞋还是湿了", "买了一杯热牛奶", "回家后换了暖色灯"],
      body: [
        "雨下得很突然，我在便利店门口站了一会儿。玻璃上的水痕把街灯拉成长长的线，整个城市都像被调低了音量。",
        "我买了一杯热牛奶，等它没有那么烫的时候才慢慢喝。那一刻没有什么被解决，但心里确实松了一点。",
      ],
    },
    {
      id: "album-2026-06-18-city-walk",
      type: "album",
      title: "傍晚城市散步",
      date: "2026-06-18",
      mood: "灵感",
      weather: "多云",
      location: "旧街区",
      tags: ["相册", "城市", "散步"],
      summary: "旧街区、路灯、橱窗和一段没有目的的路。",
      cover: images.street,
      photos: [
        { src: images.street, caption: "路边的树影像翻页时晃动的铅笔线。" },
        { src: images.city, caption: "地铁口的人群很快，黄昏却很慢。" },
        { src: images.rain, caption: "便利店的灯光像临时的安慰。" },
      ],
      body: ["那天只是想走一走，没有规划路线。城市在傍晚变得柔软，连噪音都像隔着一层纸。"],
    },
    {
      id: "post-2026-06-12-soft-answer",
      type: "post",
      title: "我开始喜欢不那么用力的答案",
      category: "随笔",
      date: "2026-06-12",
      readTime: "4 分钟",
      mood: "释然",
      weather: "阴",
      location: "地铁",
      cover: images.city,
      tags: ["随笔", "成长", "留白"],
      summary: "有些答案适合慢慢长出来，空白不是浪费，是缓冲。",
      body: [
        "以前我很怕事情悬着。消息没回、计划没定、结果没出，我就会一直惦记着，像要把每一件事都提前拽到眼前。",
        "后来慢慢发现，不是每个问题都需要立刻有答案。很多时候，答案不是被想出来的，而是在你不那么用力的时候，自己慢慢浮上来的。",
      ],
    },
  ];

  const monthlyReviews = [
    {
      id: "review-2026-07",
      month: "2026-07",
      title: "七月：把生活放慢一点",
      summary: "这个月想多写日记，多拍窗边的光，也多留几段不需要解释的空白。",
      highlights: ["记录 2 天", "精选相册 1 组", "常见心情：平静"],
      keywords: ["窗边", "整理", "慢下来", "旧书"],
    },
    {
      id: "review-2026-06",
      month: "2026-06",
      title: "六月：雨、书和傍晚",
      summary: "六月像一页被雨声压平的纸，留下了几次散步、几段阅读和一些温柔的小事。",
      highlights: ["记录 5 天", "相册 2 组", "文章 3 篇"],
      keywords: ["雨天", "便利店", "城市", "读书"],
    },
  ];

  const parseStoredEntries = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };
  const parseDeletedIds = () => {
    try {
      const raw = localStorage.getItem(DELETED_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  const saveStoredEntries = (entries) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  };

  const slugify = (value) =>
    String(value || "entry")
      .trim()
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || "entry";

  const normalizeEntry = (entry) => ({
    ...entry,
    source: entry.source || (entry.custom ? "local" : "seed"),
    tags: Array.isArray(entry.tags) ? entry.tags : [],
    body: Array.isArray(entry.body) ? entry.body : String(entry.body || "").split(/\n+/).filter(Boolean),
    photos: Array.isArray(entry.photos) ? entry.photos : [],
    littleThings: Array.isArray(entry.littleThings) ? entry.littleThings : [],
  });

  const getEntries = () =>
    [...baseEntries.filter((entry) => !parseDeletedIds().includes(entry.id)), ...parseStoredEntries()]
      .map(normalizeEntry)
      .sort((a, b) => String(b.date).localeCompare(String(a.date)));

  const getEntry = (id) => getEntries().find((entry) => entry.id === id);
  const getByType = (type) => getEntries().filter((entry) => entry.type === type);
  const getPosts = () => getByType("post");
  const getDiaries = () => getByType("diary");
  const getAlbums = () => getByType("album");
  const getReviews = () => monthlyReviews;
  const deleteEntry = (id) => {
    const stored = parseStoredEntries();
    const storedMatch = stored.find((entry) => entry.id === id);
    if (storedMatch) {
      saveStoredEntries(stored.filter((entry) => entry.id !== id));
      return true;
    }
    if (baseEntries.find((entry) => entry.id === id)) {
      localStorage.setItem(DELETED_KEY, JSON.stringify([...new Set([...parseDeletedIds(), id])]));
      return true;
    }
    return false;
  };

  const createEntry = (payload) => {
    const now = new Date();
    const date = payload.date || now.toISOString().slice(0, 10);
    const type = payload.type || "diary";
    const entry = normalizeEntry({
      id: `${type}-${date}-${slugify(payload.title)}-${crypto.randomUUID().slice(0, 6)}`,
      type,
      title: payload.title || "未命名记录",
      date,
      category: type === "post" ? payload.category || "随笔" : payload.category || "",
      mood: payload.mood || "平静",
      weather: payload.weather || "晴",
      location: payload.location || "",
      tags: payload.tags || [],
      summary: payload.summary || "",
      cover: payload.cover || payload.photos?.[0]?.src || "",
      readTime: payload.readTime || "3 分钟",
      littleThings: payload.littleThings || [],
      photos: payload.photos || [],
      body: payload.body || [],
      custom: true,
      source: "local",
    });

    const stored = parseStoredEntries();
    saveStoredEntries([entry, ...stored]);
    return entry;
  };

  const saveDraft = (draft) => localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  const getDraft = () => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };
  const clearDraft = () => localStorage.removeItem(DRAFT_KEY);

  return {
    images,
    getEntries,
    getEntry,
    getPosts,
    getDiaries,
    getAlbums,
    getReviews,
    createEntry,
    deleteEntry,
    saveDraft,
    getDraft,
    clearDraft,
  };
})();
