import { Button, ButtonProps } from "@mui/material";
import { FC } from "react";
import { customShadows } from "../../theme/shadows";

export const CommonButton: FC<ButtonProps> = (props) => {
    const propsWithSx = {
        ...props,
        sx: {
            boxShadow: "none",
            transition: "box-shadow 0s ease-in-out",
            '&:hover': {
                boxShadow: customShadows.z8,
            },
            ...props.sx,
        },
    };
    return <Button
        variant="contained"
        {...propsWithSx}
    >

    </Button>
}