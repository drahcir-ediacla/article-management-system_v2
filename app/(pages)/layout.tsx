import React, { ReactNode } from 'react'
import Header from './_components/Header';
import QueryProvider from './_components/QueryProvider';
interface Props {
    children: ReactNode;
}

const AdminLayout = ({ children }: Props) => {
    return (
        <>
            <Header />
            <QueryProvider>{children}</QueryProvider>
        </>
    )
}

export default AdminLayout