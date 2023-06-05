import Image from "next/legacy/image";
import { useState } from "react";

const BlurImage = (
  props: {
    style: string,
    width: number,
    height: number,
    srcImage: string,
    title: string,
  }
) => {
  const shimmer = (w: number, h: number) => `
    <svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <defs>
        <linearGradient id="g">
          <stop stop-color="#333" offset="20%" />
          <stop stop-color="#222" offset="50%" />
          <stop stop-color="#333" offset="70%" />
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="#333" />
      <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
      <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
    </svg>`

  const toBase64 = (str: string) =>
    typeof window === 'undefined'
      ? Buffer.from(str).toString('base64')
      : window.btoa(str)

  const [loaded, setLoaded] = useState(false);

  return <Image
            className={`object-cover ${props.style} ${loaded ? 'ublur' : ''}`}
            width={props.width}
            height={props.height}
            loading="lazy"
            placeholder="blur"
            blurDataURL={`data:image/svg+xml;base64, ${loaded ? toBase64(shimmer(props.width, props.height)) : ''}`}
            // blurDataURL={props.srcImage}
            src={props.srcImage}
            alt={props.title}
            onLoadingComplete={() => setLoaded(true)}
          />
};

export default BlurImage;
