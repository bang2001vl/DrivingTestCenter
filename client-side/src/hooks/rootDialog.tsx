import { DialogContent } from "@material-ui/core";
import { Box, Container, Dialog, DialogTitle, Stack } from "@mui/material"
import { propsToClassKey } from "@mui/styles";
import React from "react";
import { atom, selector, useRecoilState, useSetRecoilState } from "recoil"

const isOpenAtom = atom({
    key: "rootDialog_isOpen",
    default: false,
});

const handleCloseAtom = atom<any>({
    key: "rootDialog_handleClose",
    default: () => { },
});

const titleAtom = atom({
    key: "rootDialog_title",
    default: <></>,
});

const childrenElementAtom = atom({
    key: "rootDialog_childrenElement",
    default: <></>,
});

export const rootDialogSelector = selector({
    key: "rootDialog_selector",
    get: ({ get }) => {
        const isOpen = get(isOpenAtom);
        const title = get(titleAtom);
        // const handleClose = get(handleCloseAtom);
        const children = get(childrenElementAtom);
        console.log({
            isOpen,
            title,
            handleClose,
            children,
        });

        return <DialogLayout
            open={isOpen}
            title={title}
            handleClose={handleClose}
            children={children}
        />
    }
});

let title = "Dialog Title";
let handleClose: any = () => {
    console.log("Default handle close");
}
let children = <></>;

export const useRootDialog = () => {
    const [isOpen, setIsOpen] = useRecoilState(isOpenAtom);
    const [title, setTitle] = useRecoilState(titleAtom);
    // const [handleClose, setHandleClose] = useRecoilState(handleCloseAtom);
    const [childrenElement, setChildrenElement] = useRecoilState(childrenElementAtom);
    return {
        openDialog(props: { children: JSX.Element, title?: JSX.Element, handleClose?: (event: {}, reason: "backdropClick" | "escapeKeyDown") => void }) {
            // title = props.title;
            // children = props.children;
            // if(!props.handleClose){
            //     handleClose = (ev: any, reason: any)=>{
            //         setIsOpen(false);
            //     };
            // }
            // else{
            //     handleClose = props.handleClose;
            // }
            setTitle(props.title ? props.title : <></>);
            setChildrenElement(props.children);
            //console.log(props);

            handleClose = (ev: any, reason: any) => {
                setIsOpen(false);
                if (props.handleClose) {
                    props.handleClose(ev, reason);
                }
            }

            setIsOpen(true);
            return setIsOpen;
        },
        closeDialog(needDispose = true) {
            setChildrenElement(<></>);
            setIsOpen(false);
        }
    }
}

interface IProps {
    children: JSX.Element,
    title: JSX.Element,
    open: boolean,
    handleClose?: (event: {}, reason: "backdropClick" | "escapeKeyDown") => void,
}

export const DialogLayout: React.FC<IProps> = (props) => {
    return (
        <Dialog
            onClose={props.handleClose} open={props.open}
            PaperProps={{ style: { overflowY: 'visible' } }}
        >
            {/* <DialogTitle>
                <Stack>
                    <Box alignSelf={"center"}>
                        {props.title}
                    </Box>
                </Stack>
            </DialogTitle> */}

            <DialogContent
                style={{ overflowY: 'visible' }}
            >
                {props.children}
            </DialogContent>
        </Dialog>
    )
}