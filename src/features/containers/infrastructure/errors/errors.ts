// Created by Luis

export class ContainerNotFoundError extends Error {
    constructor(message = 'Container not found') {
        super(message);
        this.name = 'ContainerNotFoundError';
    }
}

export class ContainerConflictError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ContainerConflictError';
    }
}
