import { getXataClient } from "@/src/xata";
const xata = getXataClient();

export async function POST(request) {
  try {
    const { id } = await request.json(); // Destructure id from parsed JSON
    const record = await xata.db.book.read(id); // Fetch the record using the id
    console.log('Fetched Record:', record);

    return new Response(JSON.stringify(record), {  // Return the record
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error fetching record:', error);
    return new Response(JSON.stringify({error: 'Error fetching record'}), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}