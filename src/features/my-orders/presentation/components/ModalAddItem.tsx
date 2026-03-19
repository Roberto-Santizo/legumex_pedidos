import { Modal, TextFormField, CustomFilledButton } from "@/features/shared/shared";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import type { AddItemForm } from "../../my-orders";

export function ModalAddItem() {
    const navigate = useNavigate();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const modal = queryParams.get('addItem')!;
    const show = modal ? true : false;


    const {
        handleSubmit,
        register,
        formState: { errors }
    } = useForm<AddItemForm>();

    const onSubmit = () => { }

    const handleCloseModal = () => {
        navigate(location.pathname);
    }
    return (
        <Modal modal={show} closeModal={() => handleCloseModal()} title="Add Item">
            <div className="p-10">
                <form className="form" onSubmit={handleSubmit(onSubmit)}>
                    <TextFormField<AddItemForm>
                        label="Boxes"
                        name="total_boxes"
                        placeholder="Total boxes"
                        register={register}
                        type="number"
                        validation={{ required: 'Total Boxes are required' }}
                        errorMessage={errors.total_boxes?.message}
                    />

                    <TextFormField<AddItemForm>
                        label="PO"
                        name="po"
                        placeholder="PO information"
                        register={register}
                        type="text"
                        validation={{ required: 'PO is required' }}
                        errorMessage={errors.po?.message}
                    />

                    <CustomFilledButton
                        label="Add Item"
                        type="submit"
                        disabled={false}
                        key={'addItem'}
                    />
                </form>
            </div>
        </Modal>
    )
}
