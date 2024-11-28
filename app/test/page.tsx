import { getXataClient } from '@/src/xata';

const xata = getXataClient();

export default async function Home() {
  const post = await xata.db.book.getAll();

  console.log(post[0].editor.blocks)

  return (
    <main className='pt-20'>
        <h1 className='text-white text-center'>Title</h1> <br />
        <p className='text-center text-white'>{post[0].editor.blocks[0].id}</p>
    </main>
  );
}