import { PortableText, type SanityDocument } from "next-sanity";
import imageUrlBuilder from '@sanity/image-url'
import { client } from "@/sanity/lib/client";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import Link from "next/link";
import Image from "next/image";


const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]`;

const builder = imageUrlBuilder(client)

function urlFor(source: SanityImageSource) {
    return builder.image(source)
}


export default async function PostPage(
    props: {
        params: Promise<{ slug: string }>;
    }
) {
    const params = await props.params;
    const post = await client.fetch<SanityDocument>(POST_QUERY, params);


    const ImageComponent = ({ value }) => {
        if (!value || !value.asset) {
          return null; // If no image asset, render nothing or a placeholder
        }
        return (
          <Image
            src={urlFor(value).url()}
            width={800}
            height={800}
            alt={value.alt || 'An image on the blog page'}
            loading="lazy"
          />
        );
      };

    return (
        <main className="container mx-auto min-h-screen max-w-3xl p-8 flex flex-col gap-4">
            <Link href="/" className="hover:underline">
                ← Back to posts
            </Link>

            <h1 id="blog" className="text-4xl font-bold mb-8">{post.title}</h1>
            <div className="prose">
                <p>Published: {new Date(post.publishedAt).toLocaleDateString()}</p>
                {Array.isArray(post.body) && <PortableText value={post.body} components={{ types: { image: ImageComponent, }, }} />}
            </div>
        </main>
    );
}