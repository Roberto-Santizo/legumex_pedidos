import type { Dc } from "@/features/dc/dc";
import type { Option } from "@/features/shared/shared";

export const dcOptions = (dcs: Dc[]): Option[] => {
    const options: Option[] = dcs.map((client) => {
        return {
            value: client.id,
            label: client.name
        }
    })

    return options;
}