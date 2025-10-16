package com.erfan.cch.Repo;

import com.erfan.cch.Models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String username);
    boolean existsByEmail(String email);
}
