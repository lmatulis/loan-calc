
function getValues() {
    let loanAmount = document.getElementById("loanAmount").value;
    let termMonths = document.getElementById("termMonths").value;
    let interestRate = document.getElementById("interestRate").value;

    let monthlyPayment = document.getElementById("monthlyPayment");
    monthlyPayment.innerHTML = calculateTotalMonthlyPayments(loanAmount,interestRate,termMonths);
}


function calculateTotalMonthlyPayments(loanAmount, interestRate, termMonths) {
    let x = 1+(interestRate/1200);
    let totalMonthlyPayment = (loanAmount*(interestRate/1200))/(1-Math.pow(x,termMonths*-1));
    return totalMonthlyPayment;
}