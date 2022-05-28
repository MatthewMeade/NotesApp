/* eslint-disable react/no-unstable-nested-components */
import React from 'react';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ChakraUIRenderer from 'chakra-ui-markdown-renderer';

import { Image, Link } from '@chakra-ui/react';

export default function MarkdownRenderer({ text, imageMap = {} }) {
    const markdownTheme = {
        a: ({ children, href }) => (
            <Link color="teal.500" href={href}>
                {children}
            </Link>
        ),
        img: ({ src }) => {
            let _src = src;
            if (imageMap[src]) {
                _src = URL.createObjectURL(imageMap[src].data);
            }

            return <Image src={_src} alt={src} m={10} maxWidth="75%" margin="0 auto" />;
        }
    };

    return (
        <ReactMarkdown components={ChakraUIRenderer(markdownTheme)} remarkPlugins={[remarkGfm]}>
            {text}
        </ReactMarkdown>
    );
}
