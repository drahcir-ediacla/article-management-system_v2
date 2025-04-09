import Input from "@/app/_components/Input"

const AddUser = () => {
    return (

        <div className="m-[20px]">
            <h1 className="font-bold">Add New User</h1>
            <form className="flex flex-col gap-[33px] h-auto max-w-[1000px] mt-[20px]">
                <div className='flex flex-col gap-[5px]'>
                    <label htmlFor='inputFirstNameID'><b>First Name</b></label>
                    <Input
                        id="inputFirstNameID"
                        name="inputFirstName"
                        className="h-[40px] text-base py-0 px-[10px] border rounded-md border-gray-300 outline-none"
                        placeholder="Enter first name"
                    />
                </div>
                <div className='flex flex-col gap-[5px]'>
                    <label htmlFor='inputLastNameID'><b>Last Name</b></label>
                    <Input
                        id="inputLastNameID"
                        name="inputLastName"
                        className="h-[40px] text-base py-0 px-[10px] border rounded-md border-gray-300 outline-none"
                        placeholder="Enter last name"
                    />
                </div>
                <div className='flex flex-col gap-[5px]'>
                    <label htmlFor='inputUserNameID'><b>User Name</b></label>
                    <Input
                        id="inputUserNameID"
                        name="inputUserName"
                        className="h-[40px] text-base py-0 px-[10px] border rounded-md border-gray-300 outline-none"
                        placeholder="Enter user name"
                    />
                </div>
                <div className='flex flex-col gap-[5px]'>
                    <label htmlFor='inputUserPassID'><b>Create Password</b></label>
                    <Input
                        id="inputUserPassID"
                        name="inputUserPass"
                        type="password"
                        className="h-[40px] text-base py-0 px-[10px] border rounded-md border-gray-300 outline-none"
                        placeholder="Enter password"
                    />
                </div>
            </form>
        </div>
    )
}

export default AddUser