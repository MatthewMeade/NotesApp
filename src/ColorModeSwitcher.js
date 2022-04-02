import React from 'react';
import { useColorMode, useColorModeValue, IconButton } from '@chakra-ui/react';
import { FaMoon, FaSun } from 'react-icons/fa';

export default function ColorModeSwitcher(props) {
    const { toggleColorMode } = useColorMode();
    const text = useColorModeValue("light", "light");
    const SwitchIcon = useColorModeValue(FaSun, FaMoon);
    console.log({ text });

    return (
        <IconButton
            size="md"
            fontSize="lg"
            aria-label={`Switch to ${text} mode`}
            variant="ghost"
            color="current"
            marginLeft="2"
            onClick={toggleColorMode}
            icon={<SwitchIcon />}
            {...props}
        />
    );
};
