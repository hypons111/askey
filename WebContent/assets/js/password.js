var trackingNo = ""

$(document).ready(function () {
	Utils.SetI18N();
})

function loadLoginView() {
	Utils.Logout();
}

function sendVerifyMail() {
	const requestData = {
		"user_id": document.querySelector("#loginAccount").value
	}
	axios
		.post("login.do?method=sendVerifyMail", requestData)
		.then(response => {
			alert(Language[localStorage.getItem("askeyLanguage")].verificationCodeHasBeenSent)
			trackingNo = response.data.responseInfo.tracking_no
		})
}

function submitPassword() {
	const language = typeof localStorage.getItem("askeyLanguage") === "object" ? "tw" : localStorage.getItem("askeyLanguage")
	const form = document.querySelector("#body");
	const constraints = {
		loginAccount: {
			presence: {
				message: Language[language].error_loginAccount
			}
		},
		verifyCode: {
			presence: {
				message: Language[language].error_verifyCode
			}
		},
		password1: {
			presence: {
				message: Language[language].error_password
			}
		},
		password2: {
			presence: {
				message: Language[language].error_password
			},
			equality: {
			    attribute: "password1",
			    message: Language[language].error_equality_password
			}
		}
	};
	const errors = validate(form, constraints, { format: 'detailed' });
	
	// 重置 error message
	form.querySelectorAll('.errorMessage').forEach(element => { element.classList.add("none"); });
	// 重置 input tag effect
	form.querySelectorAll('.is-invalid').forEach(element => { element.classList.remove('is-invalid'); });
	
	if (errors) {
		for (const error of errors) {
		  	const errorElement = form.querySelector(`[data-error-type="${error.attribute}"]`);
		  	errorElement.innerText = error.options.message
		  	if (errorElement) {
		  		errorElement.classList.remove("none");
			  	const inputField = form.querySelector(`#${error.attribute}`);
			  	if (inputField) {
				  	inputField.classList.add('is-invalid');
			  	}
		  	}
		}
	} else {
		const requestData = {
			"user_id": document.querySelector("#loginAccount").value,
			"password": document.querySelector("#password1").value,
			"verify_code": document.querySelector("#verifyCode").value,
			"tracking_no": trackingNo,
		}
		axios
			.post("login.do?method=resetPwd", requestData)
			.then(response => {
				if(response.data.message === "成功") {
					alert(Language[localStorage.getItem("askeyLanguage")].theNewPasswordHasBeenSetSuccessfully);
					Utils.Logout();
				} else {
					alert(response.data.message);
				}
			});
	}
}

