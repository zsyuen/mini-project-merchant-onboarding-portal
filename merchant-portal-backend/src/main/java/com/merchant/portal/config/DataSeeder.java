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

        // Create default Reviewer/Super Admin
        if (userRepository.findByUsername("reviewer").isEmpty()) {
            User reviewer = new User();
            reviewer.setUsername("reviewer");
            reviewer.setPassword("reviewer123");
            reviewer.setEmail("reviewer@test.com");
            reviewer.setRole("reviewer"); // This is the Super Admin role
            userRepository.save(reviewer);
            System.out.println("Default Reviewer is created.");
        }else{
            System.out.println("Reviewer already exists.");
        }
    }
}