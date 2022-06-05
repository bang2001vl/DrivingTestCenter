import { Avatar, Box, Button, Stack } from "@mui/material";
import { FC, useRef, useState } from "react";
import { MyThumb } from "./myThumb";

interface IProps {
    avtURL: File | string | null;
    width?:number,
    height?:number,
}
export const AvatarUpload: FC<IProps> = (props) => {
    const [avatarImage, setAvatarImage] = useState<File | string | null>(props.avtURL);
    const avatarInputRef = useRef(null);
    return <Stack style={{ width: (props.width===undefined)? 150 : props.width}}>
        <Avatar sx={{ width: (props.width===undefined)? 150 : props.width, height: (props.height===undefined)? 150 : props.height }}>
            <MyThumb file={avatarImage} width={(props.width===undefined)? 150 : props.width} height={(props.height===undefined)? 150 : props.height}></MyThumb>
        </Avatar>
        <Button
            variant="contained"
            style={{marginTop: 20, marginLeft: 10, marginRight: 10 }}
            onClick={(ev) => {
                ev.preventDefault();
                (avatarInputRef.current as any).click();
            }}
        >Tải ảnh lên</Button>
        <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(ev) => {
                if (ev.currentTarget.files === null) {
                    //setAvatarImage(null);
                    return;
                }
                if (ev.currentTarget.files[0]) {
                    const file = ev.currentTarget.files[0];
                    // if (file.size > 1048576) {
                    //     // Not accept file bigger than 1MB
                    //     window.alert("Not accept file bigger than 1MB");
                    //     return;
                    // }
                    setAvatarImage(ev.currentTarget.files[0]);
                }
            }}
        ></input>

    </Stack>
}