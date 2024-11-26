'use client'
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function EditorPage() {
    const editorInstance = useRef(null);
    const [outputData, setOutputData] = useState(null);

    useEffect(() => {
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

        const savedData = localStorage.getItem('editorData');

        if (savedData) {
            initializeEditor(JSON.parse(savedData)); // Initialize with localStorage data
        } else {
            initializeEditor( null ); // Initialize with no data
        }

        return () => {
            if (editorInstance.current) {
                editorInstance.current.destroy();
                editorInstance.current = null;
            }
        };
    }, []);

    const handleSave = () => {
        if (editorInstance.current) {
            editorInstance.current.save().then((data) => {
                setOutputData(data); // Update the state with the editor's content
                localStorage.setItem('editorData', JSON.stringify(data)); // Save to localStorage
                toast.success('Saved to the Browser!');
            }).catch((error) => {
                console.log('Saving failed:', error);
                toast.error('Error: Was Not Saved!');

            });
        }
    };

    const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();

        handleSave();

        if (outputData) {
            try {
                const response = await axios.post('http://localhost:3000/api/savededitor', {
                    body: outputData,
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.status === 200) {
                    // The request was successful, handle the response data if necessary
                    toast.success('Article Saved!');
                } else {
                    // The request completed but the server response is not successful
                    toast.error('Error: Article Was Not Saved!');
                }

                localStorage.removeItem('editorData'); // Optionally clear localStorage after successful save

            } catch (error) {
                console.error('Error submitting form:', error);
                toast.error('Error: Article Was Not Saved!');
            }
        } 
    };


    return (
        <main>
            <div className='flex justify-end pr-14 pt-10'>
                <button onClick={handleSubmit} className='bg-sky-400 rounded-lg text-black p-2 hover:bg-sky-600' >Save To Browser</button>
            </div>

            <h1 className='flex justify-center text-3xl pt-8 text-white'>Editor - Experimental</h1>
            <p className='flex justify-center pb-8 px-4 text-white text-center'>Currently a work in progress and does not include all features planned to be added. You can save it to your Browser but if you delete your brower history that information will be lost</p>
          
            <div className='flex justify-center pb-20'>
                <div className='flex justify-center mx-10 md:w-1/2'>
                    <div id='editorjs' className='text-black bg-gray-200 pt-5 w-full' />
                </div>
            </div>
        </main>
    );
}