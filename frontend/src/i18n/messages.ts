export type Locale = "en" | "fa";

type JourneyBeatMessage = {
  label: string;
  title: string;
  italicTitle: string;
  description: string;
};

type ItemMessage = {
  title: string;
  description: string;
};

type SiteMessages = {
  language: {
    switchLabel: string;
    currentLabel: string;
  };
  nav: {
    primaryLabel: string;
    skipToContent: string;
    openMenu: string;
    closeMenu: string;
    join: string;
    links: string[];
  };
  journey: {
    ariaLabel: string;
    srTitle: string;
    previewLabel: string;
    reducedEyebrow: string;
    reducedTitle: string;
    reducedItalicTitle: string;
    reducedDescription: string;
    reducedAlt: string;
    loading: string;
    scrollHint: string;
    frameLabel: string;
    beats: JourneyBeatMessage[];
    brand: {
      eyebrow: string;
      title: string;
      tagline: string;
      primaryCta: string;
      secondaryCta: string;
    };
  };
  experience: {
    ariaLabel: string;
    heading: string;
    items: ItemMessage[];
  };
  products: {
    ariaLabel: string;
    eyebrow: string;
    heading: string;
    intro: string;
    ratingLabel: string;
    bagWeight: string;
    viewDetails: string;
    addToCart: string;
    closeDetails: string;
    tastingNotes: string;
    roastLabel: string;
    processLabel: string;
    items: Array<{
      name: string;
      origin: string;
      description: string;
      notes: string[];
      roast: string;
      process: string;
    }>;
  };
  cart: {
    label: string;
    title: string;
    close: string;
    emptyTitle: string;
    emptyDescription: string;
    continueShopping: string;
    remove: string;
    decrease: string;
    increase: string;
    quantity: string;
    subtotal: string;
    shipping: string;
    shippingNote: string;
    checkout: string;
    checkoutNote: string;
    itemCount: string;
  };
  story: {
    ariaLabel: string;
    imageAlt: string;
    heading: string;
    paragraphOne: string;
    paragraphTwo: string;
  };
  whyUs: {
    ariaLabel: string;
    heading: string;
    items: ItemMessage[];
  };
  testimonials: {
    ariaLabel: string;
    heading: string;
    items: Array<{ name: string; role: string; quote: string }>;
  };
  cta: {
    ariaLabel: string;
    heading: string;
    description: string;
    emailLabel: string;
    placeholder: string;
    submit: string;
    invalidEmail: string;
    success: string;
  };
  footer: {
    description: string;
    navLabel: string;
    explore: string;
    connect: string;
    rights: string;
  };
};

export const messages: Record<Locale, SiteMessages> = {
  en: {
    language: {
      switchLabel: "نمایش فارسی",
      currentLabel: "EN",
    },
    nav: {
      primaryLabel: "Primary navigation",
      skipToContent: "Skip to content",
      openMenu: "Open menu",
      closeMenu: "Close menu",
      join: "Join Us",
      links: ["Experience", "Shop", "Story", "Why Us", "Reviews"],
    },
    journey: {
      ariaLabel: "Coffee transformation controlled frame by frame by scroll",
      srTitle: "NEVORA — a continuous journey from fruit to the completed ritual",
      previewLabel: "516-frame production film",
      reducedEyebrow: "Completed production film · F204–F719",
      reducedTitle: "From fruit,",
      reducedItalicTitle: "to the completed ritual.",
      reducedDescription:
        "516 production frames preserve one origin, one direction and one continuous cinematic path.",
      reducedAlt:
        "The completed espresso ritual in one low double-wall glass with calm golden crema",
      loading: "Preparing the journey",
      scrollHint: "Scroll controls every frame",
      frameLabel: "Frame",
      beats: [
        {
          label: "01 · Release",
          title: "The fruit opens.",
          italicTitle: "The seed continues.",
          description:
            "One uninterrupted camera move follows the selected coffee seed from woven basket toward water.",
        },
        {
          label: "02 · Water",
          title: "Water reveals",
          italicTitle: "the origin within.",
          description:
            "Skin, pulp, reflections and weight resolve around the same identifiable seed—never a replacement.",
        },
        {
          label: "03 · Drying",
          title: "Sunlight holds",
          italicTitle: "what the land began.",
          description:
            "The camera rises from the wet rail into warm drying light while direction and material remain continuous.",
        },
        {
          label: "04 · The threshold",
          title: "Wood meets",
          italicTitle: "the edge of steel.",
          description:
            "The camera holds its axis as the drying rail becomes tangent to the roaster’s circular mouth.",
        },
        {
          label: "05 · The roaster",
          title: "The seed crosses",
          italicTitle: "into the dark.",
          description:
            "Still pale and unroasted, the same seed rolls over the metal lip and into the perforated drum without a cut.",
        },
        {
          label: "06 · First heat",
          title: "Heat reveals",
          italicTitle: "a quieter color.",
          description:
            "The drum begins its clockwise turn as green moves evenly toward straw yellow—without flame, smoke or a broken identity.",
        },
        {
          label: "07 · The roast",
          title: "Time deepens",
          italicTitle: "what heat revealed.",
          description:
            "Cinnamon becomes dry chestnut as the same crease turns toward the grinder—without oil, char or a cut.",
        },
        {
          label: "08 · The grind",
          title: "Pressure follows",
          italicTitle: "the original crease.",
          description:
            "Graphite burrs close on the same bean; its natural crease carries a controlled fracture into traceable pieces—never a cut or blast.",
        },
        {
          label: "09 · Descent",
          title: "Gravity carries",
          italicTitle: "every trace forward.",
          description:
            "The same fragments become dry grounds, bend downward, accumulate in one basket and meet the mechanical tamper—without a cut.",
        },
        {
          label: "10 · Extraction",
          title: "Pressure becomes",
          italicTitle: "a line of light.",
          description:
            "The tamper compresses, the camera crosses the same central pore and progressive saturation gathers into one thin amber stream.",
        },
        {
          label: "11 · The vessel",
          title: "The line finds",
          italicTitle: "its final form.",
          description:
            "The unbroken stream guides one double-wall glass into view, meets its center and opens the first restrained bloom of crema.",
        },
        {
          label: "12 · Stillness",
          title: "The ritual rests.",
          italicTitle: "The origin remains.",
          description:
            "The final thread releases, the crema settles and camera motion reaches zero on the completed glass.",
        },
      ],
      brand: {
        eyebrow: "The completed ritual",
        title: "NEVORA",
        tagline: "From origin to cup, without a cut.",
        primaryCta: "Explore the collection",
        secondaryCta: "Our story",
      },
    },
    experience: {
      ariaLabel: "From bean to cup",
      heading: "From Bean to Cup",
      items: [
        {
          title: "Harvest",
          description: "Cherries are hand-picked at peak ripeness, one row at a time.",
        },
        {
          title: "Roasting",
          description: "Small drums, slow curves — roasted to reveal, not to mask.",
        },
        {
          title: "Grinding",
          description: "Ground to order, matched to the way you brew at home.",
        },
        {
          title: "Brewing",
          description: "The final ritual — where craft becomes a quiet moment.",
        },
      ],
    },
    products: {
      ariaLabel: "Our coffee collection",
      eyebrow: "Roasted in small batches",
      heading: "The Collection",
      intro:
        "A small, rotating selection of single-origin beans, chosen for character over volume.",
      ratingLabel: "Rated {rating} out of 5",
      bagWeight: "{weight} g whole bean",
      viewDetails: "Discover this coffee",
      addToCart: "Add to bag",
      closeDetails: "Close product details",
      tastingNotes: "Tasting notes",
      roastLabel: "Roast",
      processLabel: "Process",
      items: [
        {
          name: "Yirgacheffe Reserve",
          origin: "Ethiopia",
          description:
            "A luminous washed lot with a tea-like body, lifted florals and a precise citrus finish.",
          notes: ["Jasmine", "Bergamot", "White peach"],
          roast: "Light",
          process: "Washed",
        },
        {
          name: "Huila Single Origin",
          origin: "Colombia",
          description:
            "A balanced daily coffee with caramel sweetness, ripe red fruit and a clean cacao finish.",
          notes: ["Red apple", "Caramel", "Cacao"],
          roast: "Medium-light",
          process: "Washed",
        },
        {
          name: "Mandheling Dark Roast",
          origin: "Indonesia",
          description:
            "Deep and composed, with a syrupy body, restrained spice and a long dark-cacao finish.",
          notes: ["Dark cacao", "Cedar", "Brown spice"],
          roast: "Medium-dark",
          process: "Wet-hulled",
        },
      ],
    },
    cart: {
      label: "Shopping bag",
      title: "Your selection",
      close: "Close shopping bag",
      emptyTitle: "Your next ritual starts here.",
      emptyDescription: "Choose a coffee from the collection and it will be kept here.",
      continueShopping: "Explore the collection",
      remove: "Remove",
      decrease: "Decrease quantity of {product}",
      increase: "Increase quantity of {product}",
      quantity: "Quantity",
      subtotal: "Subtotal",
      shipping: "Shipping",
      shippingNote: "Calculated at checkout",
      checkout: "Secure checkout — next phase",
      checkoutNote: "Your bag is ready. Payment and delivery connect in the next release.",
      itemCount: "{count} items in shopping bag",
    },
    story: {
      ariaLabel: "Our story",
      imageAlt: "Coffee beans resting in warm afternoon light",
      heading: "A brand built on patience",
      paragraphOne:
        "NEVORA began with a simple frustration: coffee that moved fast and tasted like it. We slowed everything down — sourcing, roasting, and the way a cup is meant to be enjoyed — to build something that feels less like a product and more like a ritual.",
      paragraphTwo:
        "Every bag carries the story of the hands that grew it and the care taken to roast it well.",
    },
    whyUs: {
      ariaLabel: "Why choose NEVORA",
      heading: "Why NEVORA",
      items: [
        {
          title: "Ethically Sourced",
          description: "Direct relationships with growers who share our standard for quality.",
        },
        {
          title: "Small-Batch Roasted",
          description: "Roasted in limited batches to preserve each origin's character.",
        },
        {
          title: "Award-Level Craft",
          description:
            "Every blend is cupped and refined until it earns its place in the collection.",
        },
        {
          title: "Roasted to Order",
          description: "Beans ship within days of roasting, never from a warehouse shelf.",
        },
      ],
    },
    testimonials: {
      ariaLabel: "Customer reviews",
      heading: "What People Are Saying",
      items: [
        {
          name: "Amara Reyes",
          role: "Café Owner, Lisbon",
          quote:
            "NEVORA's Yirgacheffe changed how our regulars think about a morning cup. It tastes intentional.",
        },
        {
          name: "Daniel Voss",
          role: "Home Barista",
          quote:
            "Every batch arrives roasted days before, not months. The difference in the cup is obvious.",
        },
        {
          name: "Sana Khalid",
          role: "Food Writer",
          quote: "Quiet, precise, unhurried — NEVORA feels like the opposite of fast coffee.",
        },
      ],
    },
    cta: {
      ariaLabel: "Join our list",
      heading: "Join the Ritual",
      description:
        "New harvests, limited roasts, and quiet stories from origin — delivered rarely, and only when it matters.",
      emailLabel: "Email address",
      placeholder: "you@example.com",
      submit: "Subscribe",
      invalidEmail: "Enter a valid email address.",
      success: "You're on the list.",
    },
    footer: {
      description: "A premium coffee brand crafting a slower, more deliberate cup.",
      navLabel: "Footer navigation",
      explore: "Explore",
      connect: "Connect",
      rights: "All rights reserved.",
    },
  },
  fa: {
    language: {
      switchLabel: "Switch to English",
      currentLabel: "فا",
    },
    nav: {
      primaryLabel: "ناوبری اصلی",
      skipToContent: "رفتن به محتوای اصلی",
      openMenu: "باز کردن منو",
      closeMenu: "بستن منو",
      join: "همراه ما شوید",
      links: ["تجربه", "فروشگاه", "داستان ما", "چرا نوورا", "نظرها"],
    },
    journey: {
      ariaLabel: "سفر قهوه که فریم‌به‌فریم با اسکرول کنترل می‌شود",
      srTitle: "نوورا — سفری پیوسته از میوه تا آیین کامل‌شده",
      previewLabel: "فیلم تولیدی ۵۱۶ فریم",
      reducedEyebrow: "فیلم تولیدی کامل · F204–F719",
      reducedTitle: "از دل میوه،",
      reducedItalicTitle: "تا آیین کامل‌شده.",
      reducedDescription:
        "۵۱۶ فریم تولیدی، یک خاستگاه، یک جهت و یک مسیر سینمایی پیوسته را حفظ می‌کنند.",
      reducedAlt: "آیین کامل عصاره‌گیری در یک لیوان کوتاه دوجداره با کرمای طلایی آرام",
      loading: "در حال آماده‌سازی سفر",
      scrollHint: "هر فریم با اسکرول شما حرکت می‌کند",
      frameLabel: "فریم",
      beats: [
        {
          label: "۰۱ · رهایی",
          title: "میوه گشوده می‌شود.",
          italicTitle: "دانه مسیرش را ادامه می‌دهد.",
          description:
            "یک حرکت بی‌وقفه‌ی دوربین، همان دانه‌ی انتخاب‌شده را از بافت سبد تا آستانه‌ی آب دنبال می‌کند.",
        },
        {
          label: "۰۲ · آب",
          title: "آب آشکار می‌کند",
          italicTitle: "آنچه در دل خاستگاه مانده.",
          description:
            "پوست، پالپ، بازتاب و وزن پیرامون همان دانه‌ی قابل‌شناسایی شکل می‌گیرند؛ بدون هیچ جایگزینی.",
        },
        {
          label: "۰۳ · خشک‌شدن",
          title: "نور خورشید حفظ می‌کند",
          italicTitle: "آنچه زمین آغاز کرده.",
          description:
            "دوربین از ریل خیس به نور گرم بستر خشک‌کردن می‌رسد، بی‌آنکه جهت یا جنس صحنه ناگهان تغییر کند.",
        },
        {
          label: "۰۴ · آستانه",
          title: "چوب می‌رسد",
          italicTitle: "به لبه‌ی فولاد.",
          description: "محور دوربین ثابت می‌ماند و ریل خشک‌کردن به دهانه‌ی مدور رُستر مماس می‌شود.",
        },
        {
          label: "۰۵ · رُستر",
          title: "دانه عبور می‌کند",
          italicTitle: "به درون تاریکی.",
          description:
            "همان دانه، هنوز سبز و خام، بدون هیچ کاتی از لبه‌ی فلزی می‌گذرد و وارد درام سوراخ‌دار می‌شود.",
        },
        {
          label: "۰۶ · نخستین گرما",
          title: "گرما آشکار می‌کند",
          italicTitle: "رنگی آرام‌تر.",
          description:
            "درام چرخش ساعت‌گردش را آغاز می‌کند و سبز به‌تدریج به زرد کاهی می‌رسد؛ بدون شعله، دود یا شکستن هویت دانه.",
        },
        {
          label: "۰۷ · رُست",
          title: "زمان عمیق‌تر می‌کند",
          italicTitle: "آنچه گرما آشکار کرد.",
          description:
            "دارچینی به شاه‌بلوطی خشک می‌رسد و همان شیار رو به آسیاب می‌چرخد؛ بدون روغن، سوختگی یا کات.",
        },
        {
          label: "۰۸ · آسیاب",
          title: "فشار دنبال می‌کند",
          italicTitle: "همان شیار طبیعی را.",
          description:
            "تیغه‌های گرافیتی روی همان دانه بسته می‌شوند و شیار طبیعی، شکست کنترل‌شده را به قطعات قابل‌ردیابی می‌رساند؛ بدون کات یا انفجار.",
        },
        {
          label: "۰۹ · فرود",
          title: "گرانش پیش می‌برد",
          italicTitle: "تمام ردِ دانه را.",
          description:
            "همان قطعات به سابه‌ی خشک تبدیل می‌شوند، رو به پایین می‌چرخند، در یک بسکت جمع می‌شوند و به تمپر مکانیکی می‌رسند؛ بدون کات.",
        },
        {
          label: "۱۰ · عصاره‌گیری",
          title: "فشار تبدیل می‌شود",
          italicTitle: "به خطی از نور.",
          description:
            "تمپر فشرده می‌کند، دوربین از همان منفذ مرکزی می‌گذرد و خیس‌شدن تدریجی در یک رشته‌ی باریک کهربایی جمع می‌شود.",
        },
        {
          label: "۱۱ · لیوان",
          title: "جریان پیدا می‌کند",
          italicTitle: "فرم نهایی‌اش را.",
          description:
            "رشته‌ی پیوسته، یک لیوان دوجداره را وارد قاب می‌کند، به مرکز آن می‌رسد و نخستین شکوفایی مهار‌شده‌ی کرما را می‌سازد.",
        },
        {
          label: "۱۲ · سکون",
          title: "آیین آرام می‌گیرد.",
          italicTitle: "خاستگاه باقی می‌ماند.",
          description:
            "آخرین رشته رها می‌شود، کرما آرام می‌گیرد و حرکت دوربین روی لیوان کامل‌شده به صفر می‌رسد.",
        },
      ],
      brand: {
        eyebrow: "آیین کامل‌شده",
        title: "NEVORA",
        tagline: "از خاستگاه تا فنجان، بدون کات.",
        primaryCta: "مشاهده مجموعه",
        secondaryCta: "داستان ما",
      },
    },
    experience: {
      ariaLabel: "از دانه تا فنجان",
      heading: "از دانه تا فنجان",
      items: [
        {
          title: "برداشت",
          description: "گیلاس‌ها در اوج رسیدگی و ردیف‌به‌ردیف با دست چیده می‌شوند.",
        },
        {
          title: "برشته‌کاری",
          description: "درام‌های کوچک و منحنی‌های آرام؛ برشته می‌کنیم تا طعم آشکار شود، نه پنهان.",
        },
        {
          title: "آسیاب",
          description: "هر سفارش متناسب با روش دم‌آوری شما آسیاب می‌شود.",
        },
        {
          title: "دم‌آوری",
          description: "آیین نهایی؛ جایی که مهارت به لحظه‌ای آرام تبدیل می‌شود.",
        },
      ],
    },
    products: {
      ariaLabel: "مجموعه قهوه‌های ما",
      eyebrow: "برشته‌شده در بچ‌های محدود",
      heading: "مجموعه نوورا",
      intro: "گزیده‌ای محدود و پویا از قهوه‌های تک‌خاستگاه؛ انتخاب‌شده برای شخصیت طعمی، نه تیراژ.",
      ratingLabel: "امتیاز {rating} از ۵",
      bagWeight: "{weight} گرم، دانه کامل",
      viewDetails: "کشف این قهوه",
      addToCart: "افزودن به سبد",
      closeDetails: "بستن جزئیات محصول",
      tastingNotes: "یادداشت‌های طعمی",
      roastLabel: "رُست",
      processLabel: "فرآوری",
      items: [
        {
          name: "ذخیره یرگاچف",
          origin: "اتیوپی",
          description:
            "لات شسته‌ای درخشان با بافتی شبیه چای، رایحه‌های گلی و پایانی دقیق و مرکباتی.",
          notes: ["یاس", "برگاموت", "هلو سفید"],
          roast: "روشن",
          process: "شسته",
        },
        {
          name: "تک‌خاستگاه هویلا",
          origin: "کلمبیا",
          description:
            "قهوه‌ای متعادل برای هر روز؛ با شیرینی کارامل، میوه قرمز رسیده و پایان تمیز کاکائویی.",
          notes: ["سیب قرمز", "کارامل", "کاکائو"],
          roast: "متوسط رو به روشن",
          process: "شسته",
        },
        {
          name: "رُست تیره ماندلینگ",
          origin: "اندونزی",
          description: "عمیق و متین، با بافتی شربتی، ادویه‌ای مهارشده و پایان طولانی کاکائوی تلخ.",
          notes: ["کاکائوی تلخ", "چوب سدر", "ادویه گرم"],
          roast: "متوسط رو به تیره",
          process: "پوست‌کنی خیس",
        },
      ],
    },
    cart: {
      label: "سبد خرید",
      title: "انتخاب شما",
      close: "بستن سبد خرید",
      emptyTitle: "آیین بعدی شما از اینجا آغاز می‌شود.",
      emptyDescription: "قهوه‌ای از مجموعه انتخاب کنید تا اینجا برایتان نگه داشته شود.",
      continueShopping: "مشاهده مجموعه",
      remove: "حذف",
      decrease: "کم‌کردن تعداد {product}",
      increase: "افزودن تعداد {product}",
      quantity: "تعداد",
      subtotal: "جمع جزء",
      shipping: "ارسال",
      shippingNote: "در مرحله پرداخت محاسبه می‌شود",
      checkout: "پرداخت امن — مرحله بعد",
      checkoutNote: "سبد شما آماده است؛ پرداخت و ارسال در نسخه بعدی متصل می‌شوند.",
      itemCount: "{count} محصول در سبد خرید",
    },
    story: {
      ariaLabel: "داستان ما",
      imageAlt: "دانه‌های قهوه در نور گرم بعدازظهر",
      heading: "برندی که با صبر ساخته شد",
      paragraphOne:
        "نوورا از یک نارضایتی ساده آغاز شد: قهوه‌ای که با عجله حرکت می‌کرد و طعم همان عجله را داشت. ما همه‌چیز را آهسته‌تر کردیم؛ از انتخاب خاستگاه و برشته‌کاری تا شیوه‌ای که یک فنجان باید تجربه شود. نتیجه چیزی است که کمتر شبیه محصول و بیشتر شبیه یک آیین است.",
      paragraphTwo:
        "هر بسته، داستان دست‌هایی را در خود دارد که آن را پرورش داده‌اند و دقتی که برای برشته‌کردنش صرف شده است.",
    },
    whyUs: {
      ariaLabel: "چرا نوورا را انتخاب کنیم",
      heading: "چرا نوورا",
      items: [
        {
          title: "تأمین مسئولانه",
          description: "رابطه‌ی مستقیم با کشاورزانی که استاندارد کیفیت ما را به اشتراک می‌گذارند.",
        },
        {
          title: "برشته‌کاری محدود",
          description: "رُست در بچ‌های کوچک برای حفظ شخصیت منحصربه‌فرد هر خاستگاه.",
        },
        {
          title: "مهارت در سطح جایزه",
          description: "هر ترکیب بارها ارزیابی و اصلاح می‌شود تا شایسته‌ی حضور در مجموعه باشد.",
        },
        {
          title: "رُست پس از سفارش",
          description:
            "دانه‌ها چند روز پس از برشته‌کاری ارسال می‌شوند، نه بعد از ماه‌ها انبارداری.",
        },
      ],
    },
    testimonials: {
      ariaLabel: "نظر مشتریان",
      heading: "آنچه درباره‌ی نوورا می‌گویند",
      items: [
        {
          name: "آمارا ریس",
          role: "صاحب کافه، لیسبون",
          quote:
            "یرگاچف نوورا نگاه مشتریان همیشگی ما به فنجان صبحگاهی را تغییر داد. طعمی دارد که با قصد و دقت ساخته شده.",
        },
        {
          name: "دنیل ووس",
          role: "باریستای خانگی",
          quote:
            "هر بچ فقط چند روز پس از رُست به دستم می‌رسد، نه چند ماه بعد. تفاوت آن در فنجان کاملاً روشن است.",
        },
        {
          name: "سانا خالد",
          role: "نویسنده حوزه غذا",
          quote: "آرام، دقیق و بدون عجله؛ نوورا درست نقطه‌ی مقابل قهوه‌ی سریع است.",
        },
      ],
    },
    cta: {
      ariaLabel: "عضویت در خبرنامه",
      heading: "به آیین نوورا بپیوندید",
      description:
        "برداشت‌های تازه، رُست‌های محدود و روایت‌هایی آرام از خاستگاه؛ کم‌تعداد و فقط زمانی که ارزش گفتن دارند.",
      emailLabel: "نشانی ایمیل",
      placeholder: "you@example.com",
      submit: "عضویت",
      invalidEmail: "یک نشانی ایمیل معتبر وارد کنید.",
      success: "عضویت شما ثبت شد.",
    },
    footer: {
      description: "برند قهوه‌ای ممتاز برای ساختن فنجانی آرام‌تر و آگاهانه‌تر.",
      navLabel: "ناوبری پایین صفحه",
      explore: "بخش‌ها",
      connect: "ارتباط",
      rights: "تمام حقوق محفوظ است.",
    },
  },
};
