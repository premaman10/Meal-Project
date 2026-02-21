package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MealCardDTO {
    private Long id;
    private Integer externalId;
    private String name;
    private String categoryName;
    private String areaName;
    private String thumbnailUrl;
    private Boolean isExternal;
}
