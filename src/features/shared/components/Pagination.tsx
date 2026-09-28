import { TablePagination } from "@mui/material";
import type { SetURLSearchParams } from "react-router-dom";

interface PaginationProps {
    page: number;
    rowsPerPage: number;
    count: number;
    setSearchParams: SetURLSearchParams;
    bordered?: boolean;
}

const paginationSx = {
    fontFamily: 'inherit',
    color: 'var(--color-neutral-500)',
    '& .MuiTablePagination-toolbar': { minHeight: 52, paddingX: 2 },
    '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
        fontFamily: 'inherit',
        fontSize: 13,
    },
    '& .MuiTablePagination-select': { fontFamily: 'inherit', fontSize: 13 },
    '& .MuiTablePagination-input': {
        border: '1px solid var(--color-neutral-200)',
        borderRadius: '8px',
        paddingLeft: '4px',
    },
    '& .MuiIconButton-root': {
        borderRadius: '8px',
        color: 'var(--color-neutral-600)',
    },
    '& .MuiIconButton-root:hover': { backgroundColor: 'var(--color-neutral-100)' },
};

export function Pagination({ page, rowsPerPage, count, setSearchParams, bordered = false }: PaginationProps) {
    const handleChangePage = (_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setSearchParams((params) => {
            params.set('page', newPage.toString());
            return params;
        });
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const newLimit = parseInt(event.target.value, 10);
        setSearchParams((params) => {
            params.set('limit', newLimit.toString());
            params.set('page', '0');
            return params;
        });
    };

    return (
        <TablePagination
            labelRowsPerPage="Rows per page"
            labelDisplayedRows={function defaultLabelDisplayedRows({ from, to, count }) { return `${from}–${to} of ${count !== -1 ? count : `more than ${to}`}`; }}
            component="div"
            count={count}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            className={bordered ? 'card' : ''}
            sx={paginationSx}
        />
    )
}
