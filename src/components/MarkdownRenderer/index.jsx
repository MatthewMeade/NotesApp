import React from 'react';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ChakraUIRenderer from 'chakra-ui-markdown-renderer';

import { Link } from '@chakra-ui/react';

const markdownTheme = {
    a: ({ children, href }) => (
        <Link color="teal.500" href={href}>
            {children}
        </Link>
    )
};
export default function MarkdownRenderer({ text }) {
    return (
        <ReactMarkdown components={ChakraUIRenderer(markdownTheme)} remarkPlugins={[remarkGfm]}>
            {text}
        </ReactMarkdown>
    );
}
