import { getXataClient } from "@/src/xata";
const xata = getXataClient();

export async function POST(request) {
  try {
    const requestData = await request.json();

    const { body, title, chapter, id } = requestData;

    const getRecord = await xata.db.books.read(id);

    if (id === getRecord?.id && title === getRecord?.title && chapter === getRecord?.chapter && body !== getRecord?.editor){

      await xata.db.books.update(id, {
        editor: body,
        title: title,
        chapter: chapter,
      });

      return new Response(JSON.stringify({message: "Article Updated!", action: "updated"}), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });

    }else if (id === getRecord?.id && title === getRecord?.title && chapter === getRecord?.chapter && body === getRecord?.editor){

      return new Response(JSON.stringify({message: "Nothing to update!", action: "exist"}), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });

    }else{

      await xata.db.books.create({
        editor: body,
        title: title,
        chapter: chapter,
      });

      return new Response(JSON.stringify({message: "Article Created!", action: "created"}), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

  } catch (error) {
    console.error('Error handling request:', error);
    return new Response(JSON.stringify({ message: 'Error handling request' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}