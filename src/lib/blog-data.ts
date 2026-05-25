import { normalizeLocale } from "@/lib/metadata"

type BlogLocale = "vi" | "en"

type BlogContent = {
  title: string
  excerpt: string
  category: string
  dateLabel: string
  readTime: string
  author: string
  mood: string
  location: string
  heroImageAlt: string
  intro: string
  pullQuote: string
  sections: {
    heading: string
    body: string
  }[]
  checklist: string[]
}

export type BlogPost = {
  slug: string
  heroImage: string
  accent: "amber" | "sage" | "rose"
  tags: string[]
  content: Record<BlogLocale, BlogContent>
}

export type LocalizedBlogPost = Omit<BlogPost, "content"> & BlogContent

export const blogPosts: BlogPost[] = [
  {
    slug: "mot-buoi-sang-cham-o-thao-dien",
    heroImage: "/image/home-polaroid-1.jpg",
    accent: "amber",
    tags: ["morning", "quiet", "thao-dien"],
    content: {
      vi: {
        title: "Một buổi sáng chậm ở Thảo Điền",
        excerpt:
          "Gợi ý một lộ trình nhẹ nhàng cho những ngày muốn đọc vài trang sách, uống cà phê đủ chậm và nhìn thành phố thức dậy.",
        category: "Nhật ký quán",
        dateLabel: "12 tháng 5, 2026",
        readTime: "5 phút đọc",
        author: "Cafe Maps Editorial",
        mood: "Chậm rãi",
        location: "Thảo Điền, TP.HCM",
        heroImageAlt: "Góc cà phê sáng với ánh nắng và bàn gỗ ấm",
        intro:
          "Có những buổi sáng Sài Gòn không cần vội. Bạn chỉ cần một chiếc bàn đủ sáng, ly cà phê có vị quen, và vài khoảng im lặng để ngày mới tự mở ra.",
        pullQuote:
          "Một quán hợp buổi sáng không nhất thiết phải thật yên, chỉ cần âm thanh ở đó không chen vào suy nghĩ của bạn.",
        sections: [
          {
            heading: "Bắt đầu bằng ánh sáng",
            body: "Thảo Điền có nhiều quán mở sớm, nhưng điều làm buổi sáng đáng nhớ thường là ánh sáng. Hãy chọn bàn gần cửa sổ hoặc hiên nhỏ, nơi bạn có thể thấy cây, xe qua lại và nhịp phố vừa đủ xa.",
          },
          {
            heading: "Gọi món quen trước",
            body: "Nếu mục tiêu là đọc hoặc viết, đừng để menu kéo bạn vào quá nhiều lựa chọn. Một ly latte nóng, cold brew nhẹ hoặc bạc xỉu ít đá thường đủ để giữ mạch tập trung mà vẫn có cảm giác được chăm sóc.",
          },
          {
            heading: "Đi một vòng trước khi rời quán",
            body: "Sau khi ngồi khoảng một giờ, thử đi bộ quanh khu phố. Những con hẻm nhỏ ở Thảo Điền có nhiều mảng xanh và mặt tiền xinh, hợp để lưu lại vài địa điểm cho lần ghé sau.",
          },
        ],
        checklist: [
          "Đi trước 9 giờ để có bàn đẹp",
          "Mang theo một cuốn sách mỏng hoặc sổ tay",
          "Ưu tiên quán có ánh sáng tự nhiên và ổ cắm gần bàn",
        ],
      },
      en: {
        title: "A Slow Morning in Thao Dien",
        excerpt:
          "A gentle route for days when you want to read a few pages, sip slowly, and watch the city wake up.",
        category: "Cafe journal",
        dateLabel: "May 12, 2026",
        readTime: "5 min read",
        author: "Cafe Maps Editorial",
        mood: "Slow",
        location: "Thao Dien, HCMC",
        heroImageAlt: "Morning cafe corner with warm light and a wooden table",
        intro:
          "Some Saigon mornings do not need a rush. All you need is a bright table, a familiar cup, and enough quiet for the day to unfold by itself.",
        pullQuote:
          "A good morning cafe does not have to be silent. Its sounds simply need to leave room for your thoughts.",
        sections: [
          {
            heading: "Start with the light",
            body: "Thao Dien has plenty of early cafes, but the memorable ones usually get the light right. Pick a table near a window or a small patio where trees, traffic, and the street rhythm sit at a comfortable distance.",
          },
          {
            heading: "Order something familiar",
            body: "If the plan is reading or writing, do not let the menu become the main event. A hot latte, mellow cold brew, or Vietnamese milk coffee with less ice keeps the pace soft and steady.",
          },
          {
            heading: "Take a short walk after",
            body: "After an hour, walk around the neighborhood. Thao Dien's smaller lanes have leafy corners and lovely facades worth saving for another visit.",
          },
        ],
        checklist: [
          "Arrive before 9 AM for the nicest tables",
          "Bring a slim book or notebook",
          "Prioritize natural light and a nearby outlet",
        ],
      },
    },
  },
  {
    slug: "chon-quan-lam-viec-khong-bi-met",
    heroImage: "/image/home-polaroid-2.jpg",
    accent: "sage",
    tags: ["work", "focus", "guide"],
    content: {
      vi: {
        title: "Chọn quán làm việc sao cho không bị mệt",
        excerpt:
          "Không gian đẹp là chưa đủ. Một quán work-friendly cần ánh sáng dễ chịu, âm thanh ổn định và chỗ ngồi không khiến bạn muốn đứng dậy sau 20 phút.",
        category: "Cẩm nang",
        dateLabel: "8 tháng 5, 2026",
        readTime: "6 phút đọc",
        author: "Cafe Maps Editorial",
        mood: "Tập trung",
        location: "TP.HCM",
        heroImageAlt: "Bàn làm việc trong quán cà phê với laptop và ly cà phê",
        intro:
          "Làm việc ở quán là một nghi thức nhỏ: đổi bối cảnh để đổi nhịp suy nghĩ. Nhưng chọn sai quán, bạn có thể mất năng lượng nhanh hơn cả khi ở nhà.",
        pullQuote:
          "Một quán làm việc tốt là nơi bạn quên mất mình đang kiểm tra chiếc ghế, wifi hay ổ cắm.",
        sections: [
          {
            heading: "Đừng chỉ nhìn bàn rộng",
            body: "Bàn rộng giúp đặt laptop thoải mái, nhưng chiều cao ghế và bàn mới quyết định cảm giác sau một buổi dài. Nếu vai bị nhấc lên khi gõ phím, đó không phải góc ngồi lý tưởng.",
          },
          {
            heading: "Âm thanh cần đều",
            body: "Quán không cần im phăng phắc. Một nền nhạc vừa phải và tiếng nói chuyện rải đều thường dễ chịu hơn nơi lúc yên lúc ồn. Não của bạn ít phải liên tục thích nghi.",
          },
          {
            heading: "Chọn món theo thời lượng",
            body: "Ngồi dưới hai giờ, cà phê là đủ. Nếu ở lâu hơn, hãy gọi thêm nước hoặc một món nhẹ. Việc này vừa lịch sự với quán, vừa giúp bạn không bị hụt năng lượng giữa chừng.",
          },
        ],
        checklist: [
          "Kiểm tra ổ cắm trước khi gọi món",
          "Chọn chỗ có lưng ghế chắc",
          "Mang tai nghe nếu cần tập trung sâu",
        ],
      },
      en: {
        title: "How to Pick a Cafe for Work Without Draining Yourself",
        excerpt:
          "A beautiful space is not enough. A work-friendly cafe needs gentle light, steady sound, and seating that still feels good after twenty minutes.",
        category: "Guide",
        dateLabel: "May 8, 2026",
        readTime: "6 min read",
        author: "Cafe Maps Editorial",
        mood: "Focused",
        location: "Ho Chi Minh City",
        heroImageAlt: "Cafe work table with a laptop and coffee",
        intro:
          "Working from a cafe is a small ritual: change the setting, change the thinking rhythm. Choose the wrong room, though, and your energy can disappear fast.",
        pullQuote:
          "A good work cafe is where you stop noticing the chair, the wifi, and the outlet.",
        sections: [
          {
            heading: "Do not only look for a big table",
            body: "A wide table helps, but chair and desk height decide how you feel after a long session. If your shoulders rise while typing, that corner is not your friend.",
          },
          {
            heading: "Sound should be steady",
            body: "The cafe does not need to be silent. Moderate music and evenly spread conversations can feel better than a room that swings between quiet and loud.",
          },
          {
            heading: "Order for your stay length",
            body: "For under two hours, coffee is usually enough. If you stay longer, add water or a light bite. It is courteous and it keeps your energy from dipping.",
          },
        ],
        checklist: [
          "Check for outlets before ordering",
          "Pick a chair with firm back support",
          "Bring headphones for deep-focus work",
        ],
      },
    },
  },
  {
    slug: "nhung-goc-nho-hop-de-di-mot-minh",
    heroImage: "/image/home-polaroid-3.jpg",
    accent: "rose",
    tags: ["solo", "reading", "cozy"],
    content: {
      vi: {
        title: "Những góc nhỏ hợp để đi một mình",
        excerpt:
          "Một mình không phải là buồn. Đôi khi đó là cách dễ nhất để nghe rõ gu của mình, từ vị cà phê đến chiếc ghế bạn muốn ngồi.",
        category: "Moodboard",
        dateLabel: "2 tháng 5, 2026",
        readTime: "4 phút đọc",
        author: "Cafe Maps Editorial",
        mood: "Ấm áp",
        location: "Quận 1, Quận 3",
        heroImageAlt: "Góc ngồi nhỏ trong quán cà phê với ghế êm và ánh đèn ấm",
        intro:
          "Đi cà phê một mình là một kiểu nghỉ ngơi rất riêng. Không cần giữ câu chuyện chạy liên tục, bạn có thể đọc, quan sát hoặc chỉ ngồi yên một chút.",
        pullQuote:
          "Góc ngồi tốt cho một người thường có cảm giác được bao bọc, nhưng không bị tách khỏi đời sống quanh mình.",
        sections: [
          {
            heading: "Tìm góc có điểm tựa",
            body: "Một bức tường phía sau, một kệ sách bên cạnh hoặc khung cửa sổ nhỏ đều tạo cảm giác riêng tư. Bạn vẫn ở trong quán, nhưng không bị phơi ra giữa luồng di chuyển.",
          },
          {
            heading: "Ưu tiên menu không quá cầu kỳ",
            body: "Khi đi một mình, trải nghiệm thường nằm ở nhịp ngồi hơn là món thật lạ. Một menu gọn giúp bạn quyết định nhanh và dành phần còn lại cho chính mình.",
          },
          {
            heading: "Để điện thoại xuống một lúc",
            body: "Thử dành mười phút đầu không lướt gì cả. Bạn sẽ nhận ra âm thanh ly chạm bàn, mùi cà phê mới xay và vài chi tiết nhỏ khiến quán có cá tính.",
          },
        ],
        checklist: [
          "Chọn bàn một hoặc hai ghế",
          "Ngồi lệch khỏi lối đi chính",
          "Đem theo tai nghe, nhưng chưa cần bật ngay",
        ],
      },
      en: {
        title: "Small Corners Made for Going Solo",
        excerpt:
          "Being alone is not the same as being lonely. Sometimes it is the easiest way to hear your own taste clearly.",
        category: "Moodboard",
        dateLabel: "May 2, 2026",
        readTime: "4 min read",
        author: "Cafe Maps Editorial",
        mood: "Cozy",
        location: "District 1, District 3",
        heroImageAlt: "Small cafe corner with soft seating and warm light",
        intro:
          "Going to a cafe alone is its own kind of rest. You do not need to keep a conversation moving. You can read, observe, or simply sit still.",
        pullQuote:
          "A good solo corner feels sheltered without cutting you off from the life of the room.",
        sections: [
          {
            heading: "Find a corner with support",
            body: "A wall behind you, a bookshelf beside you, or a small window can make a seat feel private without removing you from the cafe.",
          },
          {
            heading: "Prefer a simple menu",
            body: "When you are alone, the experience is often in the pace rather than the novelty. A concise menu helps you decide quickly and return to yourself.",
          },
          {
            heading: "Put the phone down first",
            body: "Try the first ten minutes without scrolling. You may notice cup sounds, freshly ground coffee, and small details that give the place its personality.",
          },
        ],
        checklist: [
          "Choose a one or two-seat table",
          "Sit away from the main walkway",
          "Bring headphones, but do not turn them on right away",
        ],
      },
    },
  },
  {
    slug: "hen-cuoi-tuan-o-mot-quan-co-san-vuon",
    heroImage: "/image/home-polaroid-4.jpg",
    accent: "sage",
    tags: ["date", "garden", "weekend"],
    content: {
      vi: {
        title: "Hẹn cuối tuần ở một quán có sân vườn",
        excerpt:
          "Một khoảng xanh vừa đủ có thể làm buổi hẹn nhẹ hơn: ít tiếng vang, nhiều chuyện để nhìn, và nhịp ngồi tự nhiên hơn.",
        category: "Gợi ý cuối tuần",
        dateLabel: "26 tháng 4, 2026",
        readTime: "5 phút đọc",
        author: "Cafe Maps Editorial",
        mood: "Dễ thương",
        location: "Bình Thạnh, Phú Nhuận",
        heroImageAlt: "Sân vườn quán cà phê với nhiều cây xanh",
        intro:
          "Một quán có sân vườn không chỉ để chụp ảnh. Cây xanh, gió và khoảng cách giữa các bàn có thể làm cuộc trò chuyện mềm hơn rất nhiều.",
        pullQuote:
          "Không gian ngoài trời tốt cho buổi hẹn vì nó cho cả hai một nhịp thở chung.",
        sections: [
          {
            heading: "Chọn giờ có ánh sáng dịu",
            body: "Khoảng 8-10 giờ sáng hoặc sau 4 giờ chiều thường dễ chịu nhất. Ánh sáng không quá gắt, không khí bớt nóng và sân vườn lên màu đẹp hơn.",
          },
          {
            heading: "Đừng ngồi quá gần loa",
            body: "Nhạc ngoài trời dễ bị mở lớn để lấp tiếng phố. Nếu được, hãy chọn bàn gần cây hoặc góc tường, nơi âm thanh dịu lại và câu chuyện không cần nói quá to.",
          },
          {
            heading: "Để buổi hẹn có khoảng dạo",
            body: "Một sân vườn đẹp thường có vài góc nhỏ để đi quanh sau khi uống xong. Khoảng dạo ngắn giúp buổi hẹn không bị đóng khung trong một chiếc bàn.",
          },
        ],
        checklist: [
          "Đặt bàn nếu đi cuối tuần",
          "Mang áo khoác mỏng nếu ngồi chiều tối",
          "Chọn quán có cả khu trong nhà phòng khi mưa",
        ],
      },
      en: {
        title: "A Weekend Date at a Garden Cafe",
        excerpt:
          "The right amount of green can make a date feel lighter: softer sound, more to notice, and a more natural pace.",
        category: "Weekend picks",
        dateLabel: "April 26, 2026",
        readTime: "5 min read",
        author: "Cafe Maps Editorial",
        mood: "Sweet",
        location: "Binh Thanh, Phu Nhuan",
        heroImageAlt: "Garden cafe patio with plenty of green plants",
        intro:
          "A garden cafe is not just for photos. Plants, breeze, and table spacing can make a conversation feel much softer.",
        pullQuote:
          "A good outdoor space gives both people the same easy breathing room.",
        sections: [
          {
            heading: "Choose soft-light hours",
            body: "Around 8-10 AM or after 4 PM is usually best. The light is gentler, the air is cooler, and the garden looks warmer.",
          },
          {
            heading: "Avoid sitting near speakers",
            body: "Outdoor music can get loud to cover street noise. Pick a table near trees or a wall where the sound settles and conversation can stay relaxed.",
          },
          {
            heading: "Leave room for a short stroll",
            body: "A lovely garden usually has corners to wander through after the drinks. That small movement keeps the date from being trapped at one table.",
          },
        ],
        checklist: [
          "Reserve a table on weekends",
          "Bring a light layer for late afternoon",
          "Pick a cafe with indoor backup in case of rain",
        ],
      },
    },
  },
]

export function getLocalizedBlogPosts(locale: string): LocalizedBlogPost[] {
  const normalizedLocale = normalizeLocale(locale)

  return blogPosts.map(({ content, ...post }) => ({
    ...post,
    ...content[normalizedLocale],
  }))
}

export function getLocalizedBlogPost(slug: string, locale: string) {
  return getLocalizedBlogPosts(locale).find((post) => post.slug === slug)
}

export function getRelatedBlogPosts(slug: string, locale: string, limit = 2) {
  return getLocalizedBlogPosts(locale)
    .filter((post) => post.slug !== slug)
    .slice(0, limit)
}
