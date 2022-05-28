import React, { useEffect, useState } from 'react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

import {
    BrowserRouter as Router, Routes, Route, Outlet
} from 'react-router-dom';
import NoteForm from './components/NoteForm';
import Note from './components/Note';
import NotesList from './components/NotesList';
import NavBar from './components/NavBar';
import Settings from './components/Settings';
import ConfirmDialog from './components/ConfirmDialog';
import { populateDB } from './util/populateDB';

const SEED_DB_FLAG = 'PROMPTED_SEED_DB';

const theme = extendTheme({
    config: {
        initialColorMode: 'dark',
        useSystemColorMode: false
    },
    fonts: {
        heading: 'Courier New, sans-serif',
        body: 'Courier New, sans-serif'
    }
});

function App() {
    const [showSeedPrompt, setShowSeedPrompt] = useState(false);
    useEffect(() => {
        if (!localStorage.getItem(SEED_DB_FLAG)) {
            localStorage.setItem(SEED_DB_FLAG, true);
            setShowSeedPrompt(true);
        }
    }, []);

    return (
        <Router>
            <ChakraProvider theme={theme}>
                <ConfirmDialog
                    isOpen={showSeedPrompt}
                    onClose={() => setShowSeedPrompt(false)}
                    title="Seed Database?"
                    body={[
                        'This is your first time loading the app, would you like to populate it with some sample data?',
                        'You can clear the sample data later in the settings menu'
                    ]}
                    onConfirm={() => { populateDB(true); setShowSeedPrompt(false); }}
                    confirmButton={{ label: 'Yes!' }}
                    cancelButton={{ label: 'No!' }}
                />
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

function Layout() {
    return (
        <div>
            <NavBar />
            <Outlet />
        </div>
    );
}

export default App;
