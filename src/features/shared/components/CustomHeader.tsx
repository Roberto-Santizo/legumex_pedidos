import { BiLogOut, BiMessage, BiUser } from "react-icons/bi";
import { logout } from "@/features/login/login";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/config/config";

export function CustomHeader() {
    const user = useSelector((state: RootState) => state.auth.user)!;
    const dispatch = useDispatch<AppDispatch>();

    return (
        <div className="flex justify-between items-center w-full">
            <h1 className="text-lg font-semibold">Hola, {user.name}</h1>

            <div className="flex justify-center gap-5">
                <BiLogOut size={20} onClick={() => dispatch(logout())} className="hover:cursor-pointer hover:text-gray-500" />
                <BiUser size={20} />
                <BiMessage size={20} />
            </div>
        </div>
    )
}
