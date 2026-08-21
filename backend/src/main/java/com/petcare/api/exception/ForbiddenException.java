package com.petcare.api.exception;

public class ForbiddenException extends RuntimeException {

    public ForbiddenException(String message) {
        super(message);
    }

    public ForbiddenException() {
        super("Acesso negado a este recurso");
    }
}
