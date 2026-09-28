import { authRepositoryProvider } from '@/features/login/presentation/presentation';
import { login, type LoginForm } from '@/features/login/login';
import { TextFormField, PasswordFormField, CustomFilledButton } from "@/features/shared/shared";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useNotification } from '@/features/shared/shared';
import type { AppDispatch } from "@/config/config";
import background from '@/assets/imgs/public_background.jpg';
import logo from '@/assets/imgs/logo.png';
import logoMark from '@/assets/imgs/logo-mark.png';

export function Login() {
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
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="relative hidden lg:block overflow-hidden">
        <img src={background} alt="" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-900/90 via-brand-900/40 to-transparent" />

        <div className="relative h-full flex flex-col justify-between p-10 text-white">
          <div className="inline-flex self-start items-center gap-2.5 rounded-xl bg-white/95 px-3 py-2 shadow-sm">
            <img src={logoMark} alt="Legumex" className="h-6 w-auto" />
            <span className="text-sm font-semibold text-ink">Legumex Orders</span>
          </div>

          <div className="max-w-md space-y-3">
            <h2 className="text-3xl font-semibold tracking-tight leading-tight">Pedidos, contenedores y logística en un solo lugar.</h2>
            <p className="text-sm text-white/75">Planifica los pedidos semanales, asigna contenedores y controla los costos de transporte por cliente y DC.</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 bg-white">
        <form className="w-full max-w-sm flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
          <img src={logo} alt="Agroindustria Legumex" className="w-44 self-center mb-6" />

          <div className="space-y-1.5 mb-3">
            <h1 className="text-2xl font-semibold tracking-tight text-ink">Iniciar sesión</h1>
            <p className="text-sm text-neutral-500">Ingresa tus credenciales para continuar.</p>
          </div>

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

          <CustomFilledButton
            label="Iniciar sesión"
            type="submit"
            disabled={isPending}
            fullWitdh
            className="h-10 mt-2"
          />

          <p className="text-xs text-center text-neutral-400 mt-4">© {new Date().getFullYear()} Legumex</p>
        </form>
      </div>
    </div>
  )
}
