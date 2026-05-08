package com.example.hotelmgmt.config;

import com.example.hotelmgmt.entity.Hotel;
import com.example.hotelmgmt.entity.Room;
import com.example.hotelmgmt.entity.User;
import com.example.hotelmgmt.repository.HotelRepository;
import com.example.hotelmgmt.repository.RoomRepository;
import com.example.hotelmgmt.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * 🌱 DATA SEEDER
 *
 * Auto-inserts sample Telangana hotels, rooms, and an admin account
 * on first startup (only when the hotels table is empty).
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    @Autowired private HotelRepository  hotelRepository;
    @Autowired private RoomRepository   roomRepository;
    @Autowired private UserRepository   userRepository;
    @Autowired private PasswordEncoder  passwordEncoder;

    @Override
    public void run(String... args) {
        if (hotelRepository.count() == 0) {
            seedHotelsAndRooms();
        } else {
            log.info("🏨 Hotels already seeded — skipping.");
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // ADMIN SEED
    // ─────────────────────────────────────────────────────────────────────────
    private void seedAdmin() {
        if (userRepository.findByEmail("admin@grandstay.com").isEmpty()) {
            User admin = new User();
            admin.setName("GrandStay Admin");
            admin.setEmail("admin@grandstay.com");
            admin.setPassword(passwordEncoder.encode("Admin@123"));
            admin.setPhone("9000000000");
            admin.setRole("ROLE_ADMIN");
            userRepository.save(admin);
            log.info("✅ Admin seeded — email: admin@grandstay.com  password: Admin@123");
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // HOTELS & ROOMS SEED
    // ─────────────────────────────────────────────────────────────────────────
    private void seedHotelsAndRooms() {
        log.info("🌱 Seeding Telangana hotels and rooms...");

        // ── 1. The Westin Hyderabad Mindspace ─────────────────────────────────
        Hotel westin = hotel("The Westin Hyderabad Mindspace",
                "Hyderabad, Telangana",
                "A luxurious 5-star hotel in the heart of Hyderabad's IT corridor, HITEC City.",
                4.8,
                "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800");
        addRooms(westin, List.of(
                room("DELUXE",   4500.0, 2, true),
                room("SUITE",    9500.0, 3, true),
                room("DOUBLE",   3200.0, 2, true),
                room("SINGLE",   2200.0, 1, true)
        ));

        // ── 2. Taj Falaknuma Palace ───────────────────────────────────────────
        Hotel taj = hotel("Taj Falaknuma Palace",
                "Hyderabad, Telangana",
                "A 19th-century palace hotel perched on a hill, offering royal heritage stays.",
                4.9,
                "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800");
        addRooms(taj, List.of(
                room("SUITE",   18000.0, 4, true),
                room("DELUXE",  11000.0, 2, true),
                room("DOUBLE",   8500.0, 2, true)
        ));

        // ── 3. Novotel Hyderabad Convention Centre ────────────────────────────
        Hotel novotel = hotel("Novotel Hyderabad Convention Centre",
                "Hyderabad, Telangana",
                "Modern 5-star hotel adjacent to the Hyderabad International Convention Centre.",
                4.6,
                "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800");
        addRooms(novotel, List.of(
                room("DOUBLE",   5500.0, 2, true),
                room("DELUXE",   7500.0, 3, true),
                room("SUITE",   12000.0, 4, true),
                room("SINGLE",   3500.0, 1, true)
        ));

        // ── 4. Courtyard by Marriott Warangal ─────────────────────────────────
        Hotel marriott = hotel("Courtyard by Marriott Warangal",
                "Warangal, Telangana",
                "A premium business hotel near Warangal's historic Kakatiya temples.",
                4.5,
                "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800");
        addRooms(marriott, List.of(
                room("SINGLE",  1800.0, 1, true),
                room("DOUBLE",  3000.0, 2, true),
                room("DELUXE",  4500.0, 3, true)
        ));

        // ── 5. Hotel Minerva Grand Karimnagar ─────────────────────────────────
        Hotel minerva = hotel("Hotel Minerva Grand Karimnagar",
                "Karimnagar, Telangana",
                "A comfortable 4-star hotel offering excellent facilities in Karimnagar city.",
                4.2,
                "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800");
        addRooms(minerva, List.of(
                room("SINGLE", 1200.0, 1, true),
                room("DOUBLE", 2000.0, 2, true),
                room("SUITE",  4500.0, 3, true)
        ));

        // ── 6. Haritha Hotel Nagarjunasagar ───────────────────────────────────
        Hotel haritha = hotel("Haritha Hotel Nagarjunasagar",
                "Nagarjunasagar, Telangana",
                "APTDC resort on the banks of Nagarjunasagar Dam, perfect for nature getaways.",
                4.1,
                "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800");
        addRooms(haritha, List.of(
                room("DOUBLE",  2500.0, 2, true),
                room("DELUXE",  3800.0, 3, true),
                room("SINGLE",  1600.0, 1, true)
        ));

        // ── 7. The Park Hyderabad ─────────────────────────────────────────────
        Hotel park = hotel("The Park Hyderabad",
                "Hyderabad, Telangana",
                "Boutique luxury hotel in Somajiguda, known for its art-deco design and rooftop pool.",
                4.7,
                "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800");
        addRooms(park, List.of(
                room("SINGLE",  2800.0, 1, true),
                room("DOUBLE",  4200.0, 2, true),
                room("SUITE",  10000.0, 4, true),
                room("DELUXE",  6500.0, 2, true)
        ));

        // ── 8. Hotel Aditya Khammam ────────────────────────────────────────────
        Hotel aditya = hotel("Hotel Aditya Grand",
                "Khammam, Telangana",
                "A well-rated business hotel in Khammam, close to major commercial areas.",
                4.0,
                "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800");
        addRooms(aditya, List.of(
                room("SINGLE",  1000.0, 1, true),
                room("DOUBLE",  1800.0, 2, true),
                room("DELUXE",  2800.0, 2, true)
        ));

        // ── 9. Golkonda Resorts & Spa ─────────────────────────────────────────
        Hotel golkonda = hotel("Golkonda Resorts & Spa",
                "Hyderabad, Telangana",
                "Award-winning eco-resort near Golkonda Fort with lush greenery and a world-class spa.",
                4.7,
                "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800");
        addRooms(golkonda, List.of(
                room("SUITE",   14000.0, 4, true),
                room("DELUXE",   8000.0, 3, true),
                room("DOUBLE",   5500.0, 2, true)
        ));

        // ── 10. Hotel Swagath Nalgonda ────────────────────────────────────────
        Hotel swagath = hotel("Hotel Swagath Nalgonda",
                "Nalgonda, Telangana",
                "Comfortable and affordable hotel ideal for travellers visiting the Nagarjuna Sagar belt.",
                3.9,
                "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800");
        addRooms(swagath, List.of(
                room("SINGLE",   900.0, 1, true),
                room("DOUBLE",  1600.0, 2, true)
        ));

        log.info("✅ Seeded 10 Telangana hotels with {} total rooms",
                roomRepository.count());
    }

    // ─────────────────────────────────────────────────────────────────────────
    // HELPERS
    // ─────────────────────────────────────────────────────────────────────────
    private Hotel hotel(String name, String location, String description,
                         Double rating, String imageUrl) {
        Hotel h = new Hotel();
        h.setName(name); h.setLocation(location);
        h.setDescription(description); h.setRating(rating);
        h.setImageUrl(imageUrl);
        return hotelRepository.save(h);
    }

    private Room room(String type, Double price, Integer capacity, Boolean available) {
        Room r = new Room();
        r.setRoomType(type); r.setPrice(price);
        r.setCapacity(capacity); r.setAvailable(available);
        return r;
    }

    private void addRooms(Hotel hotel, List<Room> rooms) {
        for (Room r : rooms) {
            r.setHotel(hotel);
            roomRepository.save(r);
        }
    }
}
