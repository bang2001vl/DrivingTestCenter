import { LoadingButton as LoadingButtonMUI, LoadingButtonProps as LoadingButtonPropsMUI } from "@mui/lab";
import { FC } from "react";
import { customShadows } from "../../theme/shadows";

export const LoadingButton: FC<LoadingButtonPropsMUI> = (props) => {
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
    return <LoadingButtonMUI
        variant="contained"
        {...propsWithSx}
    >

    </LoadingButtonMUI>
}