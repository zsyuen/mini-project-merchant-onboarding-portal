package com.merchant.portal.config;

import com.merchant.portal.model.User;
import com.merchant.portal.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;

    public DataSeeder(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.findByUsername("admin").isEmpty()) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword("password123");
            admin.setEmail("admin@test.com");
            userRepository.save(admin);
            System.out.println("Default admin user created in 'users' table.");
        }
    }
}