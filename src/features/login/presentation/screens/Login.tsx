import { authRepositoryProvider } from '@/features/login/presentation/presentation';
import { login, type LoginForm } from '@/features/login/login';
import { TextFormField, PasswordFormField, CustomFilledButton } from "@/features/shared/shared";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useNotification } from '@/features/shared/shared';
import type { AppDispatch, RootState } from "@/config/config";

export function Login() {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();
  const { error } = useNotification();

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: LoginForm) => authRepositoryProvider.login(payload),
    onSuccess: (user) => {
      dispatch(login(user));
    },
    onError: (err) => {
      error(err.message);
    }
  });

  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm<LoginForm>();

  const onSubmit = async (payload: LoginForm) => mutate(payload);


  return (
    <div className="grid place-items-center h-screen">
      <div className="flex flex-col w-1/4">

        <form className="flex flex-col justify-center space-y-6 shadow-xl p-6 bg-white" onSubmit={handleSubmit(onSubmit)}>
          <h1 className="text-2xl font-bold text-center mb-5">Iniciar Sesión, {user?.name}</h1>

          <TextFormField<LoginForm>
            name="email"
            label="Correo Eléctronico"
            placeholder="Ingrese su correo eléctronico"
            type="text"
            errorMessage={errors.email?.message}
            register={register}
            validation={{ required: 'El nombre de usuario es requerido' }}
          />

          <PasswordFormField<LoginForm>
            name="password"
            label="Contraseña"
            placeholder="Contraseña"
            errorMessage={errors.password?.message}
            register={register}
            validation={{ required: 'La contraseña es requerida' }}
          />

          <CustomFilledButton label={isPending ? 'Iniciando sesión' : 'Iniciar Sesión'} type="submit" />
        </form>
      </div>
    </div>
  )
}
