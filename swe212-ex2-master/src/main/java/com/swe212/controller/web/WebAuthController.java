package com.swe212.controller.web;

import org.springframework.stereotype.Controller;
import lombok.RequiredArgsConstructor;
import com.swe212.dto.CustomerCreateDto;
import com.swe212.service.CustomerManagementService;
import com.swe212.service.FileStorageService;
import com.swe212.model.Role;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import jakarta.validation.Valid;
import org.springframework.validation.BindingResult;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/web/auth")
@RequiredArgsConstructor
public class WebAuthController {

    private final CustomerManagementService customerService;
    private final FileStorageService fileStorageService;

    @GetMapping("/login")
    public String loginPage(@RequestParam(required = false) String error,
                            @RequestParam(required = false) String logout,
                            Model model) {
        if (error != null) {
            model.addAttribute("error", "Invalid username or password");
        }
        if (logout != null) {
            model.addAttribute("message", "You have been logged out successfully");
        }
        return "auth/login";
    }

    @GetMapping("/register")
    public String showRegisterForm(Model model) {
        if (!model.containsAttribute("customer")) {
            model.addAttribute("customer", new CustomerCreateDto());
        }
        return "auth/register";
    }

    @PostMapping("/register")
    public String registerUser(
            @Valid @ModelAttribute("customer") CustomerCreateDto customerCreateDto,
            BindingResult bindingResult,
            @RequestParam(required = false) MultipartFile profilePhoto,
            RedirectAttributes redirectAttributes,
            Model model) {

        // valid kısmında bir hata varsa burda(binding result) toplanır ve kullanıcıya gösterilir.
        if (bindingResult.hasErrors()) {
            model.addAttribute("customer", customerCreateDto);
            return "auth/register";
        }
        try {
            if (profilePhoto != null && !profilePhoto.isEmpty()) {
                String photoUrl = fileStorageService.storeFile(profilePhoto);
                customerCreateDto.setProfilePhotoUrl(photoUrl);
            }

            customerCreateDto.setRole(Role.USER);
            customerService.createCustomer(customerCreateDto);
            redirectAttributes.addFlashAttribute("message", "Registration successful! Please log in.");
            return "redirect:/web/auth/login";
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Registration failed: " + e.getMessage());
            redirectAttributes.addFlashAttribute("customer", customerCreateDto);
            return "redirect:/web/auth/register";
        }
    }
}
