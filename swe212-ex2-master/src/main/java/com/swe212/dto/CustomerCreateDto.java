package com.swe212.dto;

import com.swe212.model.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CustomerCreateDto {
    @NotBlank(message = "Name is mandatory")
    @Size(min = 5, message = "Name must be at least 5 characters long")
    private String name;

    @NotBlank(message = "Address is mandatory")
    @Size(min = 10, message = "Address must be at least 10 characters long")
    private String address;

    @NotBlank(message = "City is mandatory")
    private String city;

    @NotBlank(message = "Password is mandatory")
    @Size(min = 8, message = "Password must be at least 8 characters long")
    private String password;

    private String profilePhotoUrl;

    @NotNull(message = "Role is mandatory")
    private Role role = Role.USER;
}