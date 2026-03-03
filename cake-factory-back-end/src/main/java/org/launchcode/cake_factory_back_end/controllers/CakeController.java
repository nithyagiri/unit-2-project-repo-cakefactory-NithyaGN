package org.launchcode.cake_factory_back_end.controllers;

import org.launchcode.cake_factory_back_end.models.Cake;
import org.launchcode.cake_factory_back_end.repositories.CakeRepository;
import org.springframework.beans.factory.annotation.*;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.util.List;

@RestController
@RequestMapping("/api/cakes")
@CrossOrigin(origins = "http://localhost:5173")
public class CakeController {
    @Autowired
    private CakeRepository cakeRepository;

    // GET /api/cakes - get all cakes
    @GetMapping("")
    public ResponseEntity<?> getAllCakes() throws NoResourceFoundException {
        List<Cake> allCakes = cakeRepository.findAll();
        if (allCakes.isEmpty()) {
            String path = "/api/cakes";
            throw new NoResourceFoundException(HttpMethod.GET, path, "Cakes not found"); // 404
        } else {
            return new ResponseEntity<>(allCakes, HttpStatus.OK); // 200
        }
    }

    // GET /api/cakes/search?name= - search cakes by name
    @GetMapping("/search")
    public ResponseEntity<?> searchCakesByName(@RequestParam String name)
            throws NoResourceFoundException {
        List<Cake> cakes = cakeRepository.findByNameContainingIgnoreCase(name);
        if (cakes.isEmpty()) {
            String path = "/api/cakes/search?name=" + name;
            throw new NoResourceFoundException(HttpMethod.GET, path, name); // 404
        }
        {
            return new ResponseEntity<>(cakes, HttpStatus.OK); // 200
        }
    }

    // GET /api/cakes/category/{category} - get cakes by category
    @GetMapping("/category/{category}")
    public ResponseEntity<?> getCakesByCategory(@PathVariable Cake.Category category)
            throws NoResourceFoundException {
        List<Cake> cakes = cakeRepository.findByCategory(category);
        if (cakes.isEmpty()) {
            String path = "/api/cakes/category/" + category;
            throw new NoResourceFoundException(HttpMethod.GET, path, "Mentioned category not found"); // 404
        }else {
            return new ResponseEntity<>(cakes, HttpStatus.OK); // 200
        }
    }

    // GET /api/cakes/customizable - get all customizable cakes
    @GetMapping("/customizable")
    public ResponseEntity<?> getCustomizableCakes() throws NoResourceFoundException {
        List<Cake> cakes = cakeRepository.findByCustomizationTrue();
        if (cakes.isEmpty()) {
            String path = "/api/cakes/customizable";
            throw new NoResourceFoundException(HttpMethod.GET, path, "No customizable cakes available"); // 404
        } else {
            return new ResponseEntity<>(cakes, HttpStatus.OK); // 200
        }
    }

    // GET /api/cakes/{id} - get one cake by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getCakeById(@PathVariable Long id)
            throws NoResourceFoundException {
        Cake cake = cakeRepository.findById(id).orElse(null);
        if (cake == null) {
            String path = "/api/cakes/" + id;
            throw new NoResourceFoundException(HttpMethod.GET, path, "Cake is not found"); // 404
        } else {
            return new ResponseEntity<>(cake, HttpStatus.OK); // 200
        }
    }
}
