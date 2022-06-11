import { getMyWindowVariable } from "../_helper/helper";


function showAlert(message = "") {
    if((window as any).my === undefined){
        window.alert(message);
    }
    else{
        getMyWindowVariable().showSnackBar(message, "info");
    }
}

function showError(message = "") {
    if((window as any).my === undefined){
        window.alert(message);
    }
    else{
        getMyWindowVariable().showSnackBar(message, "error");
    }
}

function showSuccess(message = "") {
    if((window as any).my === undefined){
        window.alert(message);
    }
    else{
        getMyWindowVariable().showSnackBar(message, "success");
    }
}

function showConfirm(message?: string, txtAccept = "OK", txtCancel = "Cancel") {
    return window.confirm(message);
}


export const DialogHelper = {
    showAlert,
    showError,
    showConfirm,
    showSuccess,
}