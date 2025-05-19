package com.swe212.controller.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebHomeController {

    @GetMapping("/")
    public String home() {
        return "home";
    }

    @GetMapping("/web/access-denied")
    public String accessDenied() {
        return "access-denied";
    }
}
