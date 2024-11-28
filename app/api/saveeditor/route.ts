import { getXataClient } from "@/src/xata";

const xata = getXataClient();



export async function POST(request: Request) {

    const body = await request.json();
    console.log('body', body);

const record = await xata.db.book.create({
  xata_id: "id-321",
  editor: body,
});
console.log(record);


    return Response.json({ message: 'Post Request Successful' });

}