package com.amayd.game.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SimpleResrController {

    @GetMapping("/hello")
    public String hello() {
        return "hi";
    }
}
