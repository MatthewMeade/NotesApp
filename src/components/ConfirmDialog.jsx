import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button,
} from "@chakra-ui/react";
import React from "react";

export default function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    body,
    confirmButton: { label, icon, color } = { label: "Confirm" },
}) {
    const cancelRef = React.useRef();

    return (
        <AlertDialog isOpen={isOpen} onClose={onClose} leastDestructiveRef={cancelRef}>
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                        {title}
                    </AlertDialogHeader>
                    <AlertDialogBody>{body}</AlertDialogBody>
                    <AlertDialogFooter>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button leftIcon={icon} colorScheme={color} onClick={onConfirm} ml={3}>
                            {label}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    );
}
