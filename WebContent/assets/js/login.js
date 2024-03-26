var requestInterceptor = undefined
var responseInterceptor = undefined

$(document).ready(function() {
	if(isBackToCurrentPageAfterRefresh()) {
		const page = sessionStorage.getItem("page");
		const badge = sessionStorage.getItem("badge");
		Utils.LoadPage(page, badge)
	} else {
		Utils.SetI18N();
		getAskeyLanguage();
		getCheckcode();
	};
})

function isBackToCurrentPageAfterRefresh() {
	const userName = sessionStorage.getItem("userName");
	const userId = sessionStorage.getItem("userId");
	const token = sessionStorage.getItem("token");
	if(typeof userName === "string" && typeof userId === "string" && typeof token === "string") {
		setInterceptor(token)
		return true;
	} else {
		return false;
	}
}

// get askeyLanguage
function getAskeyLanguage() {
	if(typeof localStorage.getItem("askeyLanguage") === "object") {
		localStorage.setItem("askeyLanguage", "tw")
	}
}

// 更新驗證碼
function getCheckcode() {
	document.querySelector("#checkcode").src = "/ASKEY/codeImage.do?t=" + new Date().getTime();
	document.querySelector("#loginPasscode").value = ""
}
function capitalize(t) {
	t.value = t.value.toUpperCase();		
}

// 登入前檢查 input
function submit() {
	const form = document.querySelector("#form");
	const constraints = {
		loginAccount: {
			presence: true
		},
		loginPassword: {
			presence: true
		},
		loginPasscode: {
			presence: true
		}
	};
	const errors = validate(form, constraints, { format: 'detailed' });
	// 重置 error message
	form.querySelectorAll('.errorMessage').forEach(element => {
		element.classList.add("none");
	});
	// 重置 input tag effect
	form.querySelectorAll('.is-invalid').forEach(element => {
		element.classList.remove('is-invalid');
	});
		
	if (errors) {
		for (const error of errors) {
	    	const errorElement = form.querySelector(`[data-error-type="${error.attribute}"]`);
	    	if (errorElement) {
	    		errorElement.classList.remove("none");
		    	const inputField = form.querySelector(`#${error.attribute}`);
		    	if (inputField) {
			    	inputField.classList.add('is-invalid');
		    	}
	    	}
		}
	} else {
		login();
	}
}

// 登入
function login() {
	requestData = {
		"user_id" : document.querySelector("#loginAccount").value, 
		"password" : document.querySelector("#loginPassword").value,
		"passcode" : document.querySelector("#loginPasscode").value,					
		"lang" : localStorage.getItem("askeyLanguage")
	}
	axios
		.post("login.do?method=verifyUser", requestData)
		.then(response => {
			const responseData = response.data
			sessionStorage.setItem("userName", responseData.responseInfo.user_name);
			sessionStorage.setItem("userId", responseData.responseInfo.user_id);
			sessionStorage.setItem("userPhone", responseData.responseInfo.mobile_phone);
			sessionStorage.setItem("userRole", responseData.responseInfo.user_role);
			sessionStorage.setItem("customerList", JSON.stringify(response.data.responseInfo.customer_id));
			sessionStorage.setItem("isAlertFlag", "1");
			if(responseData.status === "0") {
				const token = responseData.responseInfo.TctToken
				sessionStorage.setItem("token", token)
				document.cookie = "token=" +token;
				setInterceptor(token);
				Utils.LoadPage("system", "systemBadge")
			} else if(responseData.status === "102" || responseData.status === "103" || responseData.status === "107") {
				alert(responseData.message);
				getCheckcode();
				document.querySelector("#loginAccount").value = ""
				document.querySelector("#loginPassword").value = ""
			} else if(responseData.status === "105") {
				alert(Language[localStorage.getItem("askeyLanguage")].error_verificationCode)
				getCheckcode();
			}
		})
}

// 設定 interceptor
function setInterceptor(token) {
	requestInterceptor = axios.interceptors.request.use(config => {
		config.headers['ssoToken'] = token;
		return config;
	}, error => { return Promise.reject(error); });
	responseInterceptor = axios.interceptors.response.use(response => {
		if(response.data === "請重新登入" || response.data === "請先登入") {
			if(sessionStorage.getItem("isAlertFlag") === "1") {
				sessionStorage.setItem("isAlertFlag", "2");
				alert(response.data)
				Utils.Logout();
			}
		}
		return response;
	}, error => { return Promise.reject(error); });
}

// 忘記密碼
function loadPasswordView() {
	Utils.LoadPage("password", "");
}