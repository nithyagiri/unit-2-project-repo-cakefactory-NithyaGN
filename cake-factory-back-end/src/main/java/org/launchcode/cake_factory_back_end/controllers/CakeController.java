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
@CrossOrigin(origins = "*")
public class CakeController {
    @Autowired
    private CakeRepository cakeRepository;

    // GET /api/cakes - get all cakes
    @GetMapping("")
    public ResponseEntity<?> getAllCakes() {
        List<Cake> allCakes = cakeRepository.findAll();
        if (allCakes.isEmpty()) {
            return new ResponseEntity<>("No cakes found", HttpStatus.NOT_FOUND);//404
        }
        return ResponseEntity.status(HttpStatus.OK).body(allCakes);//200
    }

    // GET /api/cakes/{id} - get one cake by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getCakeById(@PathVariable Long id) {
        Cake cake = cakeRepository.findById(id).orElse(null);
        if (cake == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Cake not found with ID: " + id);//404
        }
        return ResponseEntity.status(HttpStatus.OK).body(cake);//200
    }

    // GET /api/cakes/category/{category} - get cakes by category
    @GetMapping("/category/{category}")
    public ResponseEntity<?> getCakesByCategory(@PathVariable Cake.Category category) {
        List<Cake> cakes = cakeRepository.findByCategory(category);
        if(cakes.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No cakes found in category: " + category);//404
        }
        return ResponseEntity.status(HttpStatus.OK).body(cakes);//200
    }

    // GET /api/cakes/customizable - get all customizable cakes
    @GetMapping("/customizable")
    public ResponseEntity<?> getCustomizableCakes() {
        List<Cake> cakes = cakeRepository.findByCustomizationTrue();
        if(cakes.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No customizable cakes found");//404
        }
        return ResponseEntity.status(HttpStatus.OK).body(cakes);//200
    }

     // GET /api/cakes/search?name= - search cakes by name
    @GetMapping("/search")
    public ResponseEntity<?> searchCakesByName(@RequestParam String name) {
        List<Cake> cakes = cakeRepository.findByNameContainingIgnoreCase(name);
        if(cakes.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No cakes found matching name: " + name);//404
        }
        return ResponseEntity.status(HttpStatus.OK).body(cakes);//200
    }
}
