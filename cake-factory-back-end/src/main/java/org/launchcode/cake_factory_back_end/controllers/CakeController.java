package org.launchcode.cake_factory_back_end.controllers;

import org.launchcode.cake_factory_back_end.models.Cake;
import org.launchcode.cake_factory_back_end.repositories.CakeRepository;
import org.springframework.beans.factory.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cakes")
public class CakeController {
    @Autowired
    CakeRepository cakeRepository;
    // GET /api/cakes - get all cakes
    @GetMapping("")
    public ResponseEntity<?> getAllCakes() {
        List<Cake> allCakes = cakeRepository.findAll();
        return new ResponseEntity<>(allCakes, HttpStatus.OK);//200
    }

    // GET /api/cakes/{id} - get one cake by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getCakeById(@PathVariable Long id) {
        Cake cake = cakeRepository.findById(id).orElse(null);
        return new ResponseEntity<>(cake,HttpStatus.OK);//200
    }

    // GET /api/cakes/category/{category} - get cakes by category
    @GetMapping("/category/{category}")
    public ResponseEntity<?> getCakesByCategory(@PathVariable Cake.Category category) {
        List<Cake> cakes = cakeRepository.findByCategory(category);
        if(cakes.isEmpty()) {
            return new ResponseEntity<>("No cakes found in this category", HttpStatus.NOT_FOUND);//404
        }
        return new ResponseEntity<>(cakes,HttpStatus.OK);//200
    }

    // GET /api/cakes/customizable - get all customizable cakes
    @GetMapping("/customizable")
    public ResponseEntity<?> getCustomizableCakes() {
        List<Cake> cakes = cakeRepository.findByCustomizationTrue();
        if(cakes.isEmpty()) {
            return new ResponseEntity<>("No customizable cakes found", HttpStatus.NOT_FOUND);//404
        }
        return new ResponseEntity<>(cakes, HttpStatus.OK);//200
    }
}
