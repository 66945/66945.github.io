const accountNames = [
    "Personal Checking",
    "Savings",
    "MasterCard AAP9",
    "Military Retirement Funds",
    "U.S. War Bonds V 1973",
    "American Express Card"
];

const descriptions = [
    "Netflix",
    "Amazon Delivery",
    "Student Loans",
    "YouTube Premium",
    "WinRar"
];

let accounts = [];

let transactions = [];

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generateAccount(name) {
    let account = [name];
    account.push("****" + Math.floor(Math.random() * (9999 - 1000) + 1000));
    
    let money = "$";
    money += Math.floor(Math.random() * (10000 - 100) + 100);
    money += ".";
    money += Math.floor(Math.random() * (99 - 10) + 10);

    account.push(money);

    return account;
}

function generateTransaction(description) {
    let transaction = [];

    transaction.push(randomDate(new Date(2020, 0, 1), new Date()).toDateString());

    transaction.push(accounts[Math.floor(Math.random() * accounts.length)][1]);

    transaction.push(description);
    
    let money = "-$";
    money += Math.floor(Math.random() * (99 - 10) + 10);
    money += ".";
    money += Math.floor(Math.random() * (99 - 10) + 10);

    transaction.push(money);

    return transaction;
}

function renderTable(arr, tableId) {
    let html = "";

    for(let i = 0; i < arr.length; i++) {
        html += "<tr id=\"" + arr[i][0].replace(/[\s\.\#]/g, "") + "\">";

        for(let j = 0; j < arr[i].length; j++) {
            html += "<td class=\"" + j + "\">";

            html += arr[i][j];

            html += "</td>";
        }

        html += "</tr>";
    }

    console.log(html);

    $("#" + tableId).append(html);
}

for(let i = 0; i < accountNames.length; i++) {
    accounts.push(generateAccount(accountNames[i]));
}

renderTable(accounts, "accountTable");

for(let i = 0; i < descriptions.length; i++) {
    transactions.push(generateTransaction(descriptions[i]));
}

renderTable(transactions, "transactionTable");

$("#transferDialog").hide();

for(let i = 0; i < accountNames.length; i++) {
    $("#fromSelect").append("<option value=\"" + accountNames[i] + "\">" + accountNames[i] + "</option>");
}

for(let i = 0; i < accountNames.length; i++) {
    $("#toSelect").append("<option value=\"" + accountNames[i] + "\">" + accountNames[i] + "</option>");
}

$("#transfer").click(function() {
    $("#transferDialog").show();
});

$("#submitTransfer").click(function() {
    let from = $("#fromSelect").val();
    let to = $("#toSelect").val();

    if(from !== to) {
        let transferAmount = parseFloat($("#amount").val());

        let fromNum = accountNames.indexOf(from);
        let toNum = accountNames.indexOf(to);

        let fromAmount = accounts[fromNum][2];
        fromAmount = fromAmount.replace(/[\$,]/g, "");
        fromAmount = parseFloat(fromAmount);

        let toAmount = accounts[toNum][2];
        toAmount = toAmount.replace(/[\$,]/g, "");
        toAmount = parseFloat(toAmount);

        let fromTotal = fromAmount - transferAmount;
        let toTotal = toAmount + transferAmount;

        console.log("from: " + fromTotal + " to: " + toTotal);

        accounts[fromNum][2] = "$" + fromTotal.toFixed(2);
        accounts[toNum][2] = "$" + toTotal.toFixed(2);

        freezeTest();
        $("#" + from.replace(/[\s\.\#]/g, "") + " .2").html(accounts[fromNum][2]);
        $("#" + to.replace(/[\s\.\#]/g, "") + " .2").html(accounts[toNum][2]);
        unfreezeTest();
    }

    $("#transferDialog").hide();
});

$("#contactImg").click(function() {
    $("#contact").html("<iframe src=\"messenger.html\"></iframe>");
});