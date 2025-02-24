'use client';

import { useEffect, useState } from "react";
import { axiosInstance } from "@/app/_lib/axiosInstance";
import Link from "next/link";
import Image from "next/image";
import Button from "../../../_components/Button";

interface Company {
    id: number;
    logo: string;
    name: string;
    status: "Active" | "Inactive";
}

interface Writer {
    id: number;
    firstName: string;
    lastName: string;
    userName: string;
    type: "Writer" | "Editor";
    status: "Active" | "Inactive";
}

interface Editor {
    id: number;
    firstName: string;
    lastName: string;
    userName: string;
    type: "Writer" | "Editor";
    status: "Active" | "Inactive";
}

interface Article {
    id: number;
    image: string;
    title: string;
    link: string;
    status: "Published" | "For Edit";
    writer: Writer;
    editor: Editor | null; // Nullable in case there's no editor
    company: Company;
}


const ArticleList = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await axiosInstance.get('/api/article', {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                });
                setArticles(response.data);
            } catch (error) {
                console.error("Error fetching articles:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    if (loading) {
        return <p>Loading articles...</p>;
    }

    return (
        <>
            <div className="flex gap-4 justify-center font-medium m-5">
                <Button label="Add New Article" />
                <Button label="Add New User" />
                <Button label="Add New Company" />
            </div>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg m-5">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th className="px-6 py-3">Image</th>
                            <th className="px-6 py-3">Title</th>
                            <th className="px-6 py-3">Link</th>
                            <th className="px-6 py-3">Writer</th>
                            <th className="px-6 py-3">Editor</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">
                                <span className="sr-only">Action</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {articles.map((article) => (
                            <tr key={article.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4">
                                    <div className="w-12 h-12 overflow-hidden">
                                        <Image src={article.image} alt={article.title} width={50} height={50} objectFit="cover" />
                                    </div>
                                </td>
                                <td className="px-6 py-4">{article.title}</td>
                                <td className="px-6 py-4">
                                    <Link href={article.link} target="_blank" className="text-blue-600 dark:text-blue-500 hover:underline">
                                        View Link
                                    </Link>
                                </td>
                                <td className="px-6 py-4">{article.writer.firstName} {article.writer.lastName}</td>
                                <td className="px-6 py-4">
                                    {article.editor ? `${article.editor.firstName} ${article.editor.lastName}` : "No editor assigned"}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-block text-xs py-1 px-2 rounded-md ${article.status === 'Published' ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'}`}>
                                        {article.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default ArticleList;
