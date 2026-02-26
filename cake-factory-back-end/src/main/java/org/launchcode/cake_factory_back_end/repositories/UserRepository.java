package org.launchcode.cake_factory_back_end.repositories;

import org.launchcode.cake_factory_back_end.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
}