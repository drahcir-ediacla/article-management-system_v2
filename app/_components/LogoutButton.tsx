"use client";
import { TbLogout2 } from "react-icons/tb";

const LogoutButton = () => {


    return (
        <div className="flex justify-end px-[20px]">
            <button
                className="flex items-center gap-[5px] text-[#555c] font-semibold border-none px-[5px] py-[10px]"
            >
                <TbLogout2 className="text-xl" /> Logout
            </button>
        </div>
    );
};

export default LogoutButton;
