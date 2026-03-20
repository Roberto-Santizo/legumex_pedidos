//COLUMN
export type Column<T> = {
    header: string;
    accessor?: keyof T;
    render?: (value: any, row: T) => React.ReactNode;
};

export type Option = {
    label: string;
    value: string | number;
};