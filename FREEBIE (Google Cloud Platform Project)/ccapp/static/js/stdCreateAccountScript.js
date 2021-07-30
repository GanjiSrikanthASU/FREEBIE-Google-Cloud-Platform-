var studentArray = [];

function init(){
    if (localStorage.studentsRecord){
        studentArray = JSON.parse(localStorage.studentsRecord);
    }
}
function onSignUp(){
    var username = document.getElementById("signupUsername").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("newpassword").value;

    var stdObj = {username:username, email:email, password:password};
    studentArray.push(stdObj);

    localStorage.studentsRecord = JSON.stringify(studentArray);
}

function setFormMessage(formElement, type, message) {
    const messageElement = formElement.querySelector(".form_message");

    messageElement.textContent = message;
    messageElement.classList.remove("form_message--success", "form_message--error");
    messageElement.classList.add(`form_message--${type}`);
}

function setInputError(inputElement, message) {
    inputElement.classList.add("form__input--error");
    inputElement.parentElement.querySelector(".form__input-error-message").textContent = message;
}

function clearInputError(inputElement) {
    inputElement.classList.remove("form__input--error");
    inputElement.parentElement.querySelector(".form__input-error-message").textContent = "";
}

document.addEventListener("DOMContentLoaded", () => {
    const stdLoginForm = document.querySelector("#stdLogin");
    const createAccountForm = document.querySelector("#createAccount");

    document.querySelector("#linkCreateAccount").addEventListener("click", e => {
        e.preventDefault();
        stdLoginForm.classList.add("form--hidden");
        createAccountForm.classList.remove("form--hidden");
    });

    document.querySelector("#linkLogin").addEventListener("click", e => {
        e.preventDefault();
        stdLoginForm.classList.remove("form--hidden");
        createAccountForm.classList.add("form--hidden");
    });

    stdLoginForm.addEventListener("submit", e => {
        e.preventDefault();
        var signInEmail = document.getElementById("signInEmail").value;
        var signInPassword = document.getElementById("signInPassword").value;
        if (localStorage.getItem('studentsRecord') != null){
        for (var i=0; i<studentArray.length;i++){
            if (signInEmail==studentArray[i].email && signInPassword==studentArray[i].password){
                var signIntype="success"
                var signInMessage= "Login Successful"
                location.href="./studentPage.html"
            }
            else{
                var signIntype="error"
                var signInMessage="Invalid username/password combination"
            }
        }
    }

        setFormMessage(stdLoginForm,signIntype,signInMessage );
    });

    document.querySelectorAll(".form__input").forEach(inputElement => {
        inputElement.addEventListener("blur", e => {
            if (e.target.id === "signupUsername" && e.target.value.length > 0 && e.target.value.length < 10) {
                setInputError(inputElement, "Username must be at least 10 characters in length");
            }
        });

        inputElement.addEventListener("input", e => {
            clearInputError(inputElement);
        });
    });
});