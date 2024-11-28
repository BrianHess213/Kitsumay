import { defineType } from 'sanity'

export const editorType = defineType({

    name: 'editor',
    type: 'document',
    title: 'Editor',
    fields: [
        {
            name: 'title',
            type: 'string',
            title: 'Title'
        },
        {
            name: 'slug',
            type: 'slug',
            title: 'Slug',
            options: {
                source: 'title',
                maxLength: 200,
            }
        },
        {
            name: 'mainImage',
            type: 'image',
            title: 'Main Image'
        },
        {
            name: 'body',
            type: 'array',
            title: 'Body',
            of: [
                {
                    type: 'object',
                    name: 'test',
                    fields: [
                        {
                            name: 'chapterTitle',
                            type: 'string',
                            title: 'Chapter Title'
                        },
                        {
                            name: 'editorContent',
                            type: 'object', // or type 'json'
                            title: 'Editor Content',
                            fields: [

                                {
                                    name: 'type',
                                    type: 'string',
                                    title: 'Type',
                                },
                                {
                                    name: 'data',
                                    type: 'object',
                                    title: 'Data',
                                    fields: [
                                        {
                                            name: 'text',
                                            type: 'string',
                                            title: 'Text',
                                        },
                                    ],
                                },


                            ],
                            // inside of these field you need to define what is editorjs going to be sending 
                            // You might need a custom input component if using a complex structure
                        },
                    ],
                }
            ],
        }
    ]
})
