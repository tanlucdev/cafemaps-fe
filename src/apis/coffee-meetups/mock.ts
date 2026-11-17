import type { CoffeeMeetup, MeetupFilters } from "./types";

const cafes = [
  ["cafe-mock-1", "Every Half Coffee", "every-half-coffee", "Quận 1", "/image/home-polaroid-1.jpg", 10.7758, 106.7009],
  ["cafe-mock-2", "Okkio Caffe", "okkio-caffe", "Quận 3", "/image/home-polaroid-2.jpg", 10.7826, 106.6932],
  ["cafe-mock-3", "The Workshop", "the-workshop", "Quận 1", "/image/home-polaroid-3.jpg", 10.7734, 106.7041],
  ["cafe-mock-4", "Padma de Fleur", "padma-de-fleur", "Phú Nhuận", "/image/home-polaroid-4.jpg", 10.7979, 106.688],
  ["cafe-mock-5", "September Saigon", "september-saigon", "Quận 7", null, 10.7297, 106.7218],
] as const;

const purposes = [
  "Học tập",
  "Làm việc",
  "Luyện ngoại ngữ",
  "Đọc sách",
  "Gặp bạn mới",
  "Trò chuyện",
];
const hosts = ["An", "Bình", "Chi", "Duy", "Hà", "Linh", "Minh", "Vy"];
const titles = [
  "Pomodoro nhẹ nhàng",
  "Debug cùng nhau",
  "IELTS speaking practice",
  "Đọc sách im lặng",
  "Co-working cuối tuần",
  "Cafe nói chuyện sản phẩm",
  "Viết CV và portfolio",
];

function isoInDays(dayOffset: number, hour: number) {
  const date = new Date();
  date.setDate(date.getDate() + dayOffset);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
}

function distanceKm(fromLat: number, fromLng: number, toLat: number, toLng: number) {
  const toRad = (degree: number) => (degree * Math.PI) / 180;
  const dLat = toRad(toLat - fromLat);
  const dLng = toRad(toLng - fromLng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(fromLat)) * Math.cos(toRad(toLat)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function mockCoffeeMeetups(filters?: MeetupFilters, userId = "mock-user"): CoffeeMeetup[] {
  const items = titles.map((title, index): CoffeeMeetup => {
    const cafe = cafes[index % cafes.length];
    const maxParticipants = 2 + (index % 5);
    const acceptedCount = 1 + (index % maxParticipants);
    return {
      id: `mock-meetup-${index + 1}`,
      cafeId: cafe[0],
      cafe: {
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
      title,
      description: `Mock meetup #${index + 1} để test card, filter, trạng thái và trang chi tiết.`,
      startsAt: isoInDays((index % 10) + 1, 8 + (index % 10)),
      endsAt: isoInDays((index % 10) + 1, 10 + (index % 10)),
      maxParticipants,
      status: acceptedCount >= maxParticipants ? "full" : "open",
      createdAt: isoInDays(-index - 1, 9),
      acceptedCount,
      pendingCount: index % 3,
      myRequestStatus: index % 7 === 1 ? "accepted" : index % 7 === 2 ? "pending" : null,
      requests: [
        {
          id: `mock-request-${index + 1}`,
          requesterId: `mock-requester-${index}`,
          requesterName: `Bạn mock ${index + 1}`,
          message: "Mình tham gia được nha.",
          status: index % 4 === 0 ? "pending" : "accepted",
          createdAt: isoInDays(-index, 10),
        },
      ],
    };
  });

  const filtered = items.filter((meetup) => {
    if (filters?.purpose && meetup.purpose !== filters.purpose) return false;
    if (filters?.area && meetup.cafe?.district !== filters.area) return false;
    if (filters?.date && meetup.startsAt.slice(0, 10) !== filters.date) return false;
    if (filters?.availableOnly && meetup.acceptedCount >= meetup.maxParticipants) return false;
    return true;
  });

  if (!filters?.nearMe || filters.lat === undefined || filters.lng === undefined) return filtered;

  const radiusKm = filters.radiusKm ?? 2;
  return filtered
    .map((meetup) => {
      const distance = distanceKm(filters.lat!, filters.lng!, meetup.cafe!.lat!, meetup.cafe!.lng!);
      return {
        ...meetup,
        cafe: meetup.cafe
          ? {
              ...meetup.cafe,
              distanceKm: Number(distance.toFixed(2)),
              distanceMode: "straight" as const,
            }
          : null,
      };
    })
    .filter((meetup) => (meetup.cafe?.distanceKm ?? Infinity) <= radiusKm)
    .sort((left, right) => (left.cafe?.distanceKm ?? 0) - (right.cafe?.distanceKm ?? 0));
}

export function mockCoffeeMeetup(id: string, userId?: string): CoffeeMeetup | null {
  return mockCoffeeMeetups(undefined, userId).find((meetup) => meetup.id === id) ?? null;
}
