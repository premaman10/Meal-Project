package com.example.backend.service;

import com.example.backend.dto.*;
import com.example.backend.entity.*;
import com.example.backend.repository.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class MealService {
    
    private final WebClient webClient;
    private final MealRepository mealRepository;
    private final CategoryRepository categoryRepository;
    private final AreaRepository areaRepository;
    private final IngredientRepository ingredientRepository;
    private final MealIngredientRepository mealIngredientRepository;

    @Value("${nutrition.api.url:https://api.api-ninjas.com/v1/nutrition}")
    private String nutritionApiUrl;
    
    @Value("${nutrition.api.key:}")
    private String nutritionApiKey;
    
    public MealService(WebClient.Builder webClientBuilder,
                       MealRepository mealRepository,
                       CategoryRepository categoryRepository,
                       AreaRepository areaRepository,
                       IngredientRepository ingredientRepository,
                       MealIngredientRepository mealIngredientRepository) {
        this.webClient = webClientBuilder.build();
        this.mealRepository = mealRepository;
        this.categoryRepository = categoryRepository;
        this.areaRepository = areaRepository;
        this.ingredientRepository = ingredientRepository;
        this.mealIngredientRepository = mealIngredientRepository;
    }
    
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> searchMeals(String query) {
        String url = "https://www.themealdb.com/api/json/v1/1/search.php?s=" + query;
        
        Map<String, Object> response = webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(Map.class)
                .block();
        
        if (response != null && response.containsKey("meals")) {
            Object meals = response.get("meals");
            if (meals instanceof List) {
                return (List<Map<String, Object>>) meals;
            }
        }
        return new ArrayList<>();
    }
    
    @SuppressWarnings("unchecked")
    public Map<String, Object> getMealById(String id) {
        String url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id;
        
        Map<String, Object> response = webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(Map.class)
                .block();
        
        if (response != null && response.containsKey("meals")) {
            List<Map<String, Object>> meals = (List<Map<String, Object>>) response.get("meals");
            if (meals != null && !meals.isEmpty()) {
                return meals.get(0);
            }
        }
        return null;
    }
    
    public CalorieResponse calculateCalories(String mealId) {
        Map<String, Object> meal = getMealById(mealId);
        
        if (meal == null) {
            throw new RuntimeException("Meal not found with id: " + mealId);
        }
        
        String mealName = (String) meal.get("strMeal");
        List<IngredientCalorie> ingredients = new ArrayList<>();
        double totalCalories = 0;
        
        // Extract ingredients and measures (TheMealDB has up to 20 ingredients)
        for (int i = 1; i <= 20; i++) {
            String ingredient = (String) meal.get("strIngredient" + i);
            String measure = (String) meal.get("strMeasure" + i);
            
            if (ingredient != null && !ingredient.trim().isEmpty()) {
                double calories = getCaloriesFromNutritionAPI(ingredient, measure);
                ingredients.add(new IngredientCalorie(ingredient, measure != null ? measure : "", calories));
                totalCalories += calories;
            }
        }
        
        return new CalorieResponse(mealId, mealName, ingredients, Math.round(totalCalories * 100.0) / 100.0);
    }
    
    @SuppressWarnings("unchecked")
    private double getCaloriesFromNutritionAPI(String ingredient, String measure) {
        try {
            String query = ingredient;
            if (measure != null && !measure.trim().isEmpty()) {
                query = measure + " " + ingredient;
            }
            
            List<Map<String, Object>> nutritionData = webClient.get()
                    .uri(nutritionApiUrl + "?query=" + query)
                    .header("X-Api-Key", nutritionApiKey)
                    .retrieve()
                    .bodyToMono(List.class)
                    .block();
            
            if (nutritionData != null && !nutritionData.isEmpty()) {
                Object caloriesObj = nutritionData.get(0).get("calories");
                if (caloriesObj instanceof Number) {
                    return ((Number) caloriesObj).doubleValue();
                }
            }
        } catch (Exception e) {
            System.err.println("Error fetching calories for " + ingredient + ": " + e.getMessage());
        }
        
        // Return default if API fails
        return 0.0;
    }
    
    public Map<String, Object> findLeastIngredientsMeal(String query) {
        List<Map<String, Object>> meals = searchMeals(query);
        
        if (meals.isEmpty()) {
            return null;
        }
        
        Map<String, Object> leastIngredientMeal = meals.get(0);
        int minIngredients = countIngredients(leastIngredientMeal);
        
        for (Map<String, Object> meal : meals) {
            int count = countIngredients(meal);
            if (count < minIngredients) {
                minIngredients = count;
                leastIngredientMeal = meal;
            }
        }
        
        return leastIngredientMeal;
    }
    
    private int countIngredients(Map<String, Object> meal) {
        int count = 0;
        for (int i = 1; i <= 20; i++) {
            String ingredient = (String) meal.get("strIngredient" + i);
            if (ingredient != null && !ingredient.trim().isEmpty()) {
                count++;
            }
        }
        return count;
    }

    // Methods for MealController

    public List<String> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(Category::getName)
                .collect(Collectors.toList());
    }

    public List<String> getAllAreas() {
        return areaRepository.findAll().stream()
                .map(Area::getName)
                .collect(Collectors.toList());
    }

    public List<String> getAllIngredients() {
        return ingredientRepository.findAll().stream()
                .map(Ingredient::getName)
                .collect(Collectors.toList());
    }

    public List<MealCardDTO> searchMealsByName(String name) {
        List<Meal> meals = mealRepository.findByNameContainingIgnoreCase(name);
        return meals.stream()
                .map(this::convertToMealCardDTO)
                .collect(Collectors.toList());
    }

    public List<MealCardDTO> getAllMealsForCards() {
        List<Meal> meals = mealRepository.findAll();
        return meals.stream()
                .map(this::convertToMealCardDTO)
                .collect(Collectors.toList());
    }

    public List<MealCardDTO> getMealsByCategory(String categoryName) {
        Category category = categoryRepository.findByName(categoryName).orElse(null);
        if (category == null) {
            return new ArrayList<>();
        }
        List<Meal> meals = mealRepository.findByCategoryId(category.getId());
        return meals.stream()
                .map(this::convertToMealCardDTO)
                .collect(Collectors.toList());
    }

    public List<MealCardDTO> getMealsByIngredient(String ingredientName) {
        Ingredient ingredient = ingredientRepository.findByName(ingredientName).orElse(null);
        if (ingredient == null) {
            return new ArrayList<>();
        }

        List<MealIngredient> mealIngredients = mealIngredientRepository.findByIngredientId(ingredient.getId());
        return mealIngredients.stream()
                .map(mi -> convertToMealCardDTO(mi.getMeal()))
                .distinct()
                .collect(Collectors.toList());
    }

    public MealDetailDTO getMealDetails(Long id) {
        Meal meal = mealRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Meal not found with id: " + id));
        return convertToMealDetailDTO(meal);
    }

    public MealDetailDTO createUserMeal(CreateMealRequest request) {
        // Create or get category
        Category category = null;
        if (request.getCategoryName() != null && !request.getCategoryName().trim().isEmpty()) {
            category = categoryRepository.findByName(request.getCategoryName())
                    .orElseGet(() -> {
                        Category newCategory = new Category();
                        newCategory.setName(request.getCategoryName());
                        return categoryRepository.save(newCategory);
                    });
        }

        // Create or get area
        Area area = null;
        if (request.getAreaName() != null && !request.getAreaName().trim().isEmpty()) {
            area = areaRepository.findByName(request.getAreaName())
                    .orElseGet(() -> {
                        Area newArea = new Area();
                        newArea.setName(request.getAreaName());
                        return areaRepository.save(newArea);
                    });
        }

        // Create meal
        Meal meal = new Meal();
        meal.setName(request.getName());
        meal.setCategory(category);
        meal.setArea(area);
        meal.setInstructions(request.getInstructions());
        meal.setThumbnailUrl(request.getThumbnailUrl());
        meal.setYoutubeUrl(request.getYoutubeUrl());
        meal.setTags(request.getTags());
        meal.setIsExternal(false);

        Meal savedMeal = mealRepository.save(meal);

        // Create meal ingredients
        for (CreateMealRequest.IngredientRequest ingredientRequest : request.getIngredients()) {
            Ingredient ingredient = ingredientRepository.findByName(ingredientRequest.getName())
                    .orElseGet(() -> {
                        Ingredient newIngredient = new Ingredient();
                        newIngredient.setName(ingredientRequest.getName());
                        return ingredientRepository.save(newIngredient);
                    });

            MealIngredient mealIngredient = new MealIngredient();
            mealIngredient.setMeal(savedMeal);
            mealIngredient.setIngredient(ingredient);
            mealIngredient.setMeasure(ingredientRequest.getMeasure());
            mealIngredientRepository.save(mealIngredient);
        }

        // Reload meal to get all relationships
        Meal reloadedMeal = mealRepository.findById(savedMeal.getId())
                .orElseThrow(() -> new RuntimeException("Failed to reload meal"));

        return convertToMealDetailDTO(reloadedMeal);
    }

    // Helper methods to convert entities to DTOs

    private MealCardDTO convertToMealCardDTO(Meal meal) {
        MealCardDTO dto = new MealCardDTO();
        dto.setId(meal.getId());
        dto.setExternalId(meal.getExternalId());
        dto.setName(meal.getName());
        dto.setCategoryName(meal.getCategory() != null ? meal.getCategory().getName() : null);
        dto.setAreaName(meal.getArea() != null ? meal.getArea().getName() : null);
        dto.setThumbnailUrl(meal.getThumbnailUrl());
        dto.setIsExternal(meal.getIsExternal());
        return dto;
    }

    private MealDetailDTO convertToMealDetailDTO(Meal meal) {
        MealDetailDTO dto = new MealDetailDTO();
        dto.setId(meal.getId());
        dto.setExternalId(meal.getExternalId());
        dto.setName(meal.getName());
        dto.setCategoryName(meal.getCategory() != null ? meal.getCategory().getName() : null);
        dto.setAreaName(meal.getArea() != null ? meal.getArea().getName() : null);
        dto.setInstructions(meal.getInstructions());
        dto.setThumbnailUrl(meal.getThumbnailUrl());
        dto.setYoutubeUrl(meal.getYoutubeUrl());
        dto.setTags(meal.getTags());
        dto.setIsExternal(meal.getIsExternal());

        // Convert meal ingredients
        List<MealIngredientDTO> ingredients = meal.getMealIngredients().stream()
                .map(mi -> {
                    MealIngredientDTO ingredientDTO = new MealIngredientDTO();
                    ingredientDTO.setName(mi.getIngredient().getName());
                    ingredientDTO.setMeasure(mi.getMeasure());
                    return ingredientDTO;
                })
                .collect(Collectors.toList());
        dto.setIngredients(ingredients);

        return dto;
    }
}
