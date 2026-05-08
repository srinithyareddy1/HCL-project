const API_URL = 'http://localhost:8080';

const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let error;
    try {
      error = await response.json();
    } catch {
      const text = await response.text();
      throw new Error(text || 'API request failed');
    }
    throw new Error(error.message || 'API request failed');
  }

  // If response is text (like delete or simple string returns)
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    return response.json();
  } else {
    return response.text();
  }
};

// Map backend hotel to frontend expected format
export const mapHotel = (h) => ({
  id: h.id,
  name: h.name,
  location: h.location,
  city: h.location ? h.location.split(',')[0].trim() : '',
  country: 'India',
  rating: h.rating || 4.5,
  reviewCount: Math.floor(Math.random() * 1000) + 100,
  pricePerNight: 2500, // Default base price since hotels API doesn't include rooms
  category: h.rating >= 4.8 ? "Luxury" : "Business",
  description: h.description,
  longDescription: h.description,
  image: h.imageUrl || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80",
  images: [h.imageUrl || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80"],
  amenities: ["Free WiFi", "Pool", "Spa", "Restaurant", "Room Service"],
  featured: h.rating >= 4.7,
  available: true
});

// Map backend room to frontend expected format
export const mapRoom = (r) => ({
  id: r.id,
  hotelId: r.hotel ? r.hotel.id : null,
  type: r.roomType,
  price: r.price,
  capacity: r.capacity,
  size: r.capacity * 20 + 20, // rough estimate
  description: `${r.roomType} room with excellent amenities.`,
  amenities: ["King Bed", "Free WiFi", "Minibar", "Safe"],
  image: r.imageUrl || "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80",
  available: r.available
});

// Map backend promotion
export const mapPromo = (p) => ({
  id: p.id,
  title: p.code,
  description: p.description || p.code,
  code: p.code,
  discount: p.discountValue,
  type: p.discountType && p.discountType.toLowerCase() === 'flat' ? 'fixed' : 'percentage',
  validUntil: p.validUntil,
});

export const mapBooking = (b) => {
  let displayStatus = b.status ? b.status.toLowerCase() : "confirmed";
  if (displayStatus === 'confirmed') {
    const today = new Date().toISOString().split('T')[0];
    displayStatus = b.checkOut < today ? 'completed' : 'upcoming';
  }

  return {
    id: b.id,
    userId: b.user ? b.user.id : null,
    hotelId: b.room && b.room.hotel ? b.room.hotel.id : null,
    roomId: b.room ? b.room.id : null,
    hotelName: b.room && b.room.hotel ? b.room.hotel.name : "GrandStay Hotel",
    hotelImage: b.room && b.room.hotel ? b.room.hotel.imageUrl : null,
    roomType: b.room ? b.room.roomType : "Room",
    location: b.room && b.room.hotel ? b.room.hotel.location : "",
    checkIn: b.checkIn,
    checkOut: b.checkOut,
    nights: Math.ceil((new Date(b.checkOut) - new Date(b.checkIn)) / (1000 * 60 * 60 * 24)),
    guests: b.room ? b.room.capacity : 2,
    totalAmount: b.totalPrice || b.finalPrice || 0,
    status: displayStatus,
    confirmationNumber: `GS-BK-${b.id}`,
    createdAt: new Date().toISOString().split('T')[0]
  };
};

export const api = {
  // Auth
  login: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  
  // Hotels
  getHotels: async () => {
    const data = await request('/hotels/all');
    return data.map(mapHotel);
  },
  searchHotels: async (query) => {
    const params = new URLSearchParams();
    if (query.location) params.append('location', query.location);
    if (query.name) params.append('name', query.name);
    if (query.minRating) params.append('minRating', query.minRating);
    const data = await request(`/hotels/search?${params.toString()}`);
    return data.map(mapHotel);
  },
  getHotelById: async (id) => {
    const data = await request(`/hotels/${id}`);
    return mapHotel(data);
  },
  
  // Rooms
  getRoomsByHotel: async (hotelId) => {
    const data = await request(`/rooms/hotel/${hotelId}`);
    return data.map(mapRoom);
  },
  getAllRooms: async () => {
    const data = await request('/rooms/all');
    return data.map(mapRoom);
  },
  getRoomById: async (roomId) => {
    const data = await request('/rooms/all');
    const room = data.find(r => r.id === parseInt(roomId));
    return room ? mapRoom(room) : null;
  },
  getAvailableRoomsByHotel: async (hotelId, checkIn, checkOut) => {
    const data = await request(`/rooms/hotel/${hotelId}/available?checkIn=${checkIn}&checkOut=${checkOut}`);
    return data.map(mapRoom);
  },
  
  // Bookings
  bookRoom: (data) => request('/bookings/book', { method: 'POST', body: JSON.stringify(data) }),
  getMyBookings: async () => {
    const data = await request('/bookings/my-bookings');
    return data.map(mapBooking);
  },
  cancelBooking: (id) => request(`/bookings/cancel/${id}`, { method: 'DELETE' }),
  getMyLoyalty: () => request('/bookings/my-loyalty'),
  
  // Promotions
  getActivePromotions: async () => {
    const data = await request('/promotions/active');
    return data.map(mapPromo);
  },
  validatePromo: (code, price) => request(`/promotions/validate?code=${code}&price=${price}`),
  
  // Users
  getMyProfile: () => request('/users/me'),
};
