async function getRequest() {
    const response = await fetch("https://sheets.googleapis.com/v4/spreadsheets/1YRdXAFa6MZ1dISxv5R_6nWHoJhtKyYKtpPVkSuibo28/batchUpdate", {
        method: "POST",
        mode: "cors",
        headers: {
            Authorization: "Bearer",
            "content-type": "application/json"
        }
    });
    const jsonResponse = await response.json();

    console.log(JSON.stringify(jsonResponse));
}