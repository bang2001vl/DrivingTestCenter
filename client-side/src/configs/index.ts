export let appConfig = {
    lang: "vi",
    device: "desktop",
    dvhcvnUri: "https://raw.githubusercontent.com/daohoangson/dvhcvn/master/data/dvhcvn.json",
    defaultImageURI: "/static/mock-images/avatars/avatar_default.jpg",
    //backendUri: "http://10.0.21.250:5000",
    //backendUri: "http://localhost:5000",
    backendUri: process.env.REACT_APP_SERVER_URL || "http://thunderv.southeastasia.cloudapp.azure.com",
}