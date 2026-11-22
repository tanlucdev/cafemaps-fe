import type { CoffeeMeetup, MeetupFilters } from "./types";

const cafes = [
  [
    "cafe-mock-1",
    "Every Half Coffee",
    "every-half-coffee",
    "Quận 1",
    "/image/home-polaroid-1.jpg",
    10.7758,
    106.7009,
  ],
  [
    "cafe-mock-2",
    "Okkio Caffe",
    "okkio-caffe",
    "Quận 3",
    "/image/home-polaroid-2.jpg",
    10.7826,
    106.6932,
  ],
  [
    "cafe-mock-3",
    "The Workshop",
    "the-workshop",
    "Quận 1",
    "/image/home-polaroid-3.jpg",
    10.7734,
    106.7041,
  ],
  [
    "cafe-mock-4",
    "Padma de Fleur",
    "padma-de-fleur",
    "Phú Nhuận",
    "/image/home-polaroid-4.jpg",
    10.7979,
    106.688,
  ],
  [
    "cafe-mock-5",
    "September Saigon",
    "september-saigon",
    "Quận 7",
    "/image/home-hero-video-frame-20260703.webp",
    10.7297,
    106.7218,
  ],
] as const;

const purposes = ["study", "work", "language", "reading", "friends", "chat"];
const hosts = ["An", "Bình", "Chi", "Duy", "Hà", "Linh", "Minh", "Vy"];
const titles = [
  "Một sáng học bài, một ly cà phê",
  "Mang laptop, cùng làm việc nhé",
  "English & coffee, nói sai cũng vui",
  "Mang cuốn sách bạn đang đọc dở",
  "Một chiếc hẹn làm quen cuối tuần",
  "Cà phê nhé?",
  "Đổi sách cuối tuần",
  "Cà phê, ảnh film và một buổi sáng thong thả qua những con phố nhỏ của Sài Gòn",
  "Một bàn gần cửa sổ",
  "Hẹn nhau sau giờ làm",
];
const descriptions = [
  "Học cùng nhau theo nhịp Pomodoro, nghỉ giải lao thì kể nhau nghe một chuyện vui. Bạn mang tài liệu, mình giữ chỗ nhé!",
  "Một góc bàn yên tĩnh cho những việc còn dang dở. Cùng tập trung, thỉnh thoảng chia sẻ một ý tưởng hay.",
  "Trò chuyện tiếng Anh thật thoải mái về phim, du lịch và những chuyện nhỏ mỗi ngày. Trình độ nào cũng chào đón.",
  "Mỗi người một cuốn sách, cùng đọc trong yên lặng rồi chia sẻ một đoạn mình thích. Không cần đọc xong mới đến đâu.",
  "Một nhóm nhỏ, vài câu chuyện dễ thương và một buổi chiều không vội. Đi một mình cũng được, về có thêm bạn nhé.",
  "",
  "Mang một cuốn sách bạn muốn đổi.",
  "Mình hẹn nhau ở quán trước, gọi món rồi kể nhau nghe về một góc thành phố mình thích. Sau đó, ai muốn có thể cùng đi bộ một đoạn ngắn và chụp vài tấm ảnh film. Bạn không cần mang máy ảnh hay chuẩn bị gì cả. Nếu trời mưa, tụi mình cứ ngồi trong quán, nói chuyện và đổi vài gợi ý về những nơi đáng ghé. Đến muộn một chút vẫn được, cứ nhắn mình trước nhé.",
  "Đến sớm thì mình giữ chỗ cạnh cửa sổ nhé.\n\nNếu bàn đó bận, mình ngồi ở tầng trệt.",
  "Gặp nhau lúc tan làm!",
];

export const mockMeetupIds = titles.map((_, index) => `mock-meetup-${index + 1}`);

function isoInDays(dayOffset: number, hour: number) {
  const today = new Date(Date.now() + 7 * 3600000).toISOString().slice(0, 10);
  const date = new Date(`${today}T00:00:00+07:00`);
  date.setUTCDate(date.getUTCDate() + dayOffset);
  date.setUTCHours(date.getUTCHours() + hour);
  return date.toISOString();
}

export function mockCoffeeMeetups(filters?: MeetupFilters, userId = "mock-user"): CoffeeMeetup[] {
  const items = titles.map((title, index): CoffeeMeetup => {
    const cafe = cafes[index % cafes.length];
    const maxParticipants = [4, 3, 4, 2, 5][index % cafes.length];
    const acceptedCount = index < 5 ? [2, 1, 3, 2, 2][index] : 1;
    const externalName =
      index === 5 ? "Bosgaurus Coffee Roasters" : index === 7 ? "Nấp Saigon" : null;
    return {
      id: mockMeetupIds[index],
      cafeId: externalName ? null : cafe[0],
      place: externalName
        ? {
            kind: "external",
            name: externalName,
            googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(externalName + " Ho Chi Minh City")}`,
          }
        : { kind: "cafe", cafeId: cafe[0] },
      cafe: externalName
        ? null
        : {
            id: cafe[0],
            name: cafe[1],
            slug: cafe[2],
            district: cafe[3],
            address: `${12 + index} Mock Street, ${cafe[3]}`,
            images: cafe[4] ? [cafe[4]] : [],
            coverImage: cafe[4],
            lat: cafe[5],
            lng: cafe[6],
          },
      organizerId: index % 6 === 0 ? userId : `mock-host-${index % hosts.length}`,
      organizerName: hosts[index % hosts.length],
      purpose: purposes[index % purposes.length],
      purposeIcon: ["book", "work", "language", "book", "friends"][index % cafes.length],
      purposeColor: ["#65754f", "#986544", "#857091", "#a0863e", "#a16d65"][index % cafes.length],
      invitationTemplate: [
        "envelope",
        "postcard",
        "ticket",
        "film",
        "latte",
        "matchbox",
        "pressed-flower",
        "receipt",
        "window",
        "checkers",
      ][index],
      invitationColor: ["rose", "blue", "matcha", "cocoa", "caramel"][index % cafes.length],
      title,
      description: descriptions[index],
      startsAt: isoInDays((index % 10) + 1, 8 + (index % 10)),
      endsAt: isoInDays((index % 10) + 1, 10 + (index % 10)),
      maxParticipants,
      status: acceptedCount >= maxParticipants ? "full" : "open",
      createdAt: isoInDays(-index - 1, 9),
      acceptedCount,
      pendingCount: 0,
      myRequestStatus: null,
      requests: Array.from({ length: acceptedCount - 1 }, (_, guest) => ({
        id: `mock-request-${index + 1}-${guest}`,
        requesterId: `mock-requester-${index}-${guest}`,
        requesterName: hosts[(index + guest + 1) % hosts.length],
        message: "Mình tham gia được nha.",
        status: "accepted",
        createdAt: isoInDays(-index, 10),
      })),
    };
  });

  const filtered = items.filter((meetup) => {
    if (filters?.nearMe) {
      const { lat, lng, radiusKm = 2 } = filters;
      if (
        lat == null ||
        lng == null ||
        !Number.isFinite(lat) ||
        !Number.isFinite(lng) ||
        Math.abs(lat) > 90 ||
        Math.abs(lng) > 180 ||
        !Number.isFinite(radiusKm) ||
        radiusKm <= 0
      )
        return false;
      const radians = Math.PI / 180;
      const { lat: cafeLat, lng: cafeLng } = meetup.cafe ?? {};
      if (cafeLat == null || cafeLng == null) return false;
      const a =
        Math.sin(((cafeLat - lat) * radians) / 2) ** 2 +
        Math.cos(lat * radians) *
          Math.cos(cafeLat * radians) *
          Math.sin(((cafeLng - lng) * radians) / 2) ** 2;
      meetup.distanceKm = 6371 * 2 * Math.asin(Math.sqrt(Math.min(1, a)));
      meetup.distanceMode = "straight";
      if (meetup.distanceKm > radiusKm) return false;
    }
    if (filters?.purpose && meetup.purpose !== filters.purpose) return false;
    if (filters?.area && meetup.cafe?.district !== filters.area) return false;
    if (
      filters?.date &&
      new Date(new Date(meetup.startsAt).getTime() + 7 * 3600000).toISOString().slice(0, 10) !==
        filters.date
    )
      return false;
    if (filters?.availableOnly && meetup.acceptedCount >= meetup.maxParticipants) return false;
    return true;
  });

  return filters?.nearMe
    ? filtered.sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0))
    : filtered;
}

export function mockCoffeeMeetup(id: string, userId?: string): CoffeeMeetup | null {
  return mockCoffeeMeetups(undefined, userId).find((meetup) => meetup.id === id) ?? null;
}
