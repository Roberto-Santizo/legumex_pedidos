import type { Client } from "@/features/clients/clients";
import type { Option } from "@/features/shared/shared";

export const clientOptions = (clients: Client[]): Option[] => {
    const options: Option[] = clients.map((client) => {
        return {
            value: client.id,
            label: client.name
        }
    })

    return options;
}