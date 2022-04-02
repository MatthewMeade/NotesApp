import React from "react";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

import NoteForm from "./components/NoteForm";
import Note from "./components/Note";
import NotesList from "./components/NotesList";
import NavBar from "./components/NavBar";
import Settings from "./components/Settings";
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";

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
        <Router>
            <ChakraProvider theme={theme}>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<NotesList />} />
                        <Route path="add" element={<NoteForm />} />
                        <Route path="settings" element={<Settings />} />
                        <Route path="note/:id" element={<Note controlType="page" />} />
                        <Route path="note/:id/edit" element={<NoteForm />} />
                    </Route>
                </Routes>
            </ChakraProvider>
        </Router>
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
