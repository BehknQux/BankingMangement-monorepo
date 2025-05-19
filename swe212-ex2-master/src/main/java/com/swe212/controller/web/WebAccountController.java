package com.swe212.controller.web;

import com.swe212.dto.AccountCreateDto;
import com.swe212.dto.AccountDto;
import com.swe212.dto.AccountUpdateDto;
import com.swe212.dto.CustomerDto;
import com.swe212.service.AccountManagementService;
import com.swe212.service.CustomerManagementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Slf4j
@Controller
@RequestMapping("/web/accounts")
@RequiredArgsConstructor
public class WebAccountController {

    private final AccountManagementService accountManagementService;
    private final CustomerManagementService customerManagementService;

    @GetMapping
    public String listAccounts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            Model model) {

        Page<AccountDto> accountPage = accountManagementService.getAllAccounts(page, size, sortBy, sortDir);
        model.addAttribute("accounts", accountPage);
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", accountPage.getTotalPages());
        model.addAttribute("sortBy", sortBy);
        model.addAttribute("sortDir", sortDir);
        model.addAttribute("reverseSortDir", sortDir.equals("asc") ? "desc" : "asc");

        return "account/list";
    }

    @GetMapping("/create")
    public String showCreateForm(Model model) {
        if (!model.containsAttribute("accountCreateDto")) {
            model.addAttribute("accountCreateDto", new AccountCreateDto());
        }

        Page<CustomerDto> customerPage = customerManagementService.getAllCustomers(0, 100, "name", "asc");
        model.addAttribute("customers", customerPage.getContent());
        
        return "account/create";
    }

    @PostMapping("/create")
    public String createAccount(
            @Valid @ModelAttribute AccountCreateDto accountCreateDto,
            BindingResult bindingResult,
            Model model,
            RedirectAttributes redirectAttributes) {
            
        if (bindingResult.hasErrors()) {
            log.error("Validation errors: {}", bindingResult.getAllErrors());
            // Get customers for dropdown if validation fails
            Page<CustomerDto> customerPage = customerManagementService.getAllCustomers(0, 100, "name", "asc");
            model.addAttribute("customers", customerPage.getContent());
            return "account/create";
        }

        try {
            AccountDto createdAccount = accountManagementService.createAccount(accountCreateDto);
            redirectAttributes.addFlashAttribute("message", "Account created successfully");
            return "redirect:/web/accounts";
        } catch (Exception e) {
            log.error("Error creating account: {}", e.getMessage(), e);
            redirectAttributes.addFlashAttribute("error", e.getMessage());
            // Get customers for dropdown if error occurs
            Page<CustomerDto> customerPage = customerManagementService.getAllCustomers(0, 100, "name", "asc");
            model.addAttribute("customers", customerPage.getContent());
            return "account/create";
        }
    }

    @GetMapping("/{id}/edit")
    public String showEditForm(@PathVariable Long id, Model model) {
        AccountDto account = accountManagementService.getAccountById(id);
        model.addAttribute("account", account);
        return "account/edit";
    }

    @PostMapping("/{id}/edit")
    public String updateAccount(@PathVariable Long id, @Valid @ModelAttribute AccountUpdateDto accountUpdateDto, BindingResult bindingResult, RedirectAttributes redirectAttributes) {
        if (bindingResult.hasErrors()) {
            log.error("Validation errors: {}", bindingResult.getAllErrors());
            redirectAttributes.addFlashAttribute("org.springframework.validation.BindingResult.account", bindingResult);
            redirectAttributes.addFlashAttribute("account", accountUpdateDto);
            redirectAttributes.addFlashAttribute("error", "Please fix the validation errors");
            return "redirect:/web/accounts/" + id + "/edit";
        }

        try {
            accountManagementService.updateAccount(id, accountUpdateDto);
            redirectAttributes.addFlashAttribute("message", "Account updated successfully");
            return "redirect:/web/accounts";
        } catch (Exception e) {
            log.error("Error updating account: {}", e.getMessage(), e);
            redirectAttributes.addFlashAttribute("error", e.getMessage());
            redirectAttributes.addFlashAttribute("account", accountUpdateDto);
            return "redirect:/web/accounts/" + id + "/edit";
        }
    }

    @GetMapping("/{id}/link")
    public String showLinkForm(@PathVariable Long id, Model model) {
        try {
            AccountDto account = accountManagementService.getAccountById(id);
            Page<CustomerDto> availableCustomers = customerManagementService.getAllCustomers(0, 100, "name", "asc");
            
            model.addAttribute("accountId", id);
            model.addAttribute("account", account);
            model.addAttribute("availableCustomers", availableCustomers.getContent());
            return "account/link";
        } catch (Exception e) {
            log.error("Error showing link form: {}", e.getMessage());
            return "redirect:/web/accounts";
        }
    }

    @PostMapping("/{accountId}/link")
    public String linkCustomer(
            @PathVariable Long accountId,
            @RequestParam Long customerId,
            RedirectAttributes redirectAttributes) {
        try {
            accountManagementService.linkAccountToCustomer(accountId, customerId);
            redirectAttributes.addFlashAttribute("message", "Customer linked successfully");
            return "redirect:/web/accounts/" + accountId + "/link";
        } catch (Exception e) {
            log.error("Error linking customer: {}", e.getMessage());
            redirectAttributes.addFlashAttribute("error", e.getMessage());
            return "redirect:/web/accounts/" + accountId + "/link";
        }
    }

    @PostMapping("/{accountId}/unlink/{customerId}")
    public String unlinkCustomer(
            @PathVariable Long accountId,
            @PathVariable Long customerId,
            RedirectAttributes redirectAttributes) {
        try {
            accountManagementService.unlinkAccountFromCustomer(accountId, customerId);
            redirectAttributes.addFlashAttribute("message", "Customer unlinked successfully");
            return "redirect:/web/accounts/" + accountId + "/link";
        } catch (Exception e) {
            log.error("Error unlinking customer: {}", e.getMessage());
            redirectAttributes.addFlashAttribute("error", e.getMessage());
            return "redirect:/web/accounts/" + accountId + "/link";
        }
    }

    @PostMapping("/{id}/delete")
    public String deleteAccount(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        try {
            accountManagementService.deleteAccount(id);
            redirectAttributes.addFlashAttribute("message", "Account deleted successfully");
            return "redirect:/web/accounts";
        } catch (Exception e) {
            log.error("Error deleting account: {}", e.getMessage());
            redirectAttributes.addFlashAttribute("error", e.getMessage());
            return "redirect:/web/accounts";
        }
    }
}
