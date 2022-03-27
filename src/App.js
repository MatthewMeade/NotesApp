import React from "react";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

import AddNote from "./components/AddNote";
import QueryNotes from "./components/QueryNotes";

const config = {
    initialColorMode: "dark",
    useSystemColorMode: false,
};
const theme = extendTheme({ config });

function App() {
    return (
        <ChakraProvider theme={theme}>
            {/* <ColorModeSwitcher /> */}
            <AddNote />

            <br />
            <br />
            <hr />
            <br />
            <h1>Query Notes:</h1>

            <QueryNotes />
        </ChakraProvider>
    );
}

export default App;
