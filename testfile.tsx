'use client'
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { getXataClient } from '@/src/xata';

export default function EditorPage() {
    const editorInstance = useRef(null);
    const [outputData, setOutputData] = useState(null);
    const [initialData, setInitialData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const xata = getXataClient();
                const data = await xata.db.book.getAll();
                setInitialData(data);
            } catch (error) {
                console.error('Error fetching initial data:', error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (!loading && initialData) { // Ensure editor initializes after data is loaded
            const initializeEditor = async () => {
                const EditorJS = (await import('@editorjs/editorjs')).default;
                // Import editor tools here

                if (!editorInstance.current) {
                    editorInstance.current = new EditorJS({
                        holder: 'editorjs',
                        data: initialData,
                        onReady: () => {
                            console.log('Editor.js is ready to work!');
                        },
                        onChange: (api, event) => {
                            console.log("Now I know that Editor's content changed!", event);
                        },
                        placeholder: 'Type / or hit the + icon to see more options or simply start typing!',
                        inlineToolbar: true,
                        autofocus: true,
                        tools: {
                            // Initialize tools here
                        }
                    });
                }
            };

            const savedData = localStorage.getItem('editorData');
            if (savedData) {
                initializeEditor(JSON.parse(savedData));
            } else {
                initializeEditor();
            }
        }
    }, [loading, initialData]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading data: {error.message}</div>;
    }

    const handleSaveToLocal = () => {
        if (editorInstance.current) {
            editorInstance.current.save().then((data) => {
                setOutputData(data);
                localStorage.setItem('editorData', JSON.stringify(data));
                toast.success('Saved to the Browser!');
            }).catch((error) => {
                console.log('Saving failed:', error);
                toast.error('Error: Was Not Saved!');
            });
        }
    };

    const handlePublish = async () => {
        if (editorInstance.current) {
            const data = await editorInstance.current.save();
            if (data) {
                try {
                    const response = await axios.post('http://localhost:3000/api/saveeditor', {
                        body: data,
                    }, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    if (response.status === 200) {
                        toast.success('Article Published!');
                        localStorage.removeItem('editorData');
                    } else {
                        toast.error('Error: Article Was Not Saved!');
                    }
                } catch (error) {
                    console.error('Error submitting form:', error);
                    toast.error('Error: Article Was Not Saved!');
                }
            }
        }
    };

    return (
        <main>
            <div className='flex justify-end pr-14 pt-10'>
                <button onClick={handleSaveToLocal} className='bg-sky-400 rounded-lg text-black p-2 hover:bg-sky-600'>Save</button>
                <button onClick={handlePublish} className='bg-sky-400 rounded-lg text-black p-2 hover:bg-sky-600'>Publish</button>
            </div>
            <h1 className='flex justify-center text-3xl pt-8 text-white'>Editor - Experimental</h1>
            <p className='flex justify-center pb-8 px-4 text-white text-center'>Currently a work in progress and does not include all features planned to be added. You can save it to your Browser but if you delete your browser history that information will be lost</p>
            <div className='flex justify-center pb-20'>
                <div className='flex justify-center mx-10 md:w-1/2'>
                    <div id='editorjs' className='text-black bg-gray-200 pt-5 w-full' />
                </div>
            </div>
        </main>
    );
}