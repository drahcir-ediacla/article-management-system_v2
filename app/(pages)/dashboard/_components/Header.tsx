'use client'
import { useAppDispatch } from '@/app/redux/store'
import { useSelector } from "react-redux";
import { RootState } from '@/app/redux/store';
import Link from 'next/link'
import { useEffect } from 'react';
import { currentAuthUser } from '@/app/redux/actions/authUserActions';

const Header = () => {
  const dispatch = useAppDispatch()
  const user = useSelector((state: RootState) => state.auth.data);
  console.log('Current User:', user)

  useEffect(() => {
    const fetchUser = async () => {
      await dispatch(currentAuthUser());
    };
  
    fetchUser();
  }, [dispatch]);
  

  return (
    <header className='flex justify-between items-center p-[20px] text-very-light-green bg-dark-blue'>
      <div className='col1'><h2 className='font-bold text-2xl'><Link href='/admin'>Admin Panel</Link></h2></div>
      <div className='col2'>{user?.firstName} {user?.lastName} - {user?.role}</div>
    </header>
  )
}

export default Header