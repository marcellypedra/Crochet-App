//Register Modal
document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById('registerModal');
    const closeRegisterModalButton = document.getElementById('registercloseModal');
    const registerButton = document.getElementById('Registerbtn');
    

    // Open the modal when the "Register" button is clicked
    registerButton.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    closeRegisterModalButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close the modal when clicking outside the modal content
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});


//Register User form
async function CreateUser(event) {
    event.preventDefault();


const Newusername = document.getElementById("Newuser").value;
const Newemail = document.getElementById("NewUsermail").value;
const Newpassword = document.getElementById("NewuserPwd").value;
const confirmPassword = document.getElementById("VNewuserPwd").value;

if (Newpassword !== confirmPassword) {
    alert ('Passwords do not match.');
    return;
}

try{
    const response = await fetch ("/api/register", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ 
        username: Newusername,
        email: Newemail,
        password: Newpassword
        })
    });

    const data = await response.json();
    if (response.ok) {
        alert(data.message);
        RegisterForm.reset();
        modal.style.display = 'none';
    } else {
        alert(data.message);
  }
} catch (error) {
    console.error('Error:', error);
  }
}

// handle register form submission
document.getElementById('RegisterForm').addEventListener('submit', CreateUser);

//Login form
async function Login(event) {
    event.preventDefault();

    const useremail = document.getElementById("UserEmail").value;
    const password = document.getElementById("pwdLogin").value;

    try {
        const response = await fetch("/api/login",{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: useremail, password: password})
        });

        const data = await response.json();
        if (response.ok) {
            alert(data.message);
            window.location.href = 'Myproject.html'; // redirect to Myprojects page
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error login in', error); 
    }
}

// handle login form submission
document.getElementById('login').addEventListener('submit', Login);

//Forgot Password Modal
document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById('resetPwdModal');
    const closeModalButton = document.getElementById('PwdcloseModal');
    const forgotPasswordButton = document.getElementById('ForgotPwdbtn');
    

    // Open the modal when the "Forgot Password?" button is clicked
    forgotPasswordButton.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    closeModalButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close the modal when clicking outside the modal content
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});



// Handle Reset Password Form Submission
async function ResetPassword(event) {
    event.preventDefault();

    const email = document.getElementById("ResetEmail").value;
    const newPassword = document.getElementById("NewPwd").value;
    const confirmNewPassword = document.getElementById("ConfirmNewPwd").value;
    const resetPasswordForm = document.getElementById('resetPwdForm');

    if (newPassword !== confirmNewPassword) {
        alert('Passwords do not match.');
        return;
    }

    try {
        const response = await fetch("/api/reset-password", {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password: newPassword })
        });

        const data = await response.json();
        if (response.ok) {
            alert(data.message);
            resetPasswordForm.reset();
            modal.style.display = 'none';
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error resetting password:', error);
    }
}
// Attach event listener to reset password form
document.getElementById('resetPwdForm').addEventListener('submit', ResetPassword);


