'use client'
import { IoIosArrowDown } from "react-icons/io";
import Input from "@/app/_components/Input";
import Button from "@/app/_components/Button";
import DatePicker from "@/app/_components/DatePicker";
import TipTapEditor from "../../../_components/TiptapEditor";
import "easymde/dist/easymde.min.css";

const AddArticlePage = () => {
    return (
        <div className="m-[20px]">
            <h1 className="font-bold">Add New Article</h1>
            <form className="flex flex-col gap-[33px] h-auto max-w-[1000px] mt-[20px]">
                <div className="flex flex-col gap-[5px]">
                    <b>Company</b>
                    <div className="relative">
                        <div className="absolute flex items-center border-none cursor-pointer h-full justify-end leading-[32px] outline-none pr-[15px] top-[0] w-full">
                            <IoIosArrowDown />
                        </div>
                        <div className="flex">
                            <input type="text" id='selectedCompanyID' placeholder='Please select one...' className="rounded-md grow text-[15px] border-[1px] border-[#bcbcbc] border-solid h-[40px] outline-none py-[0] px-[15px]" readOnly />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-[5px]">
                    <b>Upload Image</b>
                    <input
                        type='file'
                        id='fileInputId'
                        accept=".png,.jpg,.jpeg"
                    />
                </div>
                <div className="flex flex-col gap-[5px]">
                    <label htmlFor="inputTitleID"><b>Title</b></label>
                    <Input
                        id='inputTitleID'
                        name='title'
                        placeholder='Enter slug'
                        className="text-[15px]"
                    />
                </div>
                <div className="flex flex-col gap-[5px]">
                    <label htmlFor="inputLinkID"><b>Permalink:</b> <span>{process.env.NEXT_PUBLIC_ARTICLE_PERMALINK_BASE_URL}</span></label>
                    <Input
                        id='inputLinkID'
                        name='nameLink'
                        placeholder='Enter slug'
                        className="text-[15px]"
                    />
                </div>
                <div className="flex flex-col gap-[5px]">
                    <label htmlFor='articleDateID'><b>Date</b></label>
                    <DatePicker
                        id="articleDateID"
                        name="nameArticleDate"
                    />
                </div>
                <div className="flex flex-col gap-[5px]">
                    <label htmlFor='tiptapID'><b>Titap Editor</b></label>
                    <TipTapEditor />
                </div>
                <Button label='Save' />
            </form>
        </div>
    )
}

export default AddArticlePage