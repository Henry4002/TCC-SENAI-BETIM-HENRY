package com.onemonth.backend.service;


import com.onemonth.backend.dto.UsuarioDTO;
import com.onemonth.backend.exception.EmailJaCadastradoException;
import com.onemonth.backend.exception.ResourceNotFoundException;
import com.onemonth.backend.exception.ValidationException;
import com.onemonth.backend.model.Usuario;
import com.onemonth.backend.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    private final UsuarioRepository repository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }


    private UsuarioDTO converterParaDTO(Usuario usuario){
        return new UsuarioDTO(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getPerfil().getNome(),
                usuario.getAtualizadoEm() != null ? usuario.getAtualizadoEm().toString() : null
        );
    }

    private void validarEmailDuplicado(String email){
        if(repository.existsByEmail(email)){
            throw new EmailJaCadastradoException("E-mail já cadastrado no sistema!");
        }
    }

    public Usuario cadastrarUsuario(Usuario usuario){

        usuario.setEmail(usuario.getEmail().trim().toLowerCase());
        validarEmailDuplicado(usuario.getEmail());
        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));

        return repository.save(usuario);
    }

    public List<UsuarioDTO> listarUsuarios(){
        List<Usuario> usuarios = repository.findAll();

        List<UsuarioDTO> usuariosDTO = new ArrayList<>();

        for(Usuario usuario : usuarios){
            usuariosDTO.add(converterParaDTO(usuario));
        }

        return usuariosDTO;
    }

    public UsuarioDTO buscarPorId(Long id) {

        Usuario usuario = repository.findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("Usuário não encontrado!"));

        return converterParaDTO(usuario);
    }

    public Usuario atualizarUsuario (Usuario usuario){


        Usuario usuarioExistente = repository.findById(usuario.getId())
                .orElseThrow(()-> new ResourceNotFoundException("Usuário não encontrado!"));

        usuarioExistente.setNome(usuario.getNome());
        usuarioExistente.setEmail(usuario.getEmail());
        usuarioExistente.setSenha(passwordEncoder.encode(usuario.getSenha()));
        usuarioExistente.setPerfil(usuario.getPerfil());

        return repository.save(usuarioExistente);
    }

    public void deletarUsuario (Long id){

        Usuario usuario = repository.findById(id)
                        .orElseThrow(()-> new ResourceNotFoundException("Usuário não encontrado!"));

        repository.delete(usuario);

    }
}
