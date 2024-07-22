// Formatter for USD currency
const USDformat = Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

// Function to get values from the form fields
function getValues() {
    // Retrieve values from input fields
    let loanAmount = document.getElementById("loanAmount").value;
    let termMonths = document.getElementById("termMonths").value;
    let interestRate = document.getElementById("interestRate").value;

    // Remove non-digit characters
    termMonths.replace(/\D/g, '');

    // Parse values to integers
    loanAmount = parseFloat(loanAmount);
    termMonths = parseInt(termMonths);
    interestRate = parseFloat(interestRate);

    // Check if inputs are valid numbers
    if(isFloat(loanAmount) && Number.isInteger(termMonths) && isFloat(interestRate)) {

        // Calculate monthly payments, total interest, and total cost
        let TMP = calculateTotalMonthlyPayments(loanAmount, interestRate, termMonths);
        let totalInterest = calculateTotalInterest(loanAmount, interestRate, termMonths);
        let totalCost = calculateTotalCost(totalInterest, loanAmount);

        // Build loan objects array
        let loanObjects = buildLoanObjectArray(termMonths, TMP, loanAmount, interestRate);

        // Display calculated data
        displayData(loanObjects, TMP, loanAmount, totalInterest, totalCost);

    } else {
        // Alert if inputs are not valid
        alert("Only integers allowed. Please enter an integer into the fields");
    }
}

// Function to display loan data in the table
function displayData(loanObjects, TMP, loanAmount, totalInterest, totalCost) {

    // Get template and table elements
    let template = document.getElementById("loanData-template");
    let loanTable = document.getElementById("loanTable");
    let loanTableBody = document.getElementById("loanTableBody");

    // Clear existing table body
    loanTableBody.innerHTML = "";

    // Loop through loan objects and populate table rows
    for(let index = 0; index < loanObjects.length; index++) {
        
        let currentMonth = loanObjects[index];
        let loanTableRow = document.importNode(template.content, true);

        // Populate table with loan data
        loanTableRow.querySelector("[data-month]").textContent = currentMonth.month;
        loanTableRow.querySelector("[data-payment]").textContent = USDformat.format(currentMonth.payment);
        loanTableRow.querySelector("[data-principal]").textContent = USDformat.format(currentMonth.principal);
        loanTableRow.querySelector("[data-interest]").textContent = USDformat.format(currentMonth.interest);
        loanTableRow.querySelector("[data-totalInterest]").textContent = USDformat.format(currentMonth.totalInterest);
        loanTableRow.querySelector("[data-balance]").textContent = USDformat.format(Math.abs(currentMonth.balance));

        // Add to HTML
        loanTableBody.appendChild(loanTableRow);
    }

    // Display summary data
    document.getElementById("monthlyPayment").innerHTML = USDformat.format(TMP);
    document.getElementById("totalPrincipal").innerHTML = USDformat.format(loanAmount);
    document.getElementById("totalInterest").innerHTML = USDformat.format(totalInterest);
    document.getElementById("totalCost").innerHTML = USDformat.format(totalCost);
    
    // Make table visable
    loanTable.classList.remove("d-none");
}

// Function to build array of loan objects for each month
function buildLoanObjectArray(termMonths, TMP, remainingBalance, interestRate) {

    let loanObjects = []
    let month;
    let totalInterest = 0;
    let principal;
    let interest;

    // Loop through each month and calculate loan details
    for(let index = 0; index < termMonths; index++) {
        month = index + 1;
        interest = calculateInterestPayment(remainingBalance, interestRate);
        principal = calculatePrincipalPayment(TMP, interest);
        remainingBalance -= principal;
        totalInterest += interest;

        // Build object for the current month
        let loanMonth = buildLoanObject(month, TMP, principal, interest, totalInterest, remainingBalance);

        // Add new object to the array of Objects
        loanObjects.push(loanMonth);
    }

    return loanObjects;

}

// Function to create a loan object for a given month
function buildLoanObject(month, TMP, principal, interest, totalInterest, remainingBalance) {

    let loanMonth = {
        month: month,
        payment: TMP,
        principal: principal,
        interest: interest,
        totalInterest: totalInterest,
        balance: remainingBalance,
    };

    return loanMonth;
}

// Function to calculate interest payment for a month
function calculateInterestPayment(remainingBalance, interestRate) {

    let interest = remainingBalance*(interestRate/1200);

    return interest;
}

// Function to calculate principal payment for a month
function calculatePrincipalPayment(TMP, interest) {

    let principal = TMP - interest;

    return principal;
}

// Function to calculate total monthly payment
function calculateTotalMonthlyPayments(loanAmount, interestRate, termMonths) {
    let base = 1 + (interestRate/1200);
    let pow = -1*termMonths;

    let TMP = (loanAmount) * (interestRate/1200)/(1-(Math.pow(base, pow)));
    return TMP;
}

// Function to calculate total interest over the loan term
function calculateTotalInterest(loanAmount, interestRate, termMonths) {

    let base = 1 + (interestRate/1200);
    let pow = -1*termMonths;

    let totalInterest = ((loanAmount) * (interestRate/1200)/(1-(Math.pow(base, pow))))*termMonths-loanAmount;
    return totalInterest;

}

// Function to calculate total cost of the loan
function calculateTotalCost(totalInterest, loanAmount) {
    let totalCost = totalInterest + loanAmount;
    return totalCost;
}

// Function to see if interest rate is either a float or an integer
function isFloat(number) {
    if(Number(number) === number && number % 1 !== 0) {
        return true;
    } else if(Number.isInteger(number)) { 
        return true;
    } else {
        return false;
    }
}