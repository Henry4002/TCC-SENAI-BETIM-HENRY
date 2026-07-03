package com.onemonth.backend.controller;


import com.onemonth.backend.dto.LoginRequestDTO;
import com.onemonth.backend.dto.LoginResponseDTO;
import com.onemonth.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody @Valid LoginRequestDTO loginRequest){

        LoginResponseDTO resposta = authService.login(loginRequest);

        return ResponseEntity.ok(resposta);
    }
}
