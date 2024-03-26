$(document).ready(function () {
	Utils.SetI18N();
	document.querySelector("#account").value = sessionStorage.getItem("userId")
	document.querySelector("#userName").value = sessionStorage.getItem("userName")
	document.querySelector("#userPhone").value = sessionStorage.getItem("userPhone")
})

function accountSubmit() {
	const oldPassword = document.querySelector("#oldPassword").value;
	const newPassword = document.querySelector("#newPassword").value;
	const checkPassword = document.querySelector("#checkPassword").value;
	if(newPassword === checkPassword) {
		const requestData = {
			"user_name": document.querySelector("#userName").value, 
			"mobile_phone": document.querySelector("#userPhone").value
		}
		if(oldPassword !== "" && newPassword !== "") {
			requestData.oldPPP = oldPassword;
			requestData.newPPP = newPassword;
		}
		axios
			.post("eip01.do?method=updateProfile", requestData)
			.then(response => {
				if(response.data.status === "0") {
					sessionStorage.setItem("userName",requestData.user_name)
					sessionStorage.setItem("userPhone",requestData.mobile_phone)
					if(requestData.oldPPP) {
						alert(Language[localStorage.getItem("askeyLanguage")].passwordHasBeenChanged);
						Utils.Logout();
					} else {
						alert(Language[localStorage.getItem("askeyLanguage")].usernameAndPhoneNumberHaveBeenUpdated);
					}
				} else {
					console.log(response);
				}
			})
	} else {
		alert(Language[localStorage.getItem("askeyLanguage")].incorrectNewPassword)
	}
}