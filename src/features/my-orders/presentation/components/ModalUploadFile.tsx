import { BiCloudUpload, BiFile } from "react-icons/bi";
import { Modal, TextFormField, useNotification, type UploadFileForm } from "@/features/shared/shared";
import { ordersProvider } from "../providers/ordersRepositoryProvider";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ResultsTable } from "./ResultsTable";

export function ModalUploadFile() {
    const navigate = useNavigate();
    const notification = useNotification();
    const queryClient = useQueryClient();
    const [searchParams] = useSearchParams();
    const page = Number(searchParams.get("page")) || 0;
    const rowsPerPage = Number(searchParams.get("limit")) || 10;

    const show = searchParams.get("uploadFile") === "true";

    const handleCloseModal = () => {
        navigate(location.pathname, { replace: true });
    };

    const {
        handleSubmit,
        setValue,
        watch,
        setError,
        clearErrors,
        formState: { errors },
        reset,
        register
    } = useForm<UploadFileForm>();

    const file = watch("file");

    const { mutate, isPending, data } = useMutation({
        mutationFn: (payload: UploadFileForm) => ordersProvider.uploadFile(payload),
        onError: (err: any) => {
            notification.error(err?.message || "Error uploading file");
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['getMyOrders', rowsPerPage, page + 1] });
            reset();
        }
    });

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            const selected = acceptedFiles[0];

            if (!selected) return;

            if (selected.type !== "application/pdf") {
                setError("file", { message: "Only PDF files are allowed" });
                return;
            }

            clearErrors("file");
            setValue("file", selected, { shouldValidate: true });
        },
        [setValue, setError, clearErrors]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
        accept: { "application/pdf": [".pdf"] }
    });

    const onSubmit = (form: UploadFileForm) => {
        if (!form.file) {
            setError("file", { message: "File is required" });
            return;
        }

        mutate(form);
    };

    return (
        <Modal modal={show} closeModal={handleCloseModal} title="Upload File">
            <div className="flex flex-col gap-5">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                    <TextFormField<UploadFileForm>
                        label="Year"
                        name="year"
                        placeholder="Year of orders"
                        register={register}
                        type="number"
                        validation={{ required: 'The year is Required' }}
                        errorMessage={errors.year?.message}
                    />

                    <TextFormField<UploadFileForm>
                        label="Week"
                        name="week"
                        placeholder="Week of orders"
                        register={register}
                        type="number"
                        validation={{ required: 'The week is Required' }}
                        errorMessage={errors.week?.message}
                    />

                    <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200
                            ${isDragActive ? "border-brand-500 bg-brand-50" : "border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"}
                            ${errors.file ? "border-red-400 bg-red-50" : ""}
                            ${isPending ? "opacity-50 pointer-events-none" : ""}
                        `}
                    >
                        <input {...getInputProps()} />

                        {!file && (
                            <div className="flex flex-col items-center gap-2 text-neutral-500">
                                <div className="size-11 rounded-full bg-neutral-100 grid place-items-center text-neutral-500"><BiCloudUpload size={22} /></div>
                                <p className="text-sm font-medium text-ink">
                                    Drag & drop your PDF here
                                </p>
                                <p className="text-xs">
                                    or click to select a file
                                </p>
                            </div>
                        )}

                        {file && (
                            <div className="text-neutral-700 text-sm flex flex-col items-center gap-2">
                                <div className="size-11 rounded-full bg-brand-50 grid place-items-center text-brand-600"><BiFile size={22} /></div>
                                <p className="font-medium">{file.name}</p>
                                <p className="text-xs text-neutral-500">
                                    {(file.size / 1024).toFixed(2)} KB
                                </p>
                            </div>
                        )}
                    </div>

                    {errors.file && (
                        <p className="form_error">
                            {errors.file.message}
                        </p>
                    )}

                    {isPending && (
                        <div className="flex flex-col items-center justify-center gap-3 py-4">
                            <div className="w-10 h-10 border-[3px] border-neutral-200 border-t-brand-500 rounded-full animate-spin"></div>
                            <div className="text-center space-y-1">
                                <p className="text-sm font-semibold text-ink">
                                    Analyzing your document
                                </p>
                                <p className="text-xs text-neutral-500">
                                    This may take a few seconds...
                                </p>
                            </div>
                        </div>
                    )}

                    {!isPending && (
                        <button
                            type="submit"
                            className="btn btn_primary w-full"
                        >
                            Upload File
                        </button>
                    )}
                </form>

                {data && (
                    <ResultsTable data={data} />
                )}
            </div>
        </Modal>
    );
}