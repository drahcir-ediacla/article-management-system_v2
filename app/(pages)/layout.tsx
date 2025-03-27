import React, { ReactNode } from 'react'
import Header from './_components/Header';
import HydrateUser from '../_components/HydrateUser';
interface Props {
    children: ReactNode;
}

const AdminLayout = ({ children }: Props) => {
    return (
        <>
            <HydrateUser />
            <Header />
            <div>{children}</div>
        </>
    )
}

export default AdminLayout