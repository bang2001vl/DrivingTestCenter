function showAlert(message: string){
    window.alert(message);
}

function showConfirm(message: string, txtAccept = "OK", txtCancel = "Cancel"){
    return window.confirm(message);
}

export const DialogHelper = {
    showAlert,
    showConfirm,
}