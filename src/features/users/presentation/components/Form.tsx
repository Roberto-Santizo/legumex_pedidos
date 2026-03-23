import type { Control, FieldErrors, UseFormRegister } from "react-hook-form"
import type { CreateOrUpdateUserPayload } from "../../users"
import { PasswordFormField, SelectFormField, TextFormField } from "@/features/shared/shared";
import { CheckboxListFormField } from "@/features/shared/components/CheckboxListFormField";

type Props = {
  register: UseFormRegister<CreateOrUpdateUserPayload>;
  errors: FieldErrors<CreateOrUpdateUserPayload>;
  control: Control<CreateOrUpdateUserPayload, any, CreateOrUpdateUserPayload>;
}

export function Form({ register, errors, control }: Props) {
  return (
    <>
      <TextFormField<CreateOrUpdateUserPayload>
        label="Name"
        name="name"
        placeholder="User name"
        register={register}
        type="text"
        validation={{ required: 'The user name is required' }}
        errorMessage={errors.name?.message}
      />

      <TextFormField<CreateOrUpdateUserPayload>
        label="Last name"
        name="lastName"
        placeholder="Users last name"
        register={register}
        type="text"
        validation={{ required: 'The user lastname is required' }}
        errorMessage={errors.lastName?.message}
      />

      <TextFormField<CreateOrUpdateUserPayload>
        label="Email"
        name="email"
        placeholder="Users email"
        register={register}
        type="email"
        validation={{ required: 'The users email is required' }}
        errorMessage={errors.email?.message}
      />

      <PasswordFormField<CreateOrUpdateUserPayload>
        label="Password"
        name="password"
        placeholder="Password"
        register={register}
        validation={{ required: 'The password is required' }}
        errorMessage={errors.password?.message}
      />

      <SelectFormField<CreateOrUpdateUserPayload>
        label="Role"
        control={control}
        name="role"
        validation={{ required: 'Role is required' }}
        errorMessage={errors.role?.message}
        options={[
          { value: 'admin', label: 'Admin' },
          { value: 'client', label: 'Client' },
          { value: 'administrator', label: 'Administrator' },
        ]}
      />

      <CheckboxListFormField<CreateOrUpdateUserPayload>
        label="Clients"
        name="clients"
        options={[
          { value: 'admin', label: 'Admin' },
          { value: 'client', label: 'Client' },
          { value: 'administrator', label: 'Administrator' },
        ]}
        register={register}
        errorMessage={errors.clients?.message}
      />
    </>
  )
}
