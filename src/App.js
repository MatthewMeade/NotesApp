import React from "react";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

import { BrowserRouter } from "react-router-dom";

import NoteForm from "./components/NoteForm";
import NotesList from "./components/NotesList";
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
                        <Route index element={<NotesList />} />
                        <Route path="add" element={<NoteForm />} />
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
