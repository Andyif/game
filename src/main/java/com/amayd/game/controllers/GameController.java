package com.amayd.game.controllers;

import com.amayd.game.services.GameService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.socket.WebSocketSession;

import java.util.List;
import java.util.Set;

@Controller
public class GameController {

    private GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @GetMapping(value = "/game")
    public String openGame() {
        return "battle";
    }

    @GetMapping(value = "/show_active")
    @ResponseBody
    private Set<String> showAllActiveSession() {
        return gameService.getSessions().keySet();
    }

}
