import { Modal, useNotification } from "@/features/shared/shared";
import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ordersProvider } from "../providers/ordersRepositoryProvider";

type UploadForm = {
    file: File | null;
};

type UploadResponse = {
    product: string;
    internationalCode: string;
    localCode: string;
    total_boxes: number;
    total_pounds: number;
    total_amount: number;
    pallets: number;
};

export function ModalUploadFile() {
    const navigate = useNavigate();
    const notification = useNotification();
    const [searchParams] = useSearchParams();

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
    } = useForm<UploadForm>({
        defaultValues: {
            file: null
        }
    });

    const file = watch("file");

    const { mutate, data, isPending, isSuccess } = useMutation({
        mutationFn: (file: File) => ordersProvider.uploadFile(file),
        onError: (err: any) => {
            notification.error(err?.message || "Error uploading file");
        },
        onSuccess: () => {
            notification.success("File uploaded successfully");
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

    const onSubmit = (form: UploadForm) => {
        if (!form.file) {
            setError("file", { message: "File is required" });
            return;
        }

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

                {isSuccess && data?.data?.length > 0 && (
                    <div className="mt-6 space-y-3">
                        <h3 className="font-semibold text-gray-800">
                            Processed Products
                        </h3>

                        <div className="max-h-60 overflow-y-auto border rounded-lg p-3 space-y-2 bg-gray-50">
                            {data.data.map((product: UploadResponse, idx: number) => (
                                <div
                                    key={idx}
                                    className="p-3 bg-white rounded-lg shadow-sm border text-sm"
                                >
                                    <p><strong>Product:</strong> {product.product}</p>
                                    <p><strong>Local Code:</strong> {product.localCode}</p>
                                    <p><strong>International Code:</strong> {product.internationalCode}</p>
                                    <p><strong>Boxes:</strong> {product.total_boxes}</p>
                                    <p><strong>Pounds:</strong> {product.total_pounds}</p>
                                    <p><strong>Amount:</strong> ${product.total_amount}</p>
                                    <p><strong>Pallets:</strong> {product.pallets}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
}