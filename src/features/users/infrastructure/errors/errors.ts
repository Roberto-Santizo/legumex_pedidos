import { DomainError } from "@/features/shared/shared";

export class NotFound extends DomainError {}
export class ConflictError extends DomainError {}