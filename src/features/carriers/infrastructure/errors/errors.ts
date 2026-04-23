// Created by Luis

export class CarrierNotFoundError extends Error {
    constructor(message = 'Carrier not found') {
        super(message);
        this.name = 'CarrierNotFoundError';
    }
}
