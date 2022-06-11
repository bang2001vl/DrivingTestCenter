import { Alert, AlertColor, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AccountSingleton } from "../singleton/account";

export default function FirstLaunch() {
    const navigate = useNavigate();
    const [alert, setAlert] = useState("");
    const [isOpenAlert, setIsOpenAlert] = useState(false);
    const [alertColor, setAlertColor] = useState<AlertColor | undefined>();

    useEffect(() => {
        if (!AccountSingleton.instance.isLogined) {
            navigate("/login");
        }

        (window as any).my = {
            ...(window as any).my,
            showSnackBar: (content: string, corlor?: AlertColor) => {
                setAlert(content);
                setAlertColor(corlor);
                setIsOpenAlert(true);
            }
        }
    }, []);

    return <div>
        <Snackbar
            open={isOpenAlert}
            autoHideDuration={2 * 1000}
            onClose={() => setIsOpenAlert(false)}

            sx={{ height: "100%" }}
            anchorOrigin={{
                vertical: "top",
                horizontal: "center"
            }}
        >
            <Alert severity={alertColor}>{alert}</Alert>
        </Snackbar>
    </div>;
}