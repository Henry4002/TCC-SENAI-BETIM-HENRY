package com.onemonth.backend.service;


import com.onemonth.backend.dto.UsuarioDTO;
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

    public void validarUsuario(Usuario usuario){

        if(usuario.getNome() == null || usuario.getNome().isBlank()){
            throw new ValidationException("Campo nome obrigatório!");
        }
        if(usuario.getSenha() == null || usuario.getSenha().isBlank()){
            throw new ValidationException("Campo senha obrigatório!");
        }
        if(usuario.getSenha() != null && usuario.getSenha().length() <4){
            throw new ValidationException("Senha muito curta!(Minimo 4 caracteres)");
        }
        if(usuario.getEmail() == null || usuario.getEmail().isBlank()){
            throw new ValidationException("Campo email obrigatório");
        }
        if(!usuario.getEmail().contains("@")){
            throw new ValidationException("Email inválido");
        }
        if(usuario.getPerfil() == null){
            throw new ValidationException("Perfil obrigatório!");
        }
    }

    private UsuarioDTO converterParaDTO(Usuario usuario){
        return new UsuarioDTO(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getPerfil().getNome()
        );
    }

    public Usuario cadastrarUsuario(Usuario usuario){
        validarUsuario(usuario);

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
        validarUsuario(usuario);

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
