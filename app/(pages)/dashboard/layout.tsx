import React, { ReactNode } from 'react'
import Header from './_components/Header';
interface Props {
    children: ReactNode;
}

const AdminLayout = ({ children }: Props) => {
    return (
        <>
            <Header />
            <div>{children}</div>
        </>
    )
}

export default AdminLayout