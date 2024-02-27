document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("signUp");
  
    form.addEventListener("submit", function (event) {
      event.preventDefault();
  
      if (validateForm()) {
        form.submit();
      }
    });
  
    function validateForm() {
      const username = document.getElementById("username").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const repeatPassword = document.getElementById("Rpassword").value;
  
      if (username.trim() === "" || email.trim() === "" || password.trim() === "" || repeatPassword.trim() === "") {
        alert("All fields must be filled out");
        return false;
      }
  
      if (password !== repeatPassword) {
        alert("Passwords don't match");
        return false;
      }
  
      return true;
    }
  });
  