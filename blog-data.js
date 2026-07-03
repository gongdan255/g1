window.PaperBlogData = (() => {
  const STORAGE_KEY = "paper-diary.posts.v1";

  const defaultPosts = [
    {
      id: "2026-07-03-sea-breeze-slow",
      title: "在海边的风里，重新认识了慢",
      category: "旅行",
      date: "2026-07-03",
      readTime: "6 分钟",
      excerpt: "那天我没有赶行程，只是在海边坐了很久，慢慢把心里的急促放下。",
      cover:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      imageAlt: "海边和天空",
      featured:
        "海浪不是在催促，而是在一遍遍提醒：有些事本来就可以慢慢来。",
      body: [
        "出发前我以为这趟旅行会很“充实”。我列了很多想去的地方，想拍的照片，想完成的计划。可真正抵达海边之后，我最先记住的不是景点，而是风。",
        "风吹过来时，衣角会轻轻往后退一点，头发也会乱一下，像有人在提醒你别一直绷着。我坐在长椅上，什么都不做，只看潮水一遍又一遍把沙子推平。那一刻我突然意识到，很多时候我们不是不累，只是太习惯往前赶，忘了自己其实也需要停一下。",
        "晚上回到住处，我买了一张小小的明信片，准备写给自己。没有写宏大的愿望，只写了一句：希望以后也能允许自己，在该停的时候停下来。那一刻我忽然明白，慢并不是退步，它只是让生活有机会重新呼吸。",
      ],
      notes: [
        "海边的风，让人不自觉把呼吸放慢。",
        "不赶时间的时候，很多情绪会自己安静下来。",
        "“慢一点”不是放弃，而是给自己留余地。",
      ],
      related: [
        "一盏台灯，一本旧书，和一晚安静",
        "把家里收拾成了适合长住的样子",
        "我开始喜欢不那么用力的答案",
      ],
    },
    {
      id: "2026-06-29-lamp-book-night",
      title: "一盏台灯，一本旧书，和一晚安静",
      category: "读书",
      date: "2026-06-29",
      readTime: "5 分钟",
      excerpt: "把一句句话折起来，像把夜晚收进抽屉，留给明天慢慢再看。",
      cover:
        "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80",
      imageAlt: "台灯和旧书",
      featured:
        "读到某一页时，忽然会停下来，像有人从很远的地方轻轻碰了一下自己。",
      body: [
        "这本书我已经读过很多次，边角有点卷了，里面夹着一张旧书签。每次重新翻开，我都会先停在扉页看一眼，像是和老朋友重新见面。",
        "今晚的台灯开得很暖，桌面像被轻轻照出了一圈安静的边界。我读到一句特别喜欢的话，忍不住在页边写了一点自己的话。那种感觉很像把某个瞬间折成纸飞机，先放在手里，等以后再展开。",
        "有时候阅读并不是为了得到答案，而是为了确认：原来我不是一个人这样想。能有这样的时刻，就已经很值得把夜晚拉长一点。",
      ],
      notes: [
        "旧书会把时间的痕迹留得很明显。",
        "我喜欢在页边写字，像是给未来留一张便签。",
        "最安静的夜晚，反而最适合和自己说话。",
      ],
      related: [
        "在海边的风里，重新认识了慢",
        "把家里收拾成了适合长住的样子",
        "我开始喜欢不那么用力的答案",
      ],
    },
    {
      id: "2026-06-25-house-long-stay",
      title: "把家里收拾成了适合长住的样子",
      category: "日常",
      date: "2026-06-25",
      readTime: "4 分钟",
      excerpt: "换了桌布、摆了花、擦亮玻璃，像是把生活重新摊平，再一点点折好。",
      cover:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
      imageAlt: "温暖的家居角落",
      featured:
        "生活认真起来的时候，连桌布和花瓶都会显得有一点点温柔。",
      body: [
        "最近的我开始很在意家里的角落。不是因为要拍照，也不是因为有谁要来，而是突然觉得，一个人住的地方其实也值得被好好对待。",
        "我换了桌布，摆了新花，擦干净了玻璃。晚上开灯的时候，整个房间都显得安静又柔软。那种感觉很像把自己重新安置了一遍，像是在说：没关系，我们可以慢慢把日子收拾成自己喜欢的样子。",
        "很多情绪会在做家务的时候慢慢散掉。水声、抹布、风从窗边掠过，都像是在帮忙整理脑子里的杂物。",
      ],
      notes: [
        "家应该是能让人好好落地的地方。",
        "我喜欢那些不喧哗的小改变。",
        "收拾空间的时候，也在收拾自己。",
      ],
      related: [
        "在海边的风里，重新认识了慢",
        "一盏台灯，一本旧书，和一晚安静",
        "我开始喜欢不那么用力的答案",
      ],
    },
    {
      id: "2026-06-20-soft-answer",
      title: "我开始喜欢不那么用力的答案",
      category: "随笔",
      date: "2026-06-20",
      readTime: "4 分钟",
      excerpt: "先不急着把事情做满，先把呼吸放平，答案往往会自己出现。",
      cover:
        "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80",
      imageAlt: "落日和树影",
      featured:
        "不是每个问题都要立刻解决，有些时候，先陪自己坐一会儿就已经很好。",
      body: [
        "以前我很怕事情悬着。消息没回、计划没定、结果没出，我就会一直惦记着，像要把每一件事都提前拽到眼前。",
        "后来我慢慢发现，不是每个问题都需要立刻有答案。很多时候，答案不是被想出来的，而是在你不那么用力的时候，自己慢慢浮上来的。",
        "现在我更愿意给自己一点空白。空白不是浪费，它是让心重新对齐的一段时间。",
      ],
      notes: [
        "有些答案，适合慢慢长出来。",
        "空白不是失败，是缓冲。",
        "温柔不是放弃，而是一种更稳的力量。",
      ],
      related: [
        "在海边的风里，重新认识了慢",
        "一盏台灯，一本旧书，和一晚安静",
        "把家里收拾成了适合长住的样子",
      ],
    },
    {
      id: "2026-06-16-convenience-store-rain",
      title: "雨天的便利店，总会让我想买一点甜的东西",
      category: "日常",
      date: "2026-06-16",
      readTime: "4 分钟",
      excerpt: "下雨的时候，玻璃上的水痕会把城市拉成柔软的模样。",
      cover:
        "https://images.unsplash.com/photo-1498575207490-9a1e3c3f8f0d?auto=format&fit=crop&w=1200&q=80",
      imageAlt: "雨天的街景和便利店",
      featured:
        "下雨的时候，玻璃上的水痕会把城市拉成柔软的模样。",
      body: [
        "那天我在便利店站了很久，手里拿着一块小蛋糕，最后还是加了一瓶温牛奶。外面的雨打在门口的地垫上，像在悄悄说别着急。",
        "我总觉得便利店像一个小小的临时停靠站。人们进进出出，带着各自的疲惫、计划和没说出口的话。你可以买到热饮、纸巾、创可贴，也可以买到一点点把晚上变软的甜。",
        "回家以后我把窗帘拉开一点，看着路灯被雨洗得发白。那一晚没有什么大事发生，但我记得自己终于没有催自己，只是安静地坐了一会儿。",
      ],
      notes: [
        "雨天会把城市变得很轻。",
        "便利店的灯光很像临时安慰。",
        "甜的东西有时不是奖励，是缓冲。",
      ],
      related: [
        "在海边的风里，重新认识了慢",
        "一盏台灯，一本旧书，和一晚安静",
        "把家里收拾成了适合长住的样子",
      ],
    },
    {
      id: "2026-06-12-subway-call-mom",
      title: "地铁里听见有人给妈妈打电话",
      category: "随笔",
      date: "2026-06-12",
      readTime: "3 分钟",
      excerpt: "一通很普通的电话，却让我在拥挤的车厢里突然安静下来。",
      cover:
        "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=1200&q=80",
      imageAlt: "地铁车厢里的光",
      featured:
        "一通很普通的电话，却让我在拥挤的车厢里突然安静下来。",
      body: [
        "车厢里人很多，大家都低着头。突然旁边有人接起电话，说了一句“妈，我快到了”。声音很轻，像怕打扰到别人。",
        "那一瞬间我竟然有点鼻子发酸。不是因为别的，只是突然想到，原来很多看起来很普通的问候，都藏着很长的爱。",
        "我下车的时候特意慢了半拍，觉得今天的城市没有那么冷了。也许有些温柔本来就一直在，只是平时走得太快，没注意到。",
      ],
      notes: [
        "最日常的话，有时候最能打动人。",
        "我们都在别人看不见的地方被照顾着。",
        "普通的爱，最不需要被修饰。",
      ],
      related: [
        "在海边的风里，重新认识了慢",
        "一盏台灯，一本旧书，和一晚安静",
        "我开始喜欢不那么用力的答案",
      ],
    },
  ];

  const extraDefaultPosts = [
    {
      id: "2026-06-08-window-rain-and-tea",
      title: "窗外下雨的时候，我泡了一杯很淡的茶",
      category: "日常",
      date: "2026-06-08",
      readTime: "4 分钟",
      excerpt: "雨声把房间填满以后，连时间都显得慢了半拍。",
      cover:
        "https://images.unsplash.com/photo-1528834342297-fdefb9a5a92b?auto=format&fit=crop&w=1200&q=80",
      imageAlt: "窗边的雨和茶杯",
      featured: "雨声把房间填满以后，连时间都显得慢了半拍。",
      body: [
        "下午三点多，天空突然暗下来，我把窗帘拉开一点，看雨点在玻璃上慢慢往下滑。",
        "我泡了一杯很淡的茶，没加很多东西，喝起来只有一点温和的苦味。",
        "后来我坐在窗边发了很久的呆，什么都没做，只是让雨替我整理一下脑子里的杂音。"
      ],
      notes: [
        "雨天适合发呆。",
        "淡一点的茶和淡一点的生活，其实都很好。",
        "不用赶着把自己填满。"
      ],
      related: [
        "雨天的便利店，总会让我想买一点甜的东西",
        "在海边的风里，重新认识了慢",
        "一盏台灯，一本旧书，和一晚安静"
      ],
    },
    {
      id: "2026-06-03-plant-new-pot",
      title: "给阳台上的绿植换了一个新花盆",
      category: "日常",
      date: "2026-06-03",
      readTime: "4 分钟",
      excerpt: "换盆的时候土掉了一地，但植物看起来很开心。",
      cover:
        "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=1200&q=80",
      imageAlt: "阳台绿植",
      featured: "换盆的时候土掉了一地，但植物看起来很开心。",
      body: [
        "这盆绿植是我很久以前随手买的，刚来家的时候很小一株，现在已经长得有点撑不住旧花盆了。",
        "我把它挪出来的时候，发现根系已经绕了很多圈，像是它自己也在努力把日子过稳。",
        "我站在阳台上看了它很久，忽然觉得人也差不多。"
      ],
      notes: [
        "植物会提醒人什么叫耐心。",
        "有时候换环境比硬撑更重要。",
        "成长不一定都很大声。"
      ],
      related: [
        "把家里收拾成了适合长住的样子",
        "我开始喜欢不那么用力的答案",
        "在海边的风里，重新认识了慢"
      ],
    },
    {
      id: "2026-05-30-night-walk-bakery",
      title: "晚上散步时，路过了一家还开着门的面包店",
      category: "生活",
      date: "2026-05-30",
      readTime: "4 分钟",
      excerpt: "空气里有黄油和烤面包的味道，像有人提前把夜晚烘热了。",
      cover:
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80",
      imageAlt: "面包店橱窗",
      featured: "空气里有黄油和烤面包的味道，像有人提前把夜晚烘热了。",
      body: [
        "我本来只是想绕着小区走一圈，结果被那股甜甜的香味拽进了街角。",
        "我最后买了一个最普通的奶油卷，拿在手里的时候还热着。",
        "回家的路上我一边吃一边慢慢走，第一次觉得晚上散步不是浪费时间。"
      ],
      notes: [
        "夜晚也有好闻的味道。",
        "一块热面包可以把心情揉软。",
        "小小的奖励不需要很隆重。"
      ],
      related: [
        "雨天的便利店，总会让我想买一点甜的东西",
        "窗外下雨的时候，我泡了一杯很淡的茶",
        "地铁里听见有人给妈妈打电话"
      ],
    },
    {
      id: "2026-05-25-two-pages-of-reading",
      title: "今天只读了两页书，但我很满意",
      category: "读书",
      date: "2026-05-25",
      readTime: "4 分钟",
      excerpt: "读书也像生活，不一定每次都要进度条很长。",
      cover:
        "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=1200&q=80",
      imageAlt: "摊开的书页",
      featured: "读书也像生活，不一定每次都要进度条很长。",
      body: [
        "这两天状态不太适合读长篇，我就干脆把书摊在桌上，慢慢看两页，停一会儿，再看两页。",
        "以前我会因为读得少而焦虑，觉得今天好像没完成什么。",
        "书页夹着一张旧书签，上面是我以前写的一句‘别急’。"
      ],
      notes: [
        "读得少也可以算读过。",
        "安静本身就是一种收获。",
        "旧书签总会把人带回旧时刻。"
      ],
      related: [
        "一盏台灯，一本旧书，和一晚安静",
        "我开始喜欢不那么用力的答案",
        "在海边的风里，重新认识了慢"
      ],
    },
    {
      id: "2026-05-20-old-photo-box",
      title: "整理抽屉时，翻到一盒旧照片",
      category: "回忆",
      date: "2026-05-20",
      readTime: "5 分钟",
      excerpt: "很多画面已经模糊了，但颜色还在。",
      cover:
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80",
      imageAlt: "旧照片",
      featured: "很多画面已经模糊了，但颜色还在。",
      body: [
        "我很少主动整理抽屉，因为每次一翻，都会冒出一堆想不到的东西。",
        "今天打开最下面那个盒子的时候，里面掉出来的是一叠旧照片。",
        "我把它们一张张排开，忽然有点想谢谢过去的自己。"
      ],
      notes: [
        "旧照片像时间的回声。",
        "过去的自己也值得被感谢。",
        "很多回忆其实一直在身边。"
      ],
      related: [
        "整理了去年夏天的照片，发现海边的颜色比记忆里更安静。",
        "把家里收拾成了适合长住的样子",
        "地铁里听见有人给妈妈打电话"
      ],
    },
    {
      id: "2026-05-15-quiet-cafe-afternoon",
      title: "一个人坐在咖啡馆里，居然没觉得孤单",
      category: "生活",
      date: "2026-05-15",
      readTime: "4 分钟",
      excerpt: "窗边的位置很亮，适合一个人慢慢待着。",
      cover:
        "https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=1200&q=80",
      imageAlt: "安静咖啡馆",
      featured: "窗边的位置很亮，适合一个人慢慢待着。",
      body: [
        "我点了一杯拿铁，坐在窗边，一开始还想着要不要做点什么有意义的事。",
        "咖啡馆里有人在电脑上敲字，有人看书，有人低头发消息。",
        "我忽然觉得，能安静地和自己待在一起，不是“没事做”，而是一种能力。"
      ],
      notes: [
        "独处不一定等于孤单。",
        "窗边的位置总是更适合想事情。",
        "不用把每个下午都安排得很满。"
      ],
      related: [
        "今天只读了两页书，但我很满意",
        "一盏台灯，一本旧书，和一晚安静",
        "我开始喜欢不那么用力的答案"
      ],
    },
    {
      id: "2026-05-10-first-watermelon",
      title: "今年第一次吃到很甜的西瓜",
      category: "日常",
      date: "2026-05-10",
      readTime: "3 分钟",
      excerpt: "西瓜汁顺着手指往下流的时候，夏天就很明显了。",
      cover:
        "https://images.unsplash.com/photo-1591073113125-e46713c829ed?auto=format&fit=crop&w=1200&q=80",
      imageAlt: "西瓜切片",
      featured: "西瓜汁顺着手指往下流的时候，夏天就很明显了。",
      body: [
        "楼下水果店开始卖很甜的西瓜了，切开的时候发出清脆的一声，像夏天突然被打开。",
        "我买了一小块，回家路上一直在想它会有多甜。",
        "我喜欢这种很直接的快乐，不用解释，也不需要理由。"
      ],
      notes: [
        "夏天从一块西瓜开始。",
        "很直接的快乐很珍贵。",
        "甜味会让人记得季节。"
      ],
      related: [
        "雨天的便利店，总会让我想买一点甜的东西",
        "晚上散步时，路过了一家还开着门的面包店",
        "窗外下雨的时候，我泡了一杯很淡的茶"
      ],
    },
    {
      id: "2026-05-05-commute-headphones",
      title: "通勤路上，我把耳机音量调得很低",
      category: "随笔",
      date: "2026-05-05",
      readTime: "4 分钟",
      excerpt: "把声音放小以后，城市的细节反而更清楚了。",
      cover:
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
      imageAlt: "通勤路上的耳机",
      featured: "把声音放小以后，城市的细节反而更清楚了。",
      body: [
        "我以前通勤时总把音乐开得很大，像是想用声音把一路上的疲惫盖住。",
        "结果我听见了很多以前没注意到的东西：脚步声、车门声、路边店铺开门的提示音。",
        "也许有些时候，把外界调小，自己就能听见更多。"
      ],
      notes: [
        "低音量让世界变得更清楚。",
        "细小的声音里也有生活。",
        "慢慢走路的时候更容易看见东西。"
      ],
      related: [
        "地铁里听见有人给妈妈打电话",
        "我开始喜欢不那么用力的答案",
        "在海边的风里，重新认识了慢"
      ],
    },
    {
      id: "2026-04-30-rainy-window-night",
      title: "深夜窗边的雨，像在替我讲悄悄话",
      category: "夜晚",
      date: "2026-04-30",
      readTime: "4 分钟",
      excerpt: "屋里很安静，只剩雨点在说话。",
      cover:
        "https://images.unsplash.com/photo-1501696461415-6c8f7d4da3d4?auto=format&fit=crop&w=1200&q=80",
      imageAlt: "夜雨窗边",
      featured: "屋里很安静，只剩雨点在说话。",
      body: [
        "凌晨一点多的时候，雨突然大起来。",
        "我站在窗边看了一会儿，发现它落下来的声音很像一群人小声聊天。",
        "我把灯关了一半，留下一点暖色。那一刻我很确定，夜晚不是拿来赶完所有事情的。"
      ],
      notes: [
        "夜雨有自己的节奏。",
        "不是每个夜晚都要高效。",
        "有些沉默是舒服的。"
      ],
      related: [
        "窗外下雨的时候，我泡了一杯很淡的茶",
        "雨天的便利店，总会让我想买一点甜的东西",
        "一盏台灯，一本旧书，和一晚安静"
      ],
    },
    {
      id: "2026-04-25-small-museum-afternoon",
      title: "周末去了一家很小的博物馆",
      category: "旅行",
      date: "2026-04-25",
      readTime: "5 分钟",
      excerpt: "展馆不大，但每件东西都像在认真讲故事。",
      cover:
        "https://images.unsplash.com/photo-1505483531331-67d7f0f0b1f3?auto=format&fit=crop&w=1200&q=80",
      imageAlt: "小型博物馆展厅",
      featured: "展馆不大，但每件东西都像在认真讲故事。",
      body: [
        "这家博物馆不在热门商圈里，门口甚至没有很显眼的招牌。",
        "里面的展品不算多，但每一件旁边的说明都写得很用心。",
        "出来的时候天已经有点晚了，路边的树被风吹得轻轻晃。"
      ],
      notes: [
        "小地方也会有很大的故事。",
        "迷路常常比计划更有惊喜。",
        "旧物里藏着慢慢流动的时间。"
      ],
      related: [
        "在海边的风里，重新认识了慢",
        "整理抽屉时，翻到一盒旧照片",
        "晚上散步时，路过了一家还开着门的面包店"
      ],
    },
    {
      id: "2026-04-20-haircut-change",
      title: "去剪了头发，心情也轻了一点",
      category: "生活",
      date: "2026-04-20",
      readTime: "3 分钟",
      excerpt: "头发短了一点，整个人也像重新换了个呼吸方式。",
      cover:
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80",
      imageAlt: "理发店里的光线",
      featured: "头发短了一点，整个人也像重新换了个呼吸方式。",
      body: [
        "我其实纠结了很久要不要剪短，最后还是去了。",
        "剪刀落下去的时候，心里有点舍不得，但更多是轻松。",
        "有些改变不需要太大，哪怕只是头发短了一点，今天也会变得不一样。"
      ],
      notes: [
        "改变不必轰轰烈烈。",
        "轻一点的样子也很好看。",
        "清爽感会让人想重新开始。"
      ],
      related: [
        "把家里收拾成了适合长住的样子",
        "我开始喜欢不那么用力的答案",
        "一个人坐在咖啡馆里，居然没觉得孤单"
      ],
    },
    {
      id: "2026-04-15-letters-to-future",
      title: "写了一封不会寄出的信给未来的自己",
      category: "随笔",
      date: "2026-04-15",
      readTime: "5 分钟",
      excerpt: "我想提醒未来的自己，别忘了今天这些微小的光。",
      cover:
        "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80",
      imageAlt: "纸张与信件",
      featured: "我想提醒未来的自己，别忘了今天这些微小的光。",
      body: [
        "我给未来的自己写了一封信，内容很短，短到不像一封信，更像一张提醒卡。",
        "我写了今天的天气、楼下花店的味道、午后那杯有点凉的咖啡。",
        "我希望它在某个时刻被翻出来，然后轻轻笑一下。"
      ],
      notes: [
        "写信本身就很像拥抱。",
        "未来值得被提前关心。",
        "温柔是可以练习的。"
      ],
      related: [
        "我开始喜欢不那么用力的答案",
        "今天只读了两页书，但我很满意",
        "深夜窗边的雨，像在替我讲悄悄话"
      ],
    },
    {
      id: "2026-04-10-coin-in-jacket-pocket",
      title: "外套口袋里翻到一枚旧硬币",
      category: "回忆",
      date: "2026-04-10",
      readTime: "3 分钟",
      excerpt: "它大概已经跟着我很久了，只是我今天才想起它。",
      cover:
        "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&w=1200&q=80",
      imageAlt: "旧硬币特写",
      featured: "它大概已经跟着我很久了，只是我今天才想起它。",
      body: [
        "我在外套口袋里摸到它的时候，还以为是钥匙。",
        "结果掏出来是一枚旧硬币，边缘都快磨平了。",
        "我很喜欢这种偶然。像生活总会在你不经意的时候，塞给你一点点旧时光。"
      ],
      notes: [
        "旧硬币像一个小小的时间胶囊。",
        "遗忘有时也会留下惊喜。",
        "口袋里总能装下一些故事。"
      ],
      related: [
        "整理抽屉时，翻到一盒旧照片",
        "周末去了一家很小的博物馆",
        "写了一封不会寄出的信给未来的自己"
      ],
    },
    {
      id: "2026-04-05-cat-on-stairs",
      title: "楼道里的猫今天又来蹭我了",
      category: "日常",
      date: "2026-04-05",
      readTime: "3 分钟",
      excerpt: "它总是很自然地把自己当成这栋楼的一部分。",
      cover:
        "https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&w=1200&q=80",
      imageAlt: "楼道里的猫",
      featured: "它总是很自然地把自己当成这栋楼的一部分。",
      body: [
        "这只猫我已经见过很多次了，每次都是在楼道或者门口。",
        "今天我下楼的时候它又蹭了过来，尾巴轻轻扫了一下我的裤腿。",
        "我回家的时候还在想，原来被一只猫认真对待，真的会让人心里软一下。"
      ],
      notes: [
        "猫会把人照顾得很柔软。",
        "楼道也可以很有生活感。",
        "小动物总会让世界没那么硬。"
      ],
      related: [
        "一个人坐在咖啡馆里，居然没觉得孤单",
        "通勤路上，我把耳机音量调得很低",
        "去剪了头发，心情也轻了一点"
      ],
    },
    {
      id: "2026-04-01-april-first-light",
      title: "四月第一天，我给自己换了新的便签纸",
      category: "灵感",
      date: "2026-04-01",
      readTime: "4 分钟",
      excerpt: "新的便签纸很干净，让人忍不住想多写一点。",
      cover:
        "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
      imageAlt: "便签和笔",
      featured: "新的便签纸很干净，让人忍不住想多写一点。",
      body: [
        "今天买了新的便签纸，颜色很淡，贴在桌边的时候，整个角落都显得清爽了一些。",
        "我喜欢这种小小的开头。它不会像宏大的计划那样让人紧张，只是轻轻提醒你：今天可以重新写。",
        "有时候换一叠纸，比写很多目标更有效。"
      ],
      notes: [
        "新的纸会让人想整理生活。",
        "开头不需要很大声。",
        "空白本身就有力量。"
      ],
      related: [
        "写了一封不会寄出的信给未来的自己",
        "我开始喜欢不那么用力的答案",
        "周末去了一家很小的博物馆"
      ],
    },
    {
      id: "2026-03-28-last-bus-home",
      title: "末班车上，大家都很安静",
      category: "夜晚",
      date: "2026-03-28",
      readTime: "4 分钟",
      excerpt: "车窗外的路灯一盏一盏后退，像把一整天慢慢送走。",
      cover:
        "https://images.unsplash.com/photo-1500048993953-d23a436266cf?auto=format&fit=crop&w=1200&q=80",
      imageAlt: "夜晚公交车窗",
      featured: "车窗外的路灯一盏一盏后退，像把一整天慢慢送走。",
      body: [
        "今天回家特别晚，赶上了末班车。车里的人不多，大家都很安静。",
        "我靠在窗边，看路灯一盏一盏从眼前闪过去，心里竟然很平静。",
        "到站的时候风有点大，但我没那么想快点回去。"
      ],
      notes: [
        "夜路不一定孤单。",
        "安静的车厢有自己的节奏。",
        "结束一天也可以很温柔。"
      ],
      related: [
        "深夜窗边的雨，像在替我讲悄悄话",
        "通勤路上，我把耳机音量调得很低",
        "地铁里听见有人给妈妈打电话"
      ],
    },
    {
      id: "2026-03-22-orange-peel",
      title: "剥橘子的时候，突然想起小时候",
      category: "回忆",
      date: "2026-03-22",
      readTime: "3 分钟",
      excerpt: "橘皮的味道一下子把记忆打开了。",
      cover:
        "https://images.unsplash.com/photo-1518843875459-f738682238a6?auto=format&fit=crop&w=1200&q=80",
      imageAlt: "剥开的橘子",
      featured: "橘皮的味道一下子把记忆打开了。",
      body: [
        "今天剥橘子的时候，指尖被果皮喷出来的味道一下子打到了。",
        "我坐在桌前想了半天，想起以前冬天家里总会有一袋橘子。",
        "原来很多回忆不是被看见的，是被气味偷偷带回来的。"
      ],
      notes: [
        "气味会保存记忆。",
        "普通的水果也能很有故事。",
        "小时候的冬天总是更慢。"
      ],
      related: [
        "整理抽屉时，翻到一盒旧照片",
        "今年第一次吃到很甜的西瓜",
        "外套口袋里翻到一枚旧硬币"
      ],
    },
    {
      id: "2026-03-18-morning-light-kitchen",
      title: "清晨厨房的光，真的很好看",
      category: "日常",
      date: "2026-03-18",
      readTime: "3 分钟",
      excerpt: "太阳刚进来那一会儿，连碗都像在发光。",
      cover:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
      imageAlt: "厨房晨光",
      featured: "太阳刚进来那一会儿，连碗都像在发光。",
      body: [
        "今天起得比平时早一点，走进厨房的时候，阳光正好照在洗手池边上。",
        "我给自己煮了一个鸡蛋，烤了两片面包，动作慢慢的。",
        "以后我想多留一点时间给清晨。"
      ],
      notes: [
        "晨光是免费的礼物。",
        "简单早餐也值得被记住。",
        "清晨有一种很轻的力量。"
      ],
      related: [
        "一个人坐在咖啡馆里，居然没觉得孤单",
        "窗外下雨的时候，我泡了一杯很淡的茶",
        "去剪了头发，心情也轻了一点"
      ],
    },
    {
      id: "2026-03-12-bus-stop-wind",
      title: "公交站牌下的风，今天有点大",
      category: "夜晚",
      date: "2026-03-12",
      readTime: "3 分钟",
      excerpt: "等车的时候，风把围巾吹得乱乱的。",
      cover:
        "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=1200&q=80",
      imageAlt: "公交站夜色",
      featured: "等车的时候，风把围巾吹得乱乱的。",
      body: [
        "我在公交站等车，风一阵一阵地吹过来，把围巾吹得不成样子。",
        "站牌旁边有个小孩在问妈妈车怎么还不来，妈妈说再等一会儿，语气很轻。",
        "我突然觉得，等待本身也没有那么难，难的是你一直把它当成麻烦。"
      ],
      notes: [
        "风大一点的时候，人会本能地缩起来。",
        "等车也可以变成一段小停顿。",
        "妈妈的语气总是很有安定感。"
      ],
      related: [
        "末班车上，大家都很安静",
        "地铁里听见有人给妈妈打电话",
        "通勤路上，我把耳机音量调得很低"
      ],
    },
    {
      id: "2026-03-08-shoemaker-shop",
      title: "街角的修鞋店还在开着",
      category: "回忆",
      date: "2026-03-08",
      readTime: "4 分钟",
      excerpt: "门口那块小牌子有点旧，但里面很亮。",
      cover:
        "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=1200&q=80",
      imageAlt: "街角小店",
      featured: "门口那块小牌子有点旧，但里面很亮。",
      body: [
        "今天路过一家修鞋店，门口的牌子已经旧了，但里面的灯还很亮。",
        "老板坐在小凳子上敲敲打打，动作很慢，看起来特别有耐心。",
        "我忽然想到，能把东西修好的人，其实也很像在照顾时间。"
      ],
      notes: [
        "会修东西的人很让人安心。",
        "旧店铺里藏着很多城市记忆。",
        "修补这件事本身就很温柔。"
      ],
      related: [
        "周末去了一家很小的博物馆",
        "整理抽屉时，翻到一盒旧照片",
        "外套口袋里翻到一枚旧硬币"
      ],
    },
  ];

  const slugify = (value) =>
    String(value)
      .trim()
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const safeParse = (value) => {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  };

  const loadCustomPosts = () => {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? safeParse(raw) : null;
    return Array.isArray(parsed) ? parsed : [];
  };

  const saveCustomPosts = (posts) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  };

  const normalizePost = (post) => ({
    ...post,
    slug: post.slug || post.id || slugify(post.title),
  });

  const getAllPosts = () => [
    ...loadCustomPosts().map(normalizePost),
    ...extraDefaultPosts.map(normalizePost),
    ...defaultPosts.map(normalizePost),
  ];

  const getPostBySlug = (slug) => getAllPosts().find((post) => post.slug === slug || post.id === slug);

  const createPost = ({ title, category, coverNote, body, excerpt, cover, imageAlt }) => {
    const now = new Date();
    const id = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
      now.getDate()
    ).padStart(2, "0")}-${slugify(title)}`;

    const newPost = normalizePost({
      id,
      slug: id,
      title,
      category,
      date: now.toISOString().slice(0, 10),
      readTime: "1 分钟",
      excerpt: excerpt || coverNote || title,
      cover:
        cover ||
        "https://images.unsplash.com/photo-1513267048331-5611cad62e41?auto=format&fit=crop&w=1200&q=80",
      imageAlt: imageAlt || title,
      featured: coverNote || excerpt || title,
      body: String(body || "")
        .split(/\n+/)
        .map((line) => line.trim())
        .filter(Boolean),
      notes: [
        "这是一篇刚刚发布的新文章。",
        "可以继续编辑本地存储里的内容，刷新后仍会保留。",
      ],
      related: defaultPosts.slice(0, 3).map((post) => post.title),
      custom: true,
    });

    const customPosts = loadCustomPosts().map(normalizePost);
    customPosts.unshift(newPost);
    saveCustomPosts(customPosts);
    return newPost;
  };

  return {
    defaultPosts: [...extraDefaultPosts, ...defaultPosts].map(normalizePost),
    getAllPosts,
    getPostBySlug,
    createPost,
    slugify,
  };
})();
