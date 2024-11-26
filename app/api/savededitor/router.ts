



export async function POST(request: Request) {

  

    const body = await request.json();
    console.log('body', body);
    console.log('Your data has been saved!!')
    

   
    return Response.json({ message: 'Artical Saved Successfully'});

}