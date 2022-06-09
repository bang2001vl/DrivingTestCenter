import { Box, Stack, Typography } from '@mui/material';
import React, { useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import Card from '../../theme/overrides/Card';
import { CommonButton } from '../Buttons/common';

interface IProps {
    title?: string,
    templateURI?: string,
    onSubmit?: (values: File[]) => void,
}

export function ExcelPicker(props: IProps) {
    const { getRootProps, getInputProps } = useDropzone({
        maxFiles: 1,
        onDropAccepted: (file)=>{
            if(props.onSubmit){
                props.onSubmit(file);
            }
        }
    });

    const aRef = useRef<any>(null);

    return (
        <Stack alignItems={"center"} spacing={2}>
            {/* <Typography variant="h3" gutterBottom style={{ color: "#3C557A" }}>
                {props.title}
            </Typography> */}
            <Stack {...getRootProps()} style={{minWidth: 400, minHeight: 80, border: "dashed green", justifyContent: "center", alignItems: "center"}}>
                    <input {...getInputProps()} />
                    <label style={{alignSelf: "center"}}>
                        Kéo thả tập tin hoặc nhấn vào để chọn
                    </label>
            </Stack>
            <p>Hoặc</p>
            <a ref={aRef} href={props.templateURI} download={true} style={{display: "none"}}></a>
            <CommonButton
                    sx={{ width: "45%" }}
                    onClick={()=>{
                        aRef.current.click();
                    }}
                >
                    Tải mẫu
                </CommonButton>
            {/* <Stack direction="row" justifyContent={"space-between"} style={{ fontSize: 14, marginTop: "20px", marginBottom: "10px" }}>
                <CommonButton
                    sx={{ width: "45%" }}
                    onClick={() => {
                        if (props.onDownloadTemplate) {
                            props.onDownloadTemplate();
                        }
                    }}
                >
                    Tải mẫu
                </CommonButton>
                <CommonButton
                    sx={{ width: "45%" }}
                    onClick={() => {
                        if (props.onSubmit) {
                            props.onSubmit(acceptedFiles);
                        }
                    }}
                >
                    Xác nhận
                </CommonButton>
                <CommonButton
                    sx={{ width: "45%" }}
                    onClick={() => {
                        if (props.onClose) {
                            props.onClose();
                        }
                    }}
                >
                    Hủy
                </CommonButton>
            </Stack> */}
        </Stack>
    );
}