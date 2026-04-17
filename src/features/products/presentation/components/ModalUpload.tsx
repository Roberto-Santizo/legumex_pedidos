import { Modal, useNotification, type UploadFileForm } from "@/features/shared/shared";
import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { productsProvider } from "../presentation";

export function ModalUpload() {
    const navigate = useNavigate();
    const notification = useNotification();
    const [searchParams] = useSearchParams();

    const show = searchParams.get("upload") === "true";

    const handleCloseModal = () => {
        navigate(location.pathname, { replace: true });
    };

    const { mutate, isPending } = useMutation({
        mutationFn: (file: File) => productsProvider.uploadProducts(file),
        onError: (err) => {
            notification.error(err.message);
        },
        onSuccess: (message) => {
            notification.success(message);
            handleCloseModal();
        }
    });

    const {
        handleSubmit,
        setValue,
        watch,
        setError,
        clearErrors,
        formState: { errors }
    } = useForm<UploadFileForm>();

    const file = watch("file");

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            const selected = acceptedFiles[0];

            if (!selected) return;
            clearErrors("file");
            setValue("file", selected, { shouldValidate: true });
        }, [setValue, setError, clearErrors]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop, multiple: false, accept: {
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
            "application/vnd.ms-excel": [".xls"],
        },
    });

    const onSubmit = (form: UploadFileForm) => {
        if (!form.file) return;
        const isExcel = form.file.name.endsWith(".xlsx") || form.file.name.endsWith(".xls");
        if (!isExcel) return;

        mutate(form.file);
    };

    return (
        <Modal modal={show} closeModal={handleCloseModal} title="Upload File">
            <div className="p-8 space-y-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition
                        ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}
                        ${errors.file ? "border-red-400 bg-red-50" : ""}`}
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
                                <span className="text-2xl">📄</span>
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

                    <button
                        type="submit"
                        disabled={isPending}
                        className={`w-full py-2 rounded-lg text-white transition
                        ${isPending ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"}`}
                    >
                        {isPending ? "Uploading..." : "Upload File"}
                    </button>
                </form>
            </div>
        </Modal>
    );
}