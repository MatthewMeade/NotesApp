import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Box,
    Button
} from '@chakra-ui/react';
import React from 'react';

export default function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    body,
    confirmButton: { label, icon, color } = { label: 'Confirm' },
    cancelButton: { label: clabel, icon: cicon, color: ccolor } = { label: 'Cancel' }
}) {
    const cancelRef = React.useRef();

    let _body = body;
    if (Array.isArray(body) && typeof body[0] === 'string') {
        _body = body.map((s) => <Box key={s} mb={5}>{s}</Box>);
    }

    return (
        <AlertDialog isOpen={isOpen} onClose={onClose} leastDestructiveRef={cancelRef}>
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                        {title}
                    </AlertDialogHeader>
                    <AlertDialogBody>{_body}</AlertDialogBody>
                    <AlertDialogFooter>
                        <Button leftIcon={cicon} onClick={onClose} colorScheme={ccolor}>
                            {clabel}
                        </Button>

                        <Button leftIcon={icon} colorScheme={color} onClick={onConfirm} ml={3}>
                            {label}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    );
}
