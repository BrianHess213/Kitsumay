'use client'

import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';



const BaseURL = process.env.REACT_APP_BASEURL;
console.log("!!!!!!!!!!!!!!!!!!!!!API Key:", BaseURL);


export default function EditorPage() {
    const editorInstance = useRef(null); // Holds a reference to EditorJS so no other instances spawn
    const [initialData, setInitialData] = useState({ blocks: [] }); // Initialize with empty data
    const [chapterData, setChapterData] = useState(null); // State to hold and drill down for chapter to be initialized
    const [recordIDs, setRecordIDs] = useState([]); // State to hold the recordID to be able to switch between chapters
    const [loading, setLoading] = useState(true); // State to hold if the loading is active or not
    const [error, setError] = useState(null); // State to hold the error on the initial state
    const [saving, setSaving] = useState(false); // State to hold a reference for the autosaving
    const [countdown, setCountdown] = useState(null); // State to hold a reference to the countdown for autosave
    const [timer, setTimer] = useState(null); // State to hold reference to timeout for autosave
    const [title, setTitle] = useState(null); // State to pull the title data and pull into the title field
    const [chapter, setChapter] = useState(null); // State to pull the chapter data and pull into the chapter field

// Grabs the chapter data and loads / sets the data for the chapters to be loaded.
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${BaseURL}/api/getsave`);
                console.log('Response status:', response.status);

                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }
                const data = await response.json();
                console.log('Response data:', data); // Log the response data for examination

                if (data.length > 0) {
                    const retrieveChapters = data.map(block => block);
                    setRecordIDs(retrieveChapters);
                    console.log('Loaded chapters:', retrieveChapters); // Log what you’re storing in recordIDs
                } else {
                    console.log('No valid data returned.'); // Handling case with no data
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

// Holds the imports and tools for editorJS
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

            // sets calls the initial data to be loaded empty but if saved to local stoarge then calls local storage save when refreshed to save users unsaved data
            if (!loading && (initialData || localStorage.getItem('editorData'))) {
                const savedData = localStorage.getItem('editorData');
                initializeEditor(savedData ? JSON.parse(savedData) : initialData);
            }
        }
        // Only initialize editor once loading is complete and the initial data is set
        return () => {
            if (editorInstance.current) {
                editorInstance.current.destroy();
                editorInstance.current = null;
            }
        };



    }, [loading, initialData]);

    // This useEffect only sets the initialData when chapterData is fetched
    useEffect(() => {
        if (chapterData) {
            setInitialData(chapterData);
            console.log("Getting ChapterData??????????????????", chapterData)
        }
    }, [chapterData]);



// Handles the save data for Local Stoarge 
    const handleSaveToLocal = () => {
        if (editorInstance.current) {
            editorInstance.current.save().then((data) => {
                setInitialData(data);
                localStorage.setItem('editorData', JSON.stringify(data));
                toast.success('Saved Locally!');
            }).catch((error) => {
                console.log('Saving failed:', error);
                toast.error('Error: Was Not Saved!');
            });
        }
    };
// Handles the data when the Publish button is pressed
    const handlePublish = async () => {
        if (editorInstance.current) {
            const data = await editorInstance.current.save();
            if (data && title && chapter) { // Ensure all fields are filled
                console.log('Publishing...', { data, title, chapter }); // Log the data
                try {
                    const response = await axios.post(`${BaseURL}/api/saveeditor`, {
                        body: data,
                        title: title,
                        chapter: chapter,
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
            } else {
                toast.error('Data incomplete: Ensure title and chapter are filled out.');
            }
        }
    };
// Retrieve the chapter and grabs the ID from the chapter selected
    const RetrieveChapter = async (ChapterID) => {
        if (ChapterID) {
            try {
                const response = await axios.post(`${BaseURL}/api/getchapter`, {
                    id: ChapterID,
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.status === 200) {
                    const chapterData = response.data;
                    setChapterData(chapterData.editor);  // Set new data to update editor
                    setTitle(chapterData.title);
                    setChapter(chapterData.chapter);
                    console.log("This is Chapter Data!!!!!!!!!!!!!!!!!", chapterData)
                    toast.success('Chapter Loaded!');
                } else {
                    toast.error('Error: Chapter was not loaded!');
                }
            } catch (error) {
                console.error('Error fetching chapter:', error);
                toast.error('Error: Chapter was not loaded!');
            }
        }
    };
// Used to refresh chapter that have been added or deleted without refreshing the entire page
    const RefreshChapter = async () => {

        const response = await fetch(`${BaseURL}/api/getsave`);
        console.log('Response status:', response.status);

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Response data:', data); // Log the response data for examination

        if (data.length > 0) {
            const retrieveChapters = data.map(block => block);
            setRecordIDs(retrieveChapters);
            console.log('Loaded chapters:', retrieveChapters); // Log what you’re storing in recordIDs
        } else {
            console.log('No valid data returned.'); // Handling case with no data
        }

    };

    // This useEffect handles the Debounce for keyboard to trigger autosaving to local stoarge
    useEffect(() => {
        const debounceDuration = 10000; // 10 seconds
        const countdownDuration = 10; // Total countdown seconds
        let countdownInterval;

        const handleKeyDown = () => {
            if (timer) {
                clearTimeout(timer);
                clearInterval(countdownInterval);
            }

            setCountdown(countdownDuration);
            setSaving(false);

            const newTimer = setTimeout(() => {
                setSaving(true);
                countdownInterval = setInterval(() => {
                    setCountdown(prev => {
                        if (prev <= 1) {
                            clearInterval(countdownInterval);
                            setSaving(false);
                            setCountdown(null); // Reset countdown
                            handleSaveToLocal(); // Call the function here when countdown finishes
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
            }, debounceDuration);

            setTimer(newTimer);
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            clearTimeout(timer);
            clearInterval(countdownInterval);
        };
    }, [timer]);

    const displayText = saving && countdown <= 5 ? `AutoSaving in ${countdown}...` : 'Save';



// Handles the loading when the page first launches
    if (loading) {
        return <div className='flex justify-center items-center h-screen text-2xl'>Loading...</div>;
    }
// Handles and displays the error if page can't be loaded
    if (error) {
        return <div className='flex justify-center items-center h-screen text-2xl'>Error loading data: {error.message}</div>;
    }


    return (
        <main className='grid grid-cols-[1fr_4fr_1fr]'>

            <aside className='w-full h-screen'>

                <h2 className="text-white text-center text-xl my-4 ">User Notes</h2>

                <div className="space-y-4">

                    <div className='bg-gray-800 p-4 h-60 rounded shadow'>
                        <p className='text-sm'>Save Button:</p>
                        <p className='text-sm' >The save button will only save document to local stoarge if the local stoarge is deleted you will lose your saved data it is only ment for if you need to step a way and wanted to come back in a short amount of time but as long as your local stoarge is not deleted it can stay there for a long time it does not expire</p>
                    </div>

                    <div className='bg-gray-800 p-4 rounded shadow'>
                        <p className='text-sm' >Publish Button:</p>
                        <p className='text-sm' >The Publish button saves to a Database can cant be deleted yet. But currently I have made a way yet for you to retirve work that has been published time so it can only be used once I know pretty usless that why there is a save button but eventually the publish button will work just like its suppost to where you can call back different chapters and edit them and publish them again just not right now </p>
                    </div>

                </div>

            </aside>

{/* Second Section ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}

            <div>
                <div className='flex justify-end pr-14 pt-10'>
                    <div className='pr-5'>
                        <button onClick={handleSaveToLocal} className='bg-sky-400 rounded-lg text-black p-2 px-5 hover:bg-sky-600'>
                            <div>
                                <p className='flex justify-center'>
                                    {displayText}
                                </p>
                            </div>
                        </button>
                    </div>
                    <button onClick={handlePublish} className='bg-sky-400 rounded-lg text-black p-2 px-5 hover:bg-sky-600' >Publish</button>
                </div>


                <h1 className='flex justify-center text-3xl pt-8 text-white'>Editor - Experimental</h1>
                <p className='flex justify-center pb-8 px-4 text-white text-center'>Currently a work in progress and does not include all features planned to be added. You can save it to your Browser but if you delete your brower history that information will be lost</p>
                <p className='flex justify-center pb-8 px-4 text-white text-center'>ALL DATA WILL BE DELETED AS I AM STILL WORKING ON THE SCHEMA AND ON THE DATABASE SO USE AT YOUR OWN RISK!</p>

                <div className='flex justify-center pb-8 '>
                    <div className='w-1/2'>
                        <input type="text" placeholder='Enter Title...' onChange={(e) => setTitle(e.target.value)} value={title || ""} className='h-10 w-11/12 text-black text-center' />
                    </div>
                    <div className=''>
                        <input type="text" placeholder='Enter Chapter...' onChange={(e) => setChapter(e.target.value)} value={chapter || ""} className='h-10 text-black text-center ' />

                    </div>
                </div>

                <div className='flex justify-center pb-20'>
                    <div className='flex justify-center mx-10 w-2/3'>
                        <div id='editorjs' className='text-black bg-gray-200 pt-5 p-10 w-full' />
                    </div>
                </div>
            </div>

{/* Third Section ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}

            <aside className='w-full h-screen'>
                <h2 className='text-center my-5 text-xl'>Chapters</h2>

                <div className='p-4 rounded shadow bg-gray-800'>
                    {recordIDs.map((records, index) => (
                        <main key={index}>
                            <div className='w-full h-1/5 text-center py-5'>
                                <p className='text-sm'>Title</p>
                                <p className='text-sm pb-2'>{records.title}</p>
                                <p className='text-sm '>Chapter</p>
                                <p className='text-sm pb-2'>{records.chapter}</p>
                                <div className='pt-5'>
                                    <button onClick={() => RetrieveChapter(records.xata_id)} className='bg-sky-400 w-1/2 h-1/4 rounded-lg hover:bg-sky-600 text-black p-2'>Load Chapter</button>
                                </div>
                            </div>

                        </main>
                    ))}
                </div>

                <div className='flex justify-center py-5'>
                    <button onClick={RefreshChapter} className='bg-sky-400 rounded-lg hover:bg-sky-600 text-black p-2'>Refresh Chapters</button>
                </div>

            </aside>
        </main>
    );
}