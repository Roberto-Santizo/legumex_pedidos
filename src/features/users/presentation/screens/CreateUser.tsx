import { CustomFilledButton } from "@/features/shared/shared";
import { Form } from "../components/Form";
import { useForm } from "react-hook-form";
import type { CreateOrUpdateUserPayload } from "@/features/users/users";

export function CreateUser() {
  const {
    handleSubmit,
    register,
    formState: { errors },
    control
  } = useForm<CreateOrUpdateUserPayload>();

  const onSubmit = (data: CreateOrUpdateUserPayload) => { console.log(data) }
  return (
    <div>
      <h1 className="main_title">Create User</h1>

      <form className="form mx-auto w-1/2" onSubmit={handleSubmit(onSubmit)}>
        <Form register={register} errors={errors} control={control} />

        <CustomFilledButton
          label="Create"
          type="submit"
          disabled={false}
        />
      </form>
    </div>
  )
}
