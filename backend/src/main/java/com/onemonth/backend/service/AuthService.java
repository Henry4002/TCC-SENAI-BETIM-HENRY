package com.onemonth.backend.service;


import com.onemonth.backend.dto.LoginRequestDTO;
import com.onemonth.backend.dto.LoginResponseDTO;
import com.onemonth.backend.exception.CredenciaisInvalidasException;
import com.onemonth.backend.model.Usuario;
import com.onemonth.backend.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }


    public LoginResponseDTO login(LoginRequestDTO loginRequest){

        Usuario usuario = usuarioRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(()-> new CredenciaisInvalidasException("E-mail ou senha inválidos!"));

        if(!passwordEncoder.matches(loginRequest.getSenha(), usuario.getSenha())){
            throw new CredenciaisInvalidasException("E-mail ou senha inválidos!");
        }

        return new LoginResponseDTO(
                usuario.getId(),
                "Login realizado com sucesso!",
                usuario.getNome(),
                usuario.getPerfil().getNome(),
                usuario.getAtualizadoEm() != null ? usuario.getAtualizadoEm().toString() : null
        );
    }

}
