import { NextRequest, NextResponse } from 'next/server'; // Import from 'next/server' in the app directory context
import { getXataClient } from '@/src/xata'; // Adjust this path based on your project structure

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: NextRequest) {
    try {
        // Initialize the Xata client
        const xata = getXataClient();

        // Fetch data from your desired table or collection
        const data = await xata.db.book.getAll(); // Adjust with your specific query

        // Return the data with a status of 200
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        // Log the error
        console.error('Error fetching data from XataDB:', error);

        // Return a 500 status with error details
        return NextResponse.json({ message: 'Failed to load data', error }, { status: 500 });
    }
}