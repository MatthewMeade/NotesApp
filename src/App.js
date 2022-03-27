import React from "react";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

import { BrowserRouter } from "react-router-dom";

import AddNote from "./components/AddNote";
import QueryNotes from "./components/QueryNotes";
import NavBar from "./components/NavBar";
import Settings from "./components/Settings";
import { BrowserRouter as Router, Routes, Route, Link, Outlet } from "react-router-dom";

const theme = extendTheme({
    config: {
        initialColorMode: "dark",
        useSystemColorMode: false,
    },
    fonts: {
        heading: "Courier New, sans-serif",
        body: "Courier New, sans-serif",
    },
});

function App() {
    return (
        <BrowserRouter>
            <ChakraProvider theme={theme}>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<QueryNotes />} />
                        <Route path="add" element={<AddNote />} />
                        <Route path="settings" element={<Settings />} />
                    </Route>
                </Routes>
            </ChakraProvider>
        </BrowserRouter>
    );
}

const Layout = () => {
    return (
        <div>
            <NavBar />
            <Outlet />
        </div>
    );
};

export default App;
