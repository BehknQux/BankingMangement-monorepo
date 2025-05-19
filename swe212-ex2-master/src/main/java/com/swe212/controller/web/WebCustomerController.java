package com.swe212.controller.web;

import com.swe212.dto.CustomerCreateDto;
import com.swe212.dto.CustomerDto;
import com.swe212.dto.CustomerUpdateDto;
import com.swe212.security.CustomerUserDetails;
import com.swe212.service.CustomerManagementService;
import com.swe212.service.FileStorageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Slf4j
@Controller
@RequestMapping("/web/customers")
@RequiredArgsConstructor
public class WebCustomerController {

    private final CustomerManagementService customerService;
    private final FileStorageService fileStorageService;

    @GetMapping
    public String listCustomers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            Model model) {
        Page<CustomerDto> customers = customerService.getAllCustomers(page, size, sortBy, sortDir);
        model.addAttribute("customers", customers);
        return "customers/list";
    }

    @GetMapping("/create")
    public String showCreateForm(Model model) {
        if (!model.containsAttribute("customer")) {
            model.addAttribute("customer", new CustomerCreateDto());
        }
        return "customers/create";
    }

    @PostMapping("/create")
    public String createCustomer(
            @Valid @ModelAttribute("customer") CustomerCreateDto customerCreateDto,
            BindingResult bindingResult,
            @RequestParam(required = false) MultipartFile profilePhoto,
            Model model,
            RedirectAttributes redirectAttributes) {
            
        if (bindingResult.hasErrors()) {
            log.error("Validation errors: {}", bindingResult.getAllErrors());
            return "customers/create";
        }

        try {
            if (profilePhoto != null && !profilePhoto.isEmpty()) {
                String photoUrl = fileStorageService.storeFile(profilePhoto);
                customerCreateDto.setProfilePhotoUrl(photoUrl);
            }
            
            CustomerDto createdCustomer = customerService.createCustomer(customerCreateDto);
            redirectAttributes.addFlashAttribute("message", "Customer created successfully");
            return "redirect:/web/customers";
        } catch (Exception e) {
            log.error("Error creating customer: {}", e.getMessage(), e);
            redirectAttributes.addFlashAttribute("error", e.getMessage());
            return "customers/create";
        }
    }

    @GetMapping("/{id}/edit")
    public String showEditForm(@PathVariable Long id, Model model) {
        if (!model.containsAttribute("customer")) {
            CustomerDto customerDto = customerService.getCustomerById(id);
            model.addAttribute("customer", customerDto);
        }
        return "customers/edit";
    }

    @PostMapping("/{id}/edit")
    public String updateCustomer(
            @PathVariable Long id,
            @Valid @ModelAttribute("customer") CustomerUpdateDto customerUpdateDto,
            BindingResult bindingResult,
            @RequestParam(required = false) MultipartFile profilePhoto,
            Model model,
            @AuthenticationPrincipal CustomerUserDetails userDetails,
            RedirectAttributes redirectAttributes) {
            
        if (bindingResult.hasErrors()) {
            log.error("Validation errors: {}", bindingResult.getAllErrors());
            return "customers/edit";
        }

        try {
            if (profilePhoto != null && !profilePhoto.isEmpty()) {
                String photoUrl = fileStorageService.storeFile(profilePhoto);
                customerUpdateDto.setProfilePhotoUrl(photoUrl);
            }
            
            CustomerDto updatedCustomer = customerService.updateCustomer(id, customerUpdateDto);
            redirectAttributes.addFlashAttribute("message", "Customer updated successfully");
            if (id.equals(userDetails.getCustomer().getId())) {
                SecurityContextHolder.clearContext();
                return "redirect:/web/auth/login?logout=true";
            }
            return "redirect:/web/customers";
        } catch (Exception e) {
            log.error("Error updating customer: {}", e.getMessage(), e);
            redirectAttributes.addFlashAttribute("error", e.getMessage());
            return "customers/edit";
        }
    }

    @GetMapping("/{id}/delete")
    public String deleteCustomer(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        try {
            customerService.deleteCustomer(id);
            redirectAttributes.addFlashAttribute("message", "Customer deleted successfully");
        } catch (Exception e) {
            log.error("Error deleting customer: {}", e.getMessage(), e);
            redirectAttributes.addFlashAttribute("error", e.getMessage());
        }
        return "redirect:/web/customers";
    }
}
