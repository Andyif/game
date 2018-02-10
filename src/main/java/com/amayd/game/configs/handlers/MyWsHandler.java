package com.amayd.game.configs.handlers;

import com.amayd.game.services.GameService;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.Map;

@Component
public class MyWsHandler extends TextWebSocketHandler {

    private GameService gameService;

    public MyWsHandler(GameService gameService) {
        this.gameService = gameService;
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        for (Map.Entry<String, WebSocketSession> openedSession : gameService.getSessions().entrySet()) {
            if (!openedSession.getKey().equals(session.getId())) {
                openedSession.getValue().sendMessage(message);
            }
        }
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        gameService.addSession(session);
        System.out.println(gameService.getSessions().size());
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        gameService.removeSession(session);
    }
}
