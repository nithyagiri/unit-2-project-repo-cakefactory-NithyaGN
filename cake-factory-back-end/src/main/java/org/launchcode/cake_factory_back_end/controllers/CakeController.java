package org.launchcode.cake_factory_back_end.controllers;

import org.launchcode.cake_factory_back_end.models.Cake;
import org.launchcode.cake_factory_back_end.repositories.CakeRepository;
import org.springframework.beans.factory.annotation.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cakes")
public class CakeController {
    @Autowired
    CakeRepository cakeRepository;
    // GET /api/cakes - get all cakes
    @GetMapping("")
    public List<Cake>getAllCakes() {
        return cakeRepository.findAll();
    }

    // GET /api/cakes/{id} - get one cake by ID
    @GetMapping("/{id}")
    public Cake getCakeById(@PathVariable Long id) {
       return cakeRepository.findById(id).orElse(null);
    }

    // GET /api/cakes/category/{category} - get cakes by category
    @GetMapping("/category/{category}")
    public List<Cake> getCakesByCategory(@PathVariable Cake.Category category) {
        return cakeRepository.findByCategory(category);
    }

    // GET /api/cakes/customizable - get all customizable cakes
    @GetMapping("/customizable")
    public List<Cake> getCustomizableCakes() {
        return cakeRepository.findByCustomizationTrue();
    }
}
