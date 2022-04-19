import { Dialog, DialogTitle } from "@mui/material"
import { atom, selector, useRecoilState } from "recoil"

const isOpenAtom = atom({
    key:"rootDialog_isOpen",
    default: false,
});

const handleCloseAtom = atom<any>({
    key:"rootDialog_handleClose",
    default: ()=>{},
});

const titleAtom = atom({
    key:"rootDialog_title",
    default: "Dialog Title",
});

const childrenElementAtom = atom({
    key:"rootDialog_childrenElement",
    default: <></>,
});

export const rootDialogSelector = selector({
    key:"rootDialog_selector",
    get: ({get})=>{
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
let handleClose: any = ()=>{
    console.log("Default handle close");
}
let children = <></>;

export const useRootDialog = ()=>{
    const [isOpen, setIsOpen] = useRecoilState(isOpenAtom);
    const [title, setTitle] = useRecoilState(titleAtom);
    // const [handleClose, setHandleClose] = useRecoilState(handleCloseAtom);
    const [childrenElement, setChildrenElement] = useRecoilState(childrenElementAtom);
    return {
        openDialog(props: IProps){
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
            setTitle(props.title);
            setChildrenElement(props.children);
            console.log(props);
            
            if(!props.handleClose){
                handleClose = (ev: any, reason: any)=>{
                    setIsOpen(false);
                };
            }
            else{
                handleClose = props.handleClose;
            }
            
            setIsOpen(true);
            return setIsOpen;
        }
    } 
}

interface IProps {
    children: JSX.Element,
    title: string,
    open: boolean,
    handleClose?: ((event: {}, reason: "backdropClick" | "escapeKeyDown") => void),
}

export const DialogLayout = (props: IProps) => {
    return (
        <Dialog onClose={props.handleClose} open={props.open} >
            <DialogTitle>{props.title}</DialogTitle>
            {props.children}
        </Dialog>
    )
}