package com.swe212.controller.web;

import com.swe212.model.Customer;
import com.swe212.security.CustomerUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/web/dashboard")
@RequiredArgsConstructor
public class WebDashboardController {

    @GetMapping
    public String showDashboard(@AuthenticationPrincipal CustomerUserDetails userDetails, Model model) {
        Customer customer = userDetails.getCustomer();
        model.addAttribute("customer", customer);
        return "dashboard/index";
    }
}
