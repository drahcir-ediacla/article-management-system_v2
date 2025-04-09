'use client';

import { useEffect, useRef, useState } from 'react';
import { axiosInstance } from '@/app/_lib/axiosInstance';
import { IoIosArrowDown } from 'react-icons/io';
import { IoInformationCircleSharp } from "react-icons/io5";
import { articleSchema } from '@/app/_schemas/articleSchema';
import Input from '@/app/_components/Input';
import Button from '@/app/_components/Button';
import DatePicker from '@/app/_components/DatePicker';
import TipTapEditor from '../../../_components/TiptapEditor';
import { useAppDispatch } from '@/app/redux/store';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/redux/store';
import { currentAuthUser } from '@/app/redux/actions/authUserActions';
import { useRouter } from 'next/navigation';
// import 'easymde/dist/easymde.min.css';

interface Company {
  id: string;
  logo: string;
  name: string;
  status: 'Active' | 'Inactive';
}



const AddArticlePage = () => {
  // const dispatch = useAppDispatch()
  const authUser = useSelector((state: RootState) => state.auth.data);
  const dropDownSelect = useRef<HTMLDivElement | null>(null);
  const router = useRouter()
  const [state, setState] = useState<{ errors?: Record<string, string[]> }>({});
  const [editorContent, setEditorContent] = useState("");
  const [companyData, setCompanyData] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState('')
  const [companyId, setcompanyId] = useState('')
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [title, setTitle] = useState('')
  const [link, setLink] = useState('')
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false)

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     await dispatch(currentAuthUser());
  //   };

  //   fetchUser();
  // }, [dispatch]);


  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      if (dropDownSelect.current && !dropDownSelect.current.contains(e.target as Node)) {
        setOptionsOpen(false);
      }
    };
    document.addEventListener('click', handleGlobalClick);

    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const fetchCompanyData = async () => {
      try {
        const response = await axiosInstance.get('/api/company');
        setCompanyData(response.data);
      } catch (error) {
        console.error('Error fetching company data:', error);
      }
    };
    fetchCompanyData();
    return () => controller.abort();
  }, []);

  const handleSelectCompany = (id: string, company: string) => {
    setcompanyId(id)
    setSelectedCompany(company)
    setOptionsOpen(false);
  }

  const uploadImgToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append('upload_preset', 'auwcvbw0');
    formData.append('cloud_name', 'yogeek-cloudinary');
    formData.append('folder', 'samples');
    formData.append('file', file);

    const CLOUDINARY_API = process.env.NEXT_PUBLIC_CLOUDINARY_API;

    if (!CLOUDINARY_API) {
      throw new Error('CLOUDINARY_API is not defined in environment variables.');
    }

    try {
      const response = await fetch(CLOUDINARY_API, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        return data.secure_url; // Return single uploaded file info
      } else {
        console.error(`Error uploading ${file.name}: ${response.statusText}`);
        return null; // Return null for unsuccessful uploads
      }
    } catch (error) {
      console.error(`Error uploading ${file.name}:`, error);
      return null; // Return null for errors
    }
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    // Convert the date to ISO string format (e.g., "2025-03-15T21:44:00Z")
    const rawDate = formData.get('articleDate') as string;
    const formattedDate = rawDate ? new Date(rawDate).toISOString() : null;
    console.log('formattedDate:', formattedDate)

    const validatedFields = articleSchema.safeParse({
      company: formData.get('selectedCompany'),
      title: formData.get('inputTitle'),
      link: formData.get('inputLink'),
      date: formattedDate, // Use the formatted date
      image: formData.get('image'),
      content: formData.get('content'),
    });
    console.log('Parsed fields:', validatedFields);

    if (!validatedFields.success) {
      setState({ errors: validatedFields.error.flatten().fieldErrors });
      return;
    }
    console.log("Article saved successfully!", validatedFields.data);

    const { title, link, date, image, content } = validatedFields.data;

    try {
      setIsLoading(true)
      // Ensure the file input contains a valid file
      const imgFile = formData.get("image") as File | null;

      if (!imgFile || !(imgFile instanceof File)) {
        throw new Error("No valid file selected");
      }

      // Upload the file to Cloudinary and get its URL
      const imgUrl = await uploadImgToCloudinary(imgFile);
      console.log("Uploaded Image URL:", imgUrl);

      const response = await axiosInstance.post('/api/article', {
        title,
        link,
        date,
        image: imgUrl,
        content,
        status: 'ForEdit',
        writerId: authUser?.id,
        companyId,
      });
      console.log('Request sent successfully:', response.data);
      if (response.status === 201) {
        router.push('/dashboard');
      }
      setIsLoading(false)

    } catch (error) {
      setIsLoading(false)
      console.error("Internal Error", error);
    }
  }

  return (
    <div className="m-[20px]">
      <h1 className="font-bold">Add New Article</h1>
      <form className="flex flex-col gap-[33px] h-auto max-w-[1000px] mt-[20px]" onSubmit={handleSave}>
        <div className="flex flex-col gap-[5px]">
          <label htmlFor='selectedCompanyID'><b>Company</b></label>
          <div className="relative" ref={dropDownSelect}>
            <div className="absolute flex items-center cursor-pointer h-full justify-end leading-[32px] pr-[15px] top-[0] w-full" onClick={() => setOptionsOpen((prev) => !prev)}>
              <IoIosArrowDown />
            </div>
            <input
              type="text"
              id="selectedCompanyID"
              name="selectedCompany"
              placeholder="Please select one..."
              className="rounded-md grow text-[15px] border-[1px] border-[#bcbcbc] h-[40px] w-full px-[15px]"
              value={selectedCompany}
              readOnly
            />
            {optionsOpen && (
              <div className="absolute left-0 right-0 top-[42px] z-0 bg-white border shadow-lg">
                {companyData.map((option) => (
                  <div key={option.id} className="font-medium px-[8px] py-[5px] cursor-pointer hover:bg-gray-101" onClick={() => handleSelectCompany(option.id, option.name)} >
                    {option.name}
                  </div>
                ))}
              </div>
            )}
          </div>
          {state.errors?.company && <div className="flex gap-[2px]"><IoInformationCircleSharp color='#dc2626' size={18} /> <span className="text-red-500 text-sm">{state.errors.company}</span></div>}
        </div>
        <div className='flex flex-col gap-[5px]'>
          <label htmlFor='inputTitleID'><b>Title</b></label>
          <input
            id="inputTitleID"
            name="inputTitle"
            className="h-[40px] text-base py-0 px-[10px] border rounded-md border-gray-300 outline-none"
            placeholder="Enter title"
            onChange={(e) => setTitle(e.target.value)}
            onBlur={(e) => { !link && setLink(e.target.value) }}
          />
          {state.errors?.title && <div className="flex gap-[2px]"><IoInformationCircleSharp color='#dc2626' size={18} /> <span className="text-red-500 text-sm">{state.errors.title}</span></div>}
        </div>

        <div className='flex flex-col gap-[5px]'>
          <label htmlFor='inputLinkID'><b>Link</b></label>
          <div className='flex align-middle border rounded-md h-[40px]'>
            <span className="flex items-center pl-[10px]">/</span>
            <input
              id="inputLinkID"
              name="inputLink"
              className="border-none outline-none h-auto w-full"
              value={isFocused ? link.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") : (link || title).toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}
              onChange={(e) => setLink(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </div>
          <span className='text-gray-500 text-sm'>
            {process.env.NEXT_PUBLIC_API_URL}/{(link || title)
              .toLowerCase()
              .replace(/\s+/g, "-") // Replace spaces with '-'
              .replace(/[^a-z0-9-]/g, "") // Remove special characters except '-'
            }
          </span>
          {state.errors?.link && <div className="flex gap-[2px]"><IoInformationCircleSharp color='#dc2626' size={18} /> <span className="text-red-500 text-sm">{state.errors.link}</span></div>}
        </div>

        <div className='flex flex-col gap-[5px]'>
          <label htmlFor='articleDateID'><b>Date</b></label>
          <DatePicker id="articleDateID" name="articleDate" />
          {state.errors?.date && <div className="flex gap-[2px]"><IoInformationCircleSharp color='#dc2626' size={18} /> <span className="text-red-500 text-sm">{state.errors.date}</span></div>}
        </div>

        <div className='flex flex-col gap-[5px]'>
          <label htmlFor='imageId'><b>Image</b></label>
          <input type='file' id='imageId' name='image' accept=".png,.jpg,.jpeg" />
          {state.errors?.image && <div className="flex gap-[2px]"><IoInformationCircleSharp color='#dc2626' size={18} /><span className="text-red-500 text-sm">{state.errors.image}</span></div>}
        </div>

        <div className='flex flex-col gap-[5px]'>
          <label htmlFor='contentId'><b>Content</b></label>
          <TipTapEditor id='contentId' name='content' content={editorContent}
            setContent={setEditorContent} />
          {state.errors?.content && <div className="flex gap-[2px] text-red-600"><IoInformationCircleSharp className="text-lg" /> <span className="text-red-500 text-sm">{state.errors.content}</span></div>}
        </div>

        <Button className={`flex justify-center ${isLoading ? 'bg-gray-400' : ''}`} disabled={isLoading}>
          {!isLoading ? (
            <span className='font-medium'>Save</span>
          ) : (
            <>
              <svg className="mr-3 -ml-1 size-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              <span className='font-medium'>Saving...</span>
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default AddArticlePage;
