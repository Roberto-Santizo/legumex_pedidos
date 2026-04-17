import { Modal, useNotification, type UploadFileForm } from "@/features/shared/shared";
import { ordersProvider } from "../providers/ordersRepositoryProvider";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";

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
        formState: { errors }
    } = useForm<UploadFileForm>();

    const file = watch("file");

    const { mutate, isPending } = useMutation({
        mutationFn: (file: File) => ordersProvider.uploadFile(file),
        onError: (err: any) => {
            notification.error(err?.message || "Error uploading file");
        },
        onSuccess: (message) => {
            notification.success(message);
            queryClient.invalidateQueries({ queryKey: ['getMyOrders', rowsPerPage, page + 1] });
            handleCloseModal();
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

        mutate(form.file);
    };

    return (
        <Modal modal={show} closeModal={handleCloseModal} title="Upload File">
            <div className="p-8 space-y-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200
                ${isDragActive ? "border-blue-500 bg-blue-50 scale-[1.02]" : "border-gray-300"}
                ${errors.file ? "border-red-400 bg-red-50" : ""}
                ${isPending ? "opacity-50 pointer-events-none" : ""}
                `}
                    >
                        <input {...getInputProps()} />

                        {!file && (
                            <div className="text-gray-500 space-y-2">
                                <p className="text-sm font-medium">
                                    Drag & drop your PDF here
                                </p>
                                <p className="text-xs">
                                    or click to select a file
                                </p>
                            </div>
                        )}

                        {file && (
                            <div className="text-gray-700 text-sm flex flex-col items-center gap-2">
                                <span className="text-3xl">📄</span>
                                <p className="font-medium">{file.name}</p>
                                <p className="text-xs text-gray-500">
                                    {(file.size / 1024).toFixed(2)} KB
                                </p>
                            </div>
                        )}
                    </div>

                    {errors.file && (
                        <p className="text-red-500 text-xs">
                            {errors.file.message}
                        </p>
                    )}

                    {isPending && (
                        <div className="flex flex-col items-center justify-center gap-3 py-4">
                            <div className="w-10 h-10 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin"></div>
                            <div className="text-center space-y-1">
                                <p className="text-sm font-semibold text-gray-700">
                                    Analyzing your document
                                </p>
                                <p className="text-xs text-gray-500">
                                    This may take a few seconds...
                                </p>
                            </div>
                        </div>
                    )}

                    {!isPending && (
                        <button
                            type="submit"
                            className="w-full py-2 rounded-lg text-white bg-green-500 hover:bg-green-600 transition-all duration-200"
                        >
                            Upload File
                        </button>
                    )}
                </form>
            </div>
        </Modal>
    );
}