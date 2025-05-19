package com.swe212.controller.web;

import com.swe212.dto.AccountDto;
import com.swe212.dto.DepositDto;
import com.swe212.dto.DepositRequestDto;
import com.swe212.service.AccountManagementService;
import com.swe212.service.DepositService;
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
@RequiredArgsConstructor
@RequestMapping("/web/deposits")
public class WebDepositController {

    private final DepositService depositService;
    private final AccountManagementService accountManagementService;

    @GetMapping
    public String listDeposits(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "date") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            Model model) {
        try {
            Page<DepositDto> deposits = depositService.getAllDepositors(page, size, sortBy, sortDir);
            model.addAttribute("deposits", deposits);
            return "deposits/list";
        } catch (Exception e) {
            log.error("Error listing deposits: {}", e.getMessage());
            return "redirect:/web/dashboard";
        }
    }

    @GetMapping("/transfer")
    public String showTransferForm(Model model) {
        try {
            if (!model.containsAttribute("depositRequest")) {
                model.addAttribute("depositRequest", new DepositRequestDto());
            }

            Page<AccountDto> accountPage = accountManagementService.getAllAccounts(0, 100, "branch", "asc");
            model.addAttribute("accounts", accountPage.getContent());
            
            return "deposits/transfer";
        } catch (Exception e) {
            log.error("Error showing transfer form: {}", e.getMessage());
            return "redirect:/web/deposits";
        }
    }

    @PostMapping("/transfer")
    public String transfer(
            @Valid @ModelAttribute DepositRequestDto depositRequestDto,
            BindingResult bindingResult,
            Model model,
            RedirectAttributes redirectAttributes) {
        if (bindingResult.hasErrors()) {
            Page<AccountDto> accountPage = accountManagementService.getAllAccounts(0, 100, "branch", "asc");
            model.addAttribute("accounts", accountPage.getContent());
            return "deposits/transfer";
        }

        try {
            depositService.transfer(depositRequestDto);
            redirectAttributes.addFlashAttribute("message", "Transfer completed successfully");
            return "redirect:/web/deposits";
        } catch (Exception e) {
            log.error("Error processing transfer: {}", e.getMessage());
            redirectAttributes.addFlashAttribute("error", e.getMessage());
            return "redirect:/web/deposits/transfer";
        }
    }
}
