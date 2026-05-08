// ============================================
// MOCK DATA SERVICE - Hotel Booking App
// ============================================

export const hotels = [
  {
    id: 1,
    name: "The Grand Meridian",
    location: "Paris, France",
    city: "Paris",
    country: "France",
    rating: 4.9,
    reviewCount: 1284,
    pricePerNight: 420,
    category: "Luxury",
    description: "Nestled in the heart of Paris, The Grand Meridian offers unrivaled elegance with panoramic views of the Eiffel Tower. Experience world-class hospitality in our meticulously designed suites.",
    longDescription: "The Grand Meridian is a landmark of Parisian luxury. With 180 years of heritage, this iconic palace hotel blends timeless elegance with contemporary comfort. Our Michelin-starred restaurant, award-winning spa, and attentive service make every stay unforgettable.",
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80",
      "https://images.unsplash.com/photo-1560347876-aeef00ee58a1?w=800&q=80",
    ],
    amenities: ["Free WiFi", "Pool", "Spa", "Gym", "Restaurant", "Bar", "Concierge", "Valet Parking", "Room Service", "Airport Shuttle"],
    tags: ["Eiffel View", "Michelin Star", "Heritage"],
    featured: true,
    available: true,
  },
  {
    id: 2,
    name: "Azure Cove Resort",
    location: "Santorini, Greece",
    city: "Santorini",
    country: "Greece",
    rating: 4.8,
    reviewCount: 956,
    pricePerNight: 380,
    category: "Resort",
    description: "Perched on the cliffs of Santorini, Azure Cove offers breathtaking caldera views, infinity pools, and an authentic Greek luxury experience unlike any other.",
    longDescription: "Azure Cove Resort is carved into the volcanic cliffs of Oia, offering the most spectacular sunsets in the world. Each suite is a private sanctuary with plunge pools and direct caldera views. Our culinary team crafts Mediterranean masterpieces from local ingredients.",
    image: "https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=800&q=80",
      "https://images.unsplash.com/photo-1601701119533-fde78e495645?w=800&q=80",
      "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800&q=80",
      "https://images.unsplash.com/photo-1596436889106-be35e843f974?w=800&q=80",
    ],
    amenities: ["Infinity Pool", "Spa", "Private Beach", "Restaurant", "Bar", "Water Sports", "Sunset Tours", "Free WiFi"],
    tags: ["Caldera View", "Cliffside", "Romantic"],
    featured: true,
    available: true,
  },
  {
    id: 3,
    name: "Tokyo Sky Tower Hotel",
    location: "Tokyo, Japan",
    city: "Tokyo",
    country: "Japan",
    rating: 4.7,
    reviewCount: 2103,
    pricePerNight: 290,
    category: "Business",
    description: "A futuristic urban retreat in the heart of Tokyo. Combining cutting-edge Japanese design with exceptional hospitality, offering stunning city skyline views.",
    longDescription: "The Tokyo Sky Tower Hotel seamlessly blends traditional Japanese aesthetics with ultramodern design. Located in Shinjuku, it provides easy access to Tokyo's finest dining, shopping, and cultural experiences. Our top-floor sky lounge offers 360-degree city panoramas.",
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80",
      "https://images.unsplash.com/photo-1590073844006-33379778ae09?w=800&q=80",
      "https://images.unsplash.com/photo-1576354302919-96748cb8299e?w=800&q=80",
    ],
    amenities: ["Free WiFi", "Gym", "Spa", "Restaurant", "Sky Bar", "Business Center", "Concierge"],
    tags: ["City View", "Business", "Modern"],
    featured: false,
    available: true,
  },
  {
    id: 4,
    name: "Serengeti Lodge & Safari",
    location: "Arusha, Tanzania",
    city: "Arusha",
    country: "Tanzania",
    rating: 4.9,
    reviewCount: 489,
    pricePerNight: 650,
    category: "Safari",
    description: "An exclusive eco-luxury lodge overlooking the Serengeti plains. Witness the Great Migration from your private veranda while enjoying world-class safari experiences.",
    longDescription: "Serengeti Lodge & Safari offers an unparalleled connection to Africa's wild heart. Our 12 private tented villas sit atop a granite kopje, each with sweeping views over the endless savannah. Expert guides lead daily game drives in open 4x4 vehicles.",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
      "https://images.unsplash.com/photo-1534786290834-b70e5d8e6e5c?w=800&q=80",
    ],
    amenities: ["Safari Tours", "Pool", "Restaurant", "Bar", "Free WiFi", "Spa", "Game Drives", "Bush Dinners"],
    tags: ["Safari", "Wildlife", "Eco-Luxury"],
    featured: true,
    available: true,
  },
  {
    id: 5,
    name: "Manhattan Heights",
    location: "New York, USA",
    city: "New York",
    country: "USA",
    rating: 4.6,
    reviewCount: 3241,
    pricePerNight: 340,
    category: "Business",
    description: "Iconic New York luxury in Midtown Manhattan. Steps from Central Park and Fifth Avenue, offering spectacular skyline views and world-class amenities.",
    longDescription: "Manhattan Heights stands as a beacon of New York City luxury. Our 85-floor tower houses 500 meticulously appointed rooms and suites. From our rooftop terrace, guests enjoy breathtaking views of Central Park and the Manhattan skyline.",
    image: "https://images.unsplash.com/photo-1544124499-58912f68d95b?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1544124499-58912f68d95b?w=800&q=80",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80",
    ],
    amenities: ["Free WiFi", "Gym", "Pool", "Spa", "Restaurant", "Bar", "Business Center", "Concierge", "Valet"],
    tags: ["Midtown", "Skyline View", "Business"],
    featured: false,
    available: true,
  },
  {
    id: 6,
    name: "Maldives Pearl Overwater",
    location: "Male Atoll, Maldives",
    city: "Male Atoll",
    country: "Maldives",
    rating: 5.0,
    reviewCount: 724,
    pricePerNight: 890,
    category: "Resort",
    description: "Ultimate overwater luxury in the crystal-clear waters of the Maldives. Private glass-floor villas with direct ocean access and unparalleled marine experiences.",
    longDescription: "The Maldives Pearl Overwater Resort is the pinnacle of tropical luxury. Our 40 overwater villas float above the turquoise lagoon, each featuring a glass floor panel, private deck, and direct water access. World-class diving, snorkeling, and spa await.",
    image: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&q=80",
      "https://images.unsplash.com/photo-1540202404-a2f29016b523?w=800&q=80",
    ],
    amenities: ["Private Pool", "Spa", "Diving Center", "Restaurant", "Bar", "Water Sports", "Snorkeling", "Free WiFi"],
    tags: ["Overwater Villa", "Private Pool", "Honeymoon"],
    featured: true,
    available: true,
  },
  {
    id: 7,
    name: "Barcelona Art Hotel",
    location: "Barcelona, Spain",
    city: "Barcelona",
    country: "Spain",
    rating: 4.5,
    reviewCount: 1876,
    pricePerNight: 220,
    category: "Boutique",
    description: "A vibrant boutique hotel in the heart of the Gothic Quarter. Inspired by Gaudí's masterpieces, featuring original artwork and a rooftop terrace with sea views.",
    longDescription: "Barcelona Art Hotel celebrates the city's rich artistic heritage. Our 72-room boutique property is adorned with original works by local artists. The rooftop pool terrace offers panoramic views from La Sagrada Família to the Mediterranean.",
    image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&q=80",
    ],
    amenities: ["Rooftop Pool", "Bar", "Free WiFi", "Spa", "Restaurant", "Art Gallery"],
    tags: ["Artistic", "Rooftop", "Boutique"],
    featured: false,
    available: true,
  },
  {
    id: 8,
    name: "Dubai Tower Suites",
    location: "Dubai, UAE",
    city: "Dubai",
    country: "UAE",
    rating: 4.8,
    reviewCount: 2567,
    pricePerNight: 560,
    category: "Luxury",
    description: "Sky-high luxury in the world's most glamorous city. Featuring private butler service, a sky pool at 200m, and unobstructed views of the Burj Khalifa.",
    longDescription: "Dubai Tower Suites redefines vertical luxury. Located in the DIFC, every suite offers panoramic views of the Dubai skyline. Our sky pool at 200 metres is among the highest in the world. The resident Michelin chef curates extraordinary dining experiences.",
    image: "https://images.unsplash.com/photo-1503152394-c571994fd383?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1503152394-c571994fd383?w=800&q=80",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&q=80",
    ],
    amenities: ["Sky Pool", "Butler Service", "Spa", "Gym", "Multiple Restaurants", "Bar", "Private Beach", "Helipad"],
    tags: ["Sky Pool", "Butler", "Ultra-Luxury"],
    featured: true,
    available: true,
  },
];

export const rooms = {
  1: [
    { id: 101, hotelId: 1, type: "Deluxe Room", price: 420, capacity: 2, size: 45, description: "Elegant room with Haussmann-style décor and partial Eiffel Tower view.", amenities: ["King Bed", "City View", "Minibar", "Safe", "Bathrobe", "Free WiFi"], image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80", available: true },
    { id: 102, hotelId: 1, type: "Superior Suite", price: 680, capacity: 2, size: 72, description: "Spacious suite with a separate living area and stunning Eiffel Tower views.", amenities: ["King Bed", "Eiffel View", "Living Room", "Jacuzzi", "Minibar", "Butler", "Free WiFi"], image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&q=80", available: true },
    { id: 103, hotelId: 1, type: "Grand Penthouse", price: 1200, capacity: 4, size: 180, description: "The pinnacle of Parisian luxury. Private terrace with 360° city views.", amenities: ["Master Bedroom", "Private Terrace", "Private Chef", "Jacuzzi", "Living Room", "Dining Room", "Butler"], image: "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=600&q=80", available: true },
  ],
  2: [
    { id: 201, hotelId: 2, type: "Classic Cave Suite", price: 380, capacity: 2, size: 40, description: "Traditional cycladic cave suite with caldera views and private plunge pool.", amenities: ["King Bed", "Plunge Pool", "Caldera View", "Minibar", "Free WiFi"], image: "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=600&q=80", available: true },
    { id: 202, hotelId: 2, type: "Infinity Pool Villa", price: 720, capacity: 2, size: 85, description: "Romantic villa with a private infinity pool that blends into the horizon.", amenities: ["King Bed", "Private Infinity Pool", "Outdoor Shower", "Butler", "Free WiFi"], image: "https://images.unsplash.com/photo-1601701119533-fde78e495645?w=600&q=80", available: true },
  ],
  3: [
    { id: 301, hotelId: 3, type: "City View Room", price: 290, capacity: 2, size: 38, description: "Modern room with floor-to-ceiling windows showcasing Tokyo's skyline.", amenities: ["Queen Bed", "City View", "Desk", "Free WiFi", "Smart TV"], image: "https://images.unsplash.com/photo-1590073844006-33379778ae09?w=600&q=80", available: true },
    { id: 302, hotelId: 3, type: "Sky Suite", price: 480, capacity: 2, size: 65, description: "Elevated suite on the 78th floor with panoramic views of Mount Fuji on clear days.", amenities: ["King Bed", "360° View", "Lounge", "Espresso Machine", "Butler", "Free WiFi"], image: "https://images.unsplash.com/photo-1576354302919-96748cb8299e?w=600&q=80", available: true },
  ],
  4: [
    { id: 401, hotelId: 4, type: "Tented Villa", price: 650, capacity: 2, size: 60, description: "Luxury tented villa perched on granite rocks, open to the African sky.", amenities: ["King Bed", "Private Veranda", "Outdoor Bath", "Safari Kit", "Free WiFi"], image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80", available: true },
    { id: 402, hotelId: 4, type: "Family Safari Suite", price: 950, capacity: 4, size: 100, description: "Spacious family suite with a connecting room and dedicated family game drives.", amenities: ["2 Bedrooms", "Living Area", "Private Pool", "Family Guide", "Free WiFi"], image: "https://images.unsplash.com/photo-1534786290834-b70e5d8e6e5c?w=600&q=80", available: true },
  ],
  5: [
    { id: 501, hotelId: 5, type: "Park View Room", price: 340, capacity: 2, size: 42, description: "Elegant room overlooking Central Park, the jewel of New York City.", amenities: ["King Bed", "Park View", "Minibar", "Safe", "Free WiFi"], image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&q=80", available: true },
    { id: 502, hotelId: 5, type: "Skyline Suite", price: 620, capacity: 2, size: 80, description: "Glamorous suite with wraparound views of the Manhattan skyline.", amenities: ["King Bed", "Skyline View", "Living Room", "Bar", "Butler", "Free WiFi"], image: "https://images.unsplash.com/photo-1544124499-58912f68d95b?w=600&q=80", available: false },
  ],
  6: [
    { id: 601, hotelId: 6, type: "Lagoon Water Villa", price: 890, capacity: 2, size: 150, description: "Iconic overwater villa above the crystal-clear lagoon with glass floor panel.", amenities: ["King Bed", "Glass Floor", "Private Deck", "Direct Ocean Access", "Free WiFi"], image: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=600&q=80", available: true },
    { id: 602, hotelId: 6, type: "Ocean Pool Villa", price: 1450, capacity: 2, size: 220, description: "Ultimate luxury overwater villa with private infinity pool and ocean views.", amenities: ["King Bed", "Private Pool", "Butler", "Outdoor Shower", "Sunset View", "Free WiFi"], image: "https://images.unsplash.com/photo-1540202404-a2f29016b523?w=600&q=80", available: true },
  ],
  7: [
    { id: 701, hotelId: 7, type: "Artist Studio", price: 220, capacity: 2, size: 32, description: "Intimate room adorned with original local artwork and private terrace.", amenities: ["Queen Bed", "Terrace", "Art Prints", "Free WiFi", "Espresso"], image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=600&q=80", available: true },
  ],
  8: [
    { id: 801, hotelId: 8, type: "Sky Suite", price: 560, capacity: 2, size: 90, description: "Ultra-luxe sky suite on the 60th floor with Burj Khalifa views.", amenities: ["King Bed", "Burj View", "Living Room", "Butler", "Minibar", "Free WiFi"], image: "https://images.unsplash.com/photo-1503152394-c571994fd383?w=600&q=80", available: true },
    { id: 802, hotelId: 8, type: "Royal Penthouse", price: 2500, capacity: 4, size: 400, description: "The most exclusive address in Dubai with 4 bedrooms and private pool.", amenities: ["4 Bedrooms", "Private Pool", "Private Chef", "Helipad Access", "Butler"], image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&q=80", available: true },
  ],
};

export const promotions = [
  { id: 1, title: "Early Bird Discount", description: "Book 30 days in advance and save 20% on all rooms.", code: "EARLY20", discount: 20, type: "percentage", validUntil: "2025-12-31", hotels: [1, 2, 5, 8] },
  { id: 2, title: "Weekend Getaway", description: "Enjoy 15% off on Friday to Sunday stays.", code: "WEEKEND15", discount: 15, type: "percentage", validUntil: "2025-12-31", hotels: [3, 4, 7] },
  { id: 3, title: "Honeymoon Package", description: "Special $100 off for couples celebrating. Includes champagne.", code: "LOVE100", discount: 100, type: "fixed", validUntil: "2025-12-31", hotels: [2, 6] },
  { id: 4, title: "Loyalty Reward", description: "Returning guests get 25% off their next booking.", code: "LOYAL25", discount: 25, type: "percentage", validUntil: "2025-12-31", hotels: "all" },
];

export const mockUser = {
  id: "u1",
  name: "Alex Johnson",
  email: "alex.johnson@email.com",
  phone: "+1 (555) 234-5678",
  avatar: null,
  loyaltyPoints: 3400,
  memberSince: "2023-01-15",
  tier: "Gold",
};

export const mockBookings = [
  {
    id: "BK001",
    userId: "u1",
    hotelId: 1,
    roomId: 101,
    hotelName: "The Grand Meridian",
    hotelImage: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&q=80",
    roomType: "Deluxe Room",
    location: "Paris, France",
    checkIn: "2025-03-15",
    checkOut: "2025-03-19",
    nights: 4,
    guests: 2,
    totalAmount: 1680,
    status: "completed",
    confirmationNumber: "GRD-20250315-001",
    createdAt: "2025-02-10",
  },
  {
    id: "BK002",
    userId: "u1",
    hotelId: 2,
    roomId: 201,
    hotelName: "Azure Cove Resort",
    hotelImage: "https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=400&q=80",
    roomType: "Classic Cave Suite",
    location: "Santorini, Greece",
    checkIn: "2025-08-20",
    checkOut: "2025-08-25",
    nights: 5,
    guests: 2,
    totalAmount: 1900,
    status: "upcoming",
    confirmationNumber: "AZC-20250820-002",
    createdAt: "2025-04-01",
  },
  {
    id: "BK003",
    userId: "u1",
    hotelId: 6,
    roomId: 601,
    hotelName: "Maldives Pearl Overwater",
    hotelImage: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=400&q=80",
    roomType: "Lagoon Water Villa",
    location: "Male Atoll, Maldives",
    checkIn: "2025-12-24",
    checkOut: "2025-12-31",
    nights: 7,
    guests: 2,
    totalAmount: 6230,
    status: "upcoming",
    confirmationNumber: "MLD-20251224-003",
    createdAt: "2025-04-20",
  },
];

// Utility: get flat room by id
export const getRoomById = (roomId) => {
  for (const hotelRooms of Object.values(rooms)) {
    const found = hotelRooms.find((r) => r.id === roomId);
    if (found) return found;
  }
  return null;
};

export const getHotelById = (id) => hotels.find((h) => h.id === id);

export const searchHotels = ({ location = "", checkIn, checkOut, guests = 1, minPrice = 0, maxPrice = 9999, amenities = [] }) => {
  return hotels.filter((h) => {
    const matchLocation = !location || h.city.toLowerCase().includes(location.toLowerCase()) || h.country.toLowerCase().includes(location.toLowerCase()) || h.name.toLowerCase().includes(location.toLowerCase());
    const matchPrice = h.pricePerNight >= minPrice && h.pricePerNight <= maxPrice;
    const matchAmenities = amenities.length === 0 || amenities.every((a) => h.amenities.includes(a));
    return matchLocation && matchPrice && matchAmenities;
  });
};
