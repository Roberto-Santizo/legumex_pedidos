import { DomainError } from "@/features/shared/domain/errors/errors";

export class NotFoundError extends DomainError {}
export class ConflictError extends DomainError {}