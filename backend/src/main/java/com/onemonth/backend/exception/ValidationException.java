package com.onemonth.backend.exception;

public class ValidationException extends RuntimeException{

    public ValidationException (String mensagem){
        super(mensagem);
    }
}
