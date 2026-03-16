package org.launchcode.cake_factory_back_end.service;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.launchcode.cake_factory_back_end.models.Cake;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class PriceService {

    private final ObjectMapper objectMapper = new ObjectMapper();

    public double calculateTotalItemPrice(Cake cake, String selectedSize, String selectedFilling, int quantity) {
        double basePrice = cake.getPrice(); // base price

        // Finding extra costs from JSON fields
        double sizeExtra = findAddPrice(cake.getSizes(), selectedSize);
        double fillingExtra = findAddPrice(cake.getFillings(), selectedFilling);

        // Final calculation: (Base + Extras) * Qty
        return (basePrice + sizeExtra + fillingExtra) * quantity;
    }

    private double findAddPrice(String jsonArray, String targetLabel) {
        if (jsonArray == null || jsonArray.isEmpty() || targetLabel == null) {
            return 0.0;
        }

        try {
            // Converting JSON string to List of Maps
            List<Map<String, Object>> options = objectMapper.readValue(
                    jsonArray, new TypeReference<List<Map<String, Object>>>() {}
            );

            return options.stream()
                    .filter(opt -> targetLabel.equals(opt.get("label")))
                    .map(opt -> Double.parseDouble(opt.get("addPrice").toString()))
                    .findFirst()
                    .orElse(0.0);

        } catch (Exception e) {
            // Log the error
            return 0.0;
        }
    }
}


