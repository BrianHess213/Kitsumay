'use client'
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';


export default function EditorPage() {
    const editorInstance = useRef(null);
    const [initialData, setInitialData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/getsave');
                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }

                const data = await response.json();

                // Assume we're loading the first document's editor body
                if (data.length > 0 && data[0].editor && data[0].editor.body) {
                    setInitialData(data[0].editor.body); // Set this as the initial data for EditorJS
                } else {
                    console.error('Unexpected data structure:', data);
                }
            } catch (err) {
                console.error('Error fetching initial data:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (!loading && initialData) { // Ensure editor initializes after data is loaded
            const initializeEditor = async (initialData: null) => {

                const EditorJS = (await import('@editorjs/editorjs')).default;
                const Header = (await import('editorjs-header-with-alignment')).default;
                const Paragraph = (await import('@editorjs/paragraph')).default;
                const List = (await import('@editorjs/list')).default;
                const SimpleImage = (await import('simple-image-editorjs')).default;
                const Embed = (await import('@editorjs/embed')).default;
                const Quote = (await import('@editorjs/quote')).default;
                const InlineCode = (await import('@editorjs/inline-code')).default;
                const Table = (await import('@editorjs/table')).default;
                const Warning = (await import('@editorjs/warning')).default;
                const Alert = (await import('editorjs-alert')).default;
                const Delimiter = (await import('@coolbytes/editorjs-delimiter')).default;
                const AlignmentTuneTool = (await import('editorjs-text-alignment-blocktune')).default;

                if (!editorInstance.current) {
                    editorInstance.current = new EditorJS({
                        holder: 'editorjs',
                        data: initialData,
                        onReady: () => {
                            console.log('Editor.js is ready to work!');
                        },
                        onChange: (api, event) => {
                            console.log('Now I know that Editor\'s content changed!', event);
                        },
                        placeholder: 'Type / or hit the + icon to see more options or simply start typing!',
                        inlineToolbar: true,
                        autofocus: true,
                        tools: {
                            header: {
                                class: Header,
                                shortcut: 'CMD+SHIFT+H',
                                inlineToolbar: true,
                                config: {
                                    placeholder: 'Enter a Header',
                                    levels: [1, 2, 3, 4, 5, 6],
                                    defaultLevel: 3,
                                    defaultAlignment: 'left',
                                },
                            },
                            list: {
                                class: List as never,
                                inlineToolbar: true,
                                tunes: ['anyTuneName'],
                            },
                            image: {
                                class: SimpleImage,
                                inlineToolbar: true,
                            },
                            embed: {
                                class: Embed,
                                inlineToolbar: true,
                                tunes: ['anyTuneName'],
                            },
                            quote: {
                                class: Quote,
                                inlineToolbar: true,
                                shortcut: 'CMD+SHIFT+O',
                                tunes: ['anyTuneName'],
                                config: {
                                    quotePlaceholder: 'Enter a quote',
                                    captionPlaceholder: 'Quote\'s author',
                                },
                            },
                            inlineCode: {
                                class: InlineCode,
                                inlineToolbar: true,
                            },
                            table: {
                                class: Table as never,
                                inlineToolbar: true,
                            },
                            paragraph: {
                                class: Paragraph,
                                inlineToolbar: true,
                                tunes: ['anyTuneName'],
                            },
                            warning: {
                                class: Warning,
                                inlineToolbar: true,
                                shortcut: 'CMD+SHIFT+W',
                                tunes: ['anyTuneName'],
                                config: {
                                    titlePlaceholder: 'Title',
                                    messagePlaceholder: 'Message',
                                },
                            },
                            delimiter: {
                                class: Delimiter,
                                inlineToolbar: true,
                                config: {
                                    styleOptions: ['star', 'dash', 'line'],
                                    defaultStyle: 'star',
                                    lineWidthOptions: [8, 15, 25, 35, 50, 60, 100],
                                    defaultLineWidth: 25,
                                    lineThicknessOptions: [1, 2, 3, 4, 5, 6],
                                    defaultLineThickness: 2,
                                },
                            },
                            alert: {
                                class: Alert,
                                inlineToolbar: true,
                                shortcut: 'CMD+SHIFT+A',
                                config: {
                                    alertTypes: ['primary', 'secondary', 'info', 'success', 'warning', 'danger', 'light', 'dark'],
                                    defaultType: 'primary',
                                    messagePlaceholder: 'Enter something',
                                },
                            },
                            anyTuneName: {
                                class: AlignmentTuneTool as never,
                                inlineToolbar: true,
                                config: {
                                    default: "left",
                                },
                            },
                        }
                    });
                }
            };

            // Only initialize editor once loading is complete and the initial data is set
            if (!loading && (initialData || localStorage.getItem('editorData'))) {
                const savedData = localStorage.getItem('editorData');
                initializeEditor(savedData ? JSON.parse(savedData) : initialData);
            }
        }

        return () => {
            if (editorInstance.current) {
                editorInstance.current.destroy();
                editorInstance.current = null;
            }
        };



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
                setInitialData(data);
                localStorage.setItem('editorData', JSON.stringify(data));
                toast.success('Saved!');
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
                        localStorage.removeItem('editorData'); // Optionally clear localStorage after successful save
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
        <main className='grid grid-cols-[1fr_4fr]'>
           
                <aside className='w-full h-screen'>

                <h2 className="text-white text-center text-lg my-4 ">User Notes</h2>

                <div className="space-y-4">
        
                        <div className='bg-gray-800 p-4 h-60 rounded shadow'>
                            <p text-sm >Save Button:</p>
                            <p text-sm >The save button will only save document to local stoarge if the local stoarge is deleted you will lose your saved data it is only ment for if you need to step a way and wanted to come back in a short amount of time but as long as your local stoarge is not deleted it can stay there for a long time it does not expire</p>
                        </div>

                        <div className='bg-gray-800 p-4 rounded shadow'>
                            <p text-sm >Publish Button:</p>
                            <p text-sm >The Publish button saves to a Database can cant be deleted yet. But currently I have made a way yet for you to retirve work that has been published time so it can only be used once I know pretty usless that why there is a save button but eventually the publish button will work just like its suppost to where you can call back different chapters and edit them and publish them again just not right now </p>
                        </div>
                   
                </div>

                </aside>
          
            <div>

                <div className='flex justify-end pr-14 pt-10'>
                    <div className='pr-5'>
                        <button onClick={handleSaveToLocal} className='bg-sky-400 rounded-lg text-black p-2 px-5 hover:bg-sky-600' >Save</button>
                    </div>

                    <button onClick={handlePublish} className='bg-sky-400 rounded-lg text-black p-2 px-5 hover:bg-sky-600' >Publish</button>

                </div>



                <h1 className='flex justify-center text-3xl pt-8 text-white'>Editor - Experimental</h1>
                <p className='flex justify-center pb-8 px-4 text-white text-center'>Currently a work in progress and does not include all features planned to be added. You can save it to your Browser but if you delete your brower history that information will be lost</p>
                <p className='flex justify-center pb-8 px-4 text-white text-center'>ALL DATA WILL BE DELETED AS I AM STILL WORKING ON THE SCHEMA AND ON THE DATABASE SO USE AT YOUR OWN RISK!</p>

                <div className='flex justify-center pb-20'>
                    <div className='flex justify-center mx-10'>
                        <div id='editorjs' className='text-black bg-gray-200 pt-5 p-10' />
                    </div>
                </div>
            </div>
        </main>
    );
}