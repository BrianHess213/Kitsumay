import { getXataClient } from "@/src/xata";
const xata = getXataClient();

export async function POST(request) {
  try {
    const requestData = await request.json();
    console.log('Request Data:', requestData); // Debug log for incoming data

    const { body, title, chapter } = requestData;
    
    const record = await xata.db.book.create({
      editor: body,
      title: title,
      chapter: chapter,
    });

    console.log('Created Record:', record);
    return new Response(JSON.stringify({ message: 'Post Request Successful' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error handling request:', error);
    return new Response(JSON.stringify({ message: 'Error handling request' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}