import React from 'react';
import {
    Box,
    Flex,
    HStack,
    Link,
    Button,
    useColorModeValue,
    IconButton,
    Stack,
    useDisclosure,
    useBreakpointValue,
    Heading
} from '@chakra-ui/react';
import {
    HamburgerIcon, CloseIcon, AddIcon, SettingsIcon
} from '@chakra-ui/icons';

import { matchPath, useLocation, Link as RouterLink } from 'react-router-dom';

function NavLink({ path, children, display }) {
    const { pathname } = useLocation();

    const bg = useColorModeValue('gray.200', 'gray.700');

    const pathMatches = matchPath(pathname, path);

    return (
        <Link
            as={RouterLink}
            to={path}
            px={2}
            py={1}
            rounded="md"
            _hover={{
                textDecoration: 'none',
                bg
            }}
            bg={pathMatches ? bg : ''}
            display={display}
            // boxShadow={"0 1px 10px 0 white"}
        >
            {children}
        </Link>
    );
}

export default function NavBar() {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const showHamburger = useBreakpointValue({ base: true, md: false });

    return (
        <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
            <Flex h={16} alignItems="center" justifyContent="space-between">
                {/* Left Side Nav */}
                {showHamburger && (
                    <IconButton
                        size="md"
                        icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                        aria-label="Open Menu"
                        display={{ md: 'none' }}
                        onClick={isOpen ? onClose : onOpen}
                    />
                )}
                <HStack spacing={8} alignItems="center">
                    <Heading fontSize="1.5em">Notes App</Heading>
                    <HStack as="nav" spacing={4} display={{ base: 'none', md: 'flex' }}>
                        <NavLink path="/">My Notes</NavLink>
                    </HStack>
                </HStack>

                {/* Right Side Buttons */}
                <Flex alignItems="center">
                    <RouterLink to="/add">
                        <Button variant="solid" colorScheme="green" size="sm" leftIcon={<AddIcon />}>
                                Add Note
                        </Button>
                    </RouterLink>

                    <RouterLink to="/settings">
                        <IconButton
                            size="md"
                            display={{ md: 'block', base: 'none' }}
                            variant="solid"
                            mr={4}
                            ml={4}
                            icon={<SettingsIcon />}
                        />
                    </RouterLink>
                </Flex>
            </Flex>

            {isOpen ? (
                <Box pb={4} display={{ md: 'none' }}>
                    <Stack as="nav" spacing={4}>
                        <NavLink path="/">My Notes</NavLink>
                        <NavLink path="/settings" display={{ md: 'none' }}>
                                Settings
                        </NavLink>
                    </Stack>
                </Box>
            ) : null}
        </Box>
    );
}
