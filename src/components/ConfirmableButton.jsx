import { Button, useDisclosure } from "@chakra-ui/react";
import React from "react";
import ConfirmDialog from "./ConfirmDialog";

export default function ConfirmableButton({ title, body, button: { icon, label, color }, onConfirm }) {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const _onConfirm = () => {
        onClose();
        onConfirm();
    };

    return (
        <>
            <ConfirmDialog
                isOpen={isOpen}
                onClose={onClose}
                title={title}
                body={body}
                onConfirm={_onConfirm}
                confirmButton={{ icon, label, color }}
            />
            <Button leftIcon={icon} onClick={onOpen} colorScheme={color}>
                {label}
            </Button>
        </>
    );
}
