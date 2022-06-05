import { Avatar, Box, Button, Stack } from "@mui/material";
import { FC, useRef, useState } from "react";
import { MyThumb } from "./myThumb";

export interface AvatarUploadProps {
    defaultValue?: string;
    value?: File | string;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    width?: number,
    height?: number,
}
export const AvatarUpload: FC<AvatarUploadProps> = (props) => {
    const avatarInputRef = useRef(null);
    return <Stack style={{ width: (props.width === undefined) ? 150 : props.width }}>
        <Avatar sx={{ width: (props.width === undefined) ? 150 : props.width, height: (props.height === undefined) ? 150 : props.height }}>
            <MyThumb file={props.value ? props.value : props.defaultValue} width={(props.width === undefined) ? 150 : props.width} height={(props.height === undefined) ? 150 : props.height}></MyThumb>
        </Avatar>
        <Button
            variant="contained"
            style={{ marginTop: 20, marginLeft: 10, marginRight: 10 }}
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
            onChange={props.onChange}
        ></input>

    </Stack>
}