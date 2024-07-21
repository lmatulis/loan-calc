
function getValues() {
    let loanAmount = document.getElementById("loanAmount").value;
    let termMonths = document.getElementById("termMonths").value;
    let interestRate = document.getElementById("interestRate").value;

    loanAmount = parseInt(loanAmount);
    termMonths = parseInt(termMonths);
    interestRate = parseInt(interestRate);

    if(Number.isInteger(loanAmount) && Number.isInteger(termMonths) && Number.isInteger(interestRate)) {

        let TMP = calculateTotalMonthlyPayments(loanAmount, interestRate, termMonths);
        let totalInterest = calculateTotalInterest(loanAmount, interestRate, termMonths);
        let totalCost = calculateTotalCost(totalInterest, loanAmount);

        document.getElementById("monthlyPayment").innerHTML = `$${TMP}`;
        document.getElementById("totalPrincipal").innerHTML = `$${loanAmount}`;
        document.getElementById("totalInterest").innerHTML = `$${totalInterest}`;
        document.getElementById("totalCost").innerHTML = `$${totalCost}`;

    } else {
        alert("Only numbers allowed. Please enter numbers into the fields");
    }
}

function displayData(TMP) {

}

function calculateTotalMonthlyPayments(loanAmount, interestRate, termMonths) {
    let base = 1 + (interestRate/1200);
    let pow = -1*termMonths;

    let TMP = (loanAmount) * (interestRate/1200)/(1-(Math.pow(base, pow)));
    return TMP.toFixed(2);
}

function calculateTotalInterest(loanAmount, interestRate, termMonths) {

    let base = 1 + (interestRate/1200);
    let pow = -1*termMonths;

    let totalInterest = ((loanAmount) * (interestRate/1200)/(1-(Math.pow(base, pow))))*termMonths-loanAmount;
    return totalInterest.toFixed(2);

}

function calculateTotalCost(totalInterest, loanAmount) {
    let totalCost = totalInterest + loanAmount;
    return totalCost;
}