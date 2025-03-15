'use client';

import { useEffect, useRef, useState } from 'react';
import { axiosInstance } from '@/app/_lib/axiosInstance';
import { IoIosArrowDown } from 'react-icons/io';
import Input from '@/app/_components/Input';
import Button from '@/app/_components/Button';
import DatePicker from '@/app/_components/DatePicker';
import TipTapEditor from '../../../_components/TiptapEditor';
import 'easymde/dist/easymde.min.css';
import { articleSchema } from '@/app/_schemas/articleSchema';

interface Company {
  id: string;
  logo: string;
  name: string;
  status: 'Active' | 'Inactive';
}

interface FormState {
    company: string;
    title: string;
    permalink: string;
    date: string;
    image: File | null;
    content: string;
  }

const AddArticlePage = () => {
  const [companyData, setCompanyData] = useState<Company[]>([]);
  const [formData, setFormData] = useState<FormState>({
    company: '',
    title: '',
    permalink: '',
    date: '',
    image: null,
    content: '',
  });  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const dropDownSelect = useRef<HTMLDivElement | null>(null);
  const [optionsOpen, setOptionsOpen] = useState(false);

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
    const fetchCompanyData = async () => {
      try {
        const response = await axiosInstance.get('/api/company');
        setCompanyData(response.data);
      } catch (error) {
        console.error('Error fetching company data:', error);
      }
    };
    fetchCompanyData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleSelectCompany = (company: Company) => {
    setFormData((prev) => ({ ...prev, company: company.id }));
    setOptionsOpen(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const validationResult = articleSchema.safeParse(formData);

    if (!validationResult.success) {
      const errorMap = validationResult.error.format();
      const newErrors: Record<string, string> = {};
      Object.keys(errorMap).forEach((key) => {
        if (errorMap[key]?._errors?.length) newErrors[key] = errorMap[key]?._errors[0];
      });
      setErrors(newErrors);
      return;
    }

    console.log('Form Submitted:', formData);
  };

  return (
    <div className="m-[20px]">
      <h1 className="font-bold">Add New Article</h1>
      <form className="flex flex-col gap-[33px] h-auto max-w-[1000px] mt-[20px]" onSubmit={handleSave}>
        <div className="flex flex-col gap-[5px]">
          <b>Company</b>
          <div className="relative" ref={dropDownSelect}>
            <div className="absolute flex items-center cursor-pointer h-full justify-end leading-[32px] pr-[15px] top-[0] w-full" onClick={() => setOptionsOpen((prev) => !prev)}>
              <IoIosArrowDown />
            </div>
            <input
              type="text"
              id="selectedCompanyID"
              placeholder="Please select one..."
              className="rounded-md grow text-[15px] border-[1px] border-[#bcbcbc] h-[40px] px-[15px]"
              readOnly
              value={companyData.find((c) => c.id === formData.company)?.name || ''}
            />
            {optionsOpen && (
              <div className="absolute left-0 right-0 top-[42px] z-0 bg-white border shadow-lg">
                {companyData.map((option) => (
                  <div key={option.id} className="font-medium px-[8px] py-[5px] cursor-pointer hover:bg-gray-101" onClick={() => handleSelectCompany(option)}>
                    {option.name}
                  </div>
                ))}
              </div>
            )}
          </div>
          {errors.company && <span className="text-red-500 text-sm">{errors.company}</span>}
        </div>

        <Input id="inputTitleID" name="title" placeholder="Enter title" value={formData.title} onChange={handleInputChange} />
        {errors.title && <span className="text-red-500 text-sm">{errors.title}</span>}

        <Input id="inputLinkID" name="permalink" placeholder="Enter permalink" value={formData.permalink} onChange={handleInputChange} />
        {errors.permalink && <span className="text-red-500 text-sm">{errors.permalink}</span>}

        <DatePicker id="articleDateID" name="date" onChange={(date) => setFormData((prev) => ({ ...prev, date }))} />
        {errors.date && <span className="text-red-500 text-sm">{errors.date}</span>}

        <input type='file' id='fileInputId' name='image' accept=".png,.jpg,.jpeg" onChange={handleInputChange} />
        {errors.image && <span className="text-red-500 text-sm">{errors.image}</span>}

        <TipTapEditor content={formData.content} onChange={(content) => setFormData((prev) => ({ ...prev, content }))} />
        {errors.content && <span className="text-red-500 text-sm">{errors.content}</span>}

        <Button label='Save' />
      </form>
    </div>
  );
};

export default AddArticlePage;
