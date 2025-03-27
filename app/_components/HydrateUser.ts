'use client'
import { useEffect } from 'react'
import { useAppDispatch } from '../redux/store'
import { currentAuthUser } from '@/app/redux/actions/authUserActions';

const HydrateUser = () => {
 const dispatch = useAppDispatch()

 useEffect(() => {
    const fetchUser = async () => {
      await dispatch(currentAuthUser());
    };

    fetchUser();
  }, [dispatch]);

  return null;
}

export default HydrateUser