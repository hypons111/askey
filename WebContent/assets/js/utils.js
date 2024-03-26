const Utils = {
	ChangeLanguage: function(language) {
		localStorage.setItem("askeyLanguage", language);
		this.SetI18N();
	},
	ShowFunctionByRole(adminArray, salesArray) {
		if(sessionStorage.getItem("userRole") === "admin" && adminArray) {
			for(let i=0; i<adminArray.length; i++) {
				document.querySelectorAll(`${adminArray[i]}`).forEach(item => {
					item.classList.remove("none");
				})
			}
		} else if(sessionStorage.getItem("userRole") === "sales" && salesArray) {
			for(let i=0; i<salesArray.length; i++) {
				document.querySelectorAll(`${salesArray[i]}`).forEach(item => {
					item.classList.remove("none");
				})
			}
		}
	},
	SetI18N: function() {
		let language = "";
		typeof localStorage.getItem("askeyLanguage") === "object"
		? language = "tw" 
		: language = localStorage.getItem("askeyLanguage")
		$("[i18n]").i18n({
	 		defaultLang : language,
			filePath : "assets/json/",
			filePrefix : "i18n_",
			forever : true,
			callback : function() {}
		})
	},
	
	SetGreeting: function() {
		document.querySelector("#greeting").innerText = `HI, ${sessionStorage.getItem("userName")}`
	},
	
	// 登出
	Logout: function() {
		axios.post("login.do?method=userLogout").then(response => {
			Utils.RemoveSessionStorageItem("ALL");
			sessionStorage.setItem("token", "")
			document.cookie = "";
			axios.interceptors.request.eject(requestInterceptor);
			axios.interceptors.response.eject(responseInterceptor);
			location.reload();
		})
	},
	
	// 換頁
	LoadPage: function(loadPage, loadBadge) {
		sessionStorage.setItem("page", loadPage)
		sessionStorage.setItem("badge", loadBadge)
		if(loadPage !== "") {
			$("#mainContainer").load("view/" + loadPage + ".jsp");
		}
		if(loadBadge === "X") {
			document.querySelector("#badgeContainer").innerHTML = "";
		} else if(loadBadge !== "") {
			$("#badgeContainer").load( "view/badge/" + loadBadge + ".jsp");
		}
	},
	
	// 固定的上一頁
	Router: function() {
		let page = ""
		let badge = ""
		switch(document.querySelector("#mainContainer div").id.replace("Container", "")) {
			case "accountSystem":
			case "quotationSystem":
				page = "system"
				badge = "systemBadge"
				break;
			case "favoriteItem":
			case "quotationDownloadLog":
			case "quotationSetting":
			case "quotationUpdateLog":
			case "quotation":
				page = "quotationSystem"
				badge = "normalBadge"
				break;
			case "asset":
				page = "quotation"
				badge = "X"
				break;
			case "":
				page = ""
				badge = ""
				break;
			default:
				page = "system"
				badge = "systemBadge"
				break;
		}
		sessionStorage.setItem("page", page) // refresh 時用來紀錄目前的 page
		sessionStorage.setItem("badge", badge) // refresh 時用來紀錄目前的 badge
		this.LoadPage(page, badge);
	},

	// 動態的上一頁 (要用先用 SaveReturnPage())
	LoadPreviousPage: function() {
		this.LoadPage(sessionStorage.getItem("previousPage"), sessionStorage.getItem("previousBadge"));
	},
	
	// 記錄要返回的上一頁名稱
	SaveReturnPage: function (returnPage, returnBadge) {
		sessionStorage.setItem("previousPage", returnPage);
		sessionStorage.setItem("previousBadge", returnBadge);
	},
	
	RemoveSessionStorageItem(item) {
		if(item === "ALL") {
			sessionStorage.clear();
		} else {
			sessionStorage.removeItem(item);
		}
	},
	
	GetFutureDate(offset) {
		const now = new Date();
		now.setDate(now.getDate() + 14);
		const year = now.getFullYear();
		const month = String(now.getMonth() + 1).padStart(2, '0');
		const day = String(now.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	},

	GetCurrentDate() {
		const now = new Date();
		const year = now.getFullYear();
		const month = String(now.getMonth() + 1).padStart(2, '0');
		const day = String(now.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	},
	
	GetCodeName() {
		const now = new Date();
		const year = now.getFullYear();
		const month = String(now.getMonth() + 1).padStart(2, '0');
		const day = String(now.getDate()).padStart(2, '0');
		const hour = String(now.getHours()).padStart(2, '0');
		const minute = String(now.getMinutes()).padStart(2, '0');
		const second = String(now.getSeconds()).padStart(2, '0');
		return `${year}${month}${day}${hour}${minute}${second}`;
	},
	
	// 日期時間範圍
	SetCurrentDateTimeRange(container) {
		$(`${container} .dtr`).daterangepicker({
			startDate: moment().startOf("month"),
			endDate: moment().endOf("day"),
		    timePicker: true,
		    timePicker24Hour: true,
		    showDropdowns: true,
		    minYear: 1974,
		    maxYear: parseInt(moment().format('YYYY'),10) + 50,
		    autoApply: false,
			locale: DTLocale[`${localStorage.getItem("askeyLanguage")}`]
		})
		$(`${container} .dr`).daterangepicker({
			startDate: moment().startOf("month"),
			endDate: moment().endOf("day"),
			timePicker: false,
		    showDropdowns: true,
		    minYear: 1974,
		    maxYear: parseInt(moment().format('YYYY'),10) + 50,
			autoApply: false,
			locale: DLocale[`${localStorage.getItem("askeyLanguage")}`]
		})
	},
	
	// 指定日期時間
	AssignDateTime(container, date) {
		$(`${container} .dtr`).daterangepicker({
			singleDatePicker: true,
			startDate: date,
		    timePicker: true,
		    timePicker24Hour: true,
		    showDropdowns: true,
		    minYear: 1974,
		    maxYear: parseInt(moment().format('YYYY'),10) + 50,
			autoApply: true,
			locale: DTLocale[`${localStorage.getItem("askeyLanguage")}`]
		})
		$(`${container} .dr`).daterangepicker({
			singleDatePicker: true,
			startDate: date,
			timePicker: false,
		    showDropdowns: true,
		    minYear: 1974,
		    maxYear: parseInt(moment().format('YYYY'),10) + 50,
			autoApply: false,
			locale: DLocale[`${localStorage.getItem("askeyLanguage")}`]
		})
	},

	// current日期時間
	SetCurrentDateTime(container) {
		$(`${container} .dtr`).daterangepicker({
			singleDatePicker: true,
			startDate: moment(),
		    timePicker: true,
		    timePicker24Hour: true,
		    showDropdowns: true,
		    minYear: 1974,
		    maxYear: parseInt(moment().format('YYYY'),10) + 50,
			autoApply: true,
			locale: DTLocale[`${localStorage.getItem("askeyLanguage")}`]
		})
		$(`${container} .dr`).daterangepicker({
			singleDatePicker: true,
			startDate: moment(),
			timePicker: false,
		    showDropdowns: true,
		    minYear: 1974,
		    maxYear: parseInt(moment().format('YYYY'),10) + 50,
			autoApply: false,
			locale: DLocale[`${localStorage.getItem("askeyLanguage")}`]
		})
	},
	
	// 自訂日期時間範圍
	SetDateTimeRange(container) {
		$(`${container} .dtr`).daterangepicker({
		    timePicker: true,
		    timePicker24Hour: true,
		    showDropdowns: true,
		    minYear: 1974,
		    maxYear: parseInt(moment().format('YYYY'),10) + 50,
		    autoApply: false,
			locale: DTLocale[`${localStorage.getItem("askeyLanguage")}`]
		})
		$(`${container} .dtr`).val('');
		$(`${container} .dr`).daterangepicker({
			timePicker: false,
		    showDropdowns: true,
		    minYear: 1974,
		    maxYear: parseInt(moment().format('YYYY'),10) + 50,
			autoApply: false,
			locale: DLocale[`${localStorage.getItem("askeyLanguage")}`]
		})
		$(`${container} .dr`).val('');
	},
	
	// 自訂日期時間
	SetDateTime(container, option, value) {
		$(`${container} .dtr`).daterangepicker({
			singleDatePicker: true,
			timePicker: true,
			timePicker24Hour: true,
		    showDropdowns: true,
		    minYear: 1974,
		    maxYear: parseInt(moment().format('YYYY'),10) + 50,
			autoApply: false,
			locale: DTLocale[`${localStorage.getItem("askeyLanguage")}`]
		})
		$(`${container} .dr`).daterangepicker({
			singleDatePicker: true,
			timePicker: false,
		    showDropdowns: true,
		    minYear: 1974,
		    maxYear: parseInt(moment().format('YYYY'),10) + 50,
			autoApply: false,
			locale: DLocale[`${localStorage.getItem("askeyLanguage")}`]
		})
		
		if(container === ".setting") {
			const setting = document.querySelector(container);
			if(setting.classList.contains("setting")) {
				setting.classList.remove("setting")
				setting.querySelector("INPUT").value = value
			}
		}
		
		if(option === "all") {
			$(`${container} .dtr`).val('');
			$(`${container} .dr`).val('');
		} else if(option === "last") {
			$(`${container} tr:last .dtr`).val('');
			$(`${container} tr:last .dr`).val('');
		}
	},
	// 清除時間
	ClearDate(t) {
		if(event && event.type !== "click") {
			t.value = "";
		}
		if(t.value === "") {
			const interval = setInterval(() => {
				t.value = "";
			}, 0)
			setTimeout(() => {
				clearInterval(interval);
			}, 1000)
		}
	}
};

// i18n json 改不動的就用這個
// Language[localStorage.getItem("askeyLanguage")].totalPrice
const Language = {
	"en": {
		"": "",
		"all": "All",
		"pleaseChoose": "Please Choose",
		"save" : "Save",
		"add" : "Add",
		"edit" : "Edit",
		"copy" : "Copy",
		"download": "Download",
		"export": "Export",
		"create" : "Create",
		"update" : "Update",
		"delete" : "Delete",
		"saveSuccess" : "Save Success",
		"editSuccess" : "Edit Success",
		"copySuccess" : "Copy Success",
		"downloadSuccess": "Download Success",
		"exportSuccess": "Export Success",
		"createSuccess" : "Create Success",
		"updateSuccess" : "Update Success",
		"deleteSuccess" : "Delete Success",
		"description" : "Description",
		"name" : "Name",
		"qty" : "Quantity",
		"quantity" : "Quantity",
		"price" : "Price",
		"unit" : "Unit",
		"selectAssetProject" : "Select asset project",
		"type" : "Type",
		"string" : "Text",
		"integer" : "Integer",
		"float" : "Float",
		"date" : "Date",
		"datetime" : "Datetime",
		"createItemType" : "Create item",
		"editItemType" : "Edit item type",
		"data_type1" : "Integer",
		"data_type2" : "Float",
		"data_type3" : "Text",
		"data_type4" : "Datetime",
		"data_type5" : "Date",
		"QPROJECT" : "Quotation Project",
		"QITEM" : "Attribute",
		"QATTR" : "Item Type",
		"QDATA" : "Item",
		"projectName" : "Project Name",
		"itemName" : "Item Name",
		"attributeName" : "Attribute Name",
		"value" : "Value",
		"fullName" : "Full Name",
		"briefName" : "Brief Name",
		"description" : "Description",
		"currency" : "Currency",
		"customer" : "Ccustomer",
		"is_show" : "Authority",
		"is_showY" : "Y",
		"is_showN" : "N",
		"is_mandatory" : "Mandatory",
		"is_mandatoryY" : "Y",
		"is_mandatoryN" : "N",
		"is_calculate" : "Calculate",
		"is_calculateY" : "Y",
		"is_calculateN" : "N",
		"attr_name" : "Attribute",
		"data_type" : "Data Type",
		"item_name" : "Item Name",
		"value" : "Value",
		"full_name" : "Full Name",
		"brief_name" : "Brief Name",
		"confirmDelete" : "Do you want to delete?",
		"totalPrice" : "Total Price",
		"subtotal" : "Subtotal",
		"twd" : "TWD",
		"jpy" : "JPY",
		"usd" : "USD",
		"exporting": "Exporting...",
		"createQuotation" : "Create quotation",
		"editQuotation" : "Edit quotation",
		"createFavoriteItems" : "新增客戶服務工項(英文)",
		"editFavoriteItems" : "編輯客戶服務工項(英文)",
		"paginate": {
			"first": 'First',
			"previous": 'Previous',
			"next": 'Next',
			"last": 'Last',
		},
		"emptyTable": "No data available in table",
		"error_qName": "Enter quotation name",
		"error_qShortName": "Enter quotation short name",
		"error_customer": "請選擇客戶別 (英文)",
		"error_startWorkingDate": "輸入預計開工日 (英文)",
		"error_qDesc": "Enter quotation description",
		"error_loginAccount": "Enter your account",
		"error_verifyCode": "Enter verify code",
		"error_password": "Enter a new password",
		"error_equality_password": "password doesnt match",

		"error_verificationCode" : "Incorrect verification code",
		"success" : "Success",
		"noMatchingInformation" : "No matching information",
		"loading" : "Loading…",
		"querying" : "Loading…",
		"verificationCodeHasBeenSent" : "Verification code has been sent",
		"pleaseLoginAgain" : "Please login again",
		"passwordHasBeenChanged" : "Password has been changed, please log in again",
		"usernameAndPhoneNumberHaveBeenUpdated" : "Username and phone number have been updated",
		"incorrectNewPassword" : "Incorrect new password",
		"incorrectAccountAndPassword" : "Incorrect account and password",
		"noSuchUser" : "No such user",
		"verificationCodeIsInvalidOrExpired" : "Verification code is invalid or expired",
		"doYouWantToDeleteThisProject" : "Do you want to delete this project?",
		"doYouWantToDeleteThisItem" : "Do you want to delete this item?",
		"nameAlreadyExists" : "Name already exists.",
		"briefNameAlreadyExists" : "Brief Name already exists.",
		"thereAreStillRequiredFieldsLeftUnfilled" : "There are still required fields left unfilled.",

		"USERCREATE" : "Create Account",
		"USEREDIT" : "Edit Account",
		"CUSTOMERCREATE" : "Create Customer",
		"CUSTOMEREDIT" : "Edit Customer",
	
		"accountUSER" : "User Maintenance",
		"accountCUSTOMER" : "Account Maintenance",
		"engineering" : "Engineering",
		"service" : "Maintenance",
		"other" : "Other",
		"admin" : "Admin",
		"sales" : "Sales",
		
		"duplicatedUSER" : "使用者帳號不能重複 (en)",	
		"duplicatedCUSTOMER" : "客戶名稱不能重複 (en)",
		"deleteAndSendEmailUSER" : "Would you like to delete this account? A notification will be sent to the administrator upon deletion.",
		"deleteAndSendEmailCUSTOMER" : "The account has been deleted, and a notification has been sent to the administrator.",
		"accountSystem_deleteAccount_theAccountHasBeenDeleted" : "The account has been deleted, and a notification has been sent to the administrator.",
		"theNewPasswordHasBeenSetSuccessfully" : "The new Password has been set successfully. Please log in again."
	},
	"tw": {
		"": "",
		"all": "全選",
		"pleaseChoose": "請選擇",
		"save" : "儲存",
		"add" : "新增",
		"edit" : "編輯",
		"copy" : "複製",
		"download": "下載",
		"export": "匯出",
		"create" : "新增",
		"update" : "修改",
		"delete" : "刪除",
		"saveSuccess" : "儲存成功",
		"editSuccess" : "編輯成功",
		"copySuccess" : "複製成功",
		"downloadSuccess": "下載成功",
		"exportSuccess": "匯出成功",
		"createSuccess" : "新增成功",
		"updateSuccess" : "修改成功",
		"deleteSuccess" : "刪除成功",
		"description" : "敘述",
		"name" : "名稱",
		"qty" : "數量",
		"quantity" : "數量",
		"price" : "價格",
		"unit" : "單位",
		"selectAssetProject" : "請選擇報價專案",
		"string" : "文字",
		"integer" : "整數",
		"float" : "浮點數",
		"date" : "日期",
		"datetime" : "日期時間",
		"createItemType" : "新增品項類型",
		"editItemType" : "編輯品項類型",
		"data_type1" : "整數",
		"data_type2" : "浮點數",
		"data_type3" : "文字",
		"data_type4" : "日期時間",
		"data_type5" : "日期",
		"QPROJECT": "報價專案",
		"QITEM": "品項類型",
		"QATTR": "品項屬性",
		"QDATA": "品項",
		"projectName" : "專案名稱",
		"itemName" : "類型名稱",
		"attributeName" : "屬性名稱",
		"value" : "屬性值",
		"fullName" : "專案名稱",
		"briefName" : "專案簡稱",
		"description" : "敘述",
		"currency" : "幣別",
		"customer" : "客戶別",
		"is_show" : "業務檢視權限",
		"is_showY" : "開啟",
		"is_showN" : "關閉",
		"is_mandatory" : "是否必填",
		"is_mandatoryY" : "必填",
		"is_mandatoryN" : "非必填",
		"is_calculate" : "總金額計算欄位",
		"is_calculateY" : "是",
		"is_calculateN" : "否",
		"is_mandatory" :"必填欄位",
		"attr_name" : "屬性名稱",
		"data_type" : "資料型態",
		"item_name" : "類型名稱",
		"value" : "屬性值",
		"full_name" : "專案名稱",
		"brief_name" : "專案簡稱",
		"confirmDelete" : "確認是否要刪除?",
		"totalPrice" : "總金額",
		"subtotal" : "小計",
		"twd" : "台幣TWD",
		"jpy" : "日圓JPY",
		"usd" : "美元USD",
		"exporting": "匯出中...",
		"createQuotation" : "新增報價專案",
		"editQuotation" : "編輯報價專案",
		"createFavoriteItems" : "新增客戶服務工項",
		"editFavoriteItems" : "編輯客戶服務工項",
		"paginate": {
			"first": '第一頁',
			"previous": '上一頁',
			"next": '下一頁 ',
			"last": '最後一頁',
		},
		"emptyTable": "查無資料",
		"error_qName": "請輸入名稱",
		"error_qShortName": "請輸入簡稱",
		"error_customer": "請選擇客戶別 ",
		"error_startWorkingDate": "輸入預計開工日",
		"error_qDesc": "請輸入敘述",
		"error_loginAccount": "請輸入帳號",
		"error_verifyCode": "請輸入驗證碼",
		"error_password": "請輸入新密碼",
		"error_equality_password": "密碼不吻合",

		"error_verificationCode" : "驗證碼錯誤",
		"success" : "成功",
		"noMatchingInformation" : "查無相符資料",
		"loading" : "資料讀取中...",
		"querying" : "查詢中...",
		"verificationCodeHasBeenSent" : "驗證碼已寄出",
		"pleaseLoginAgain" : "請重新登入",
		"passwordHasBeenChanged" : "密碼已變更，請重新登入",
		"usernameAndPhoneNumberHaveBeenUpdated" : "使用者名稱、電話已更新",
		"incorrectNewPassword" : "新密碼錯誤",
		"incorrectAccountAndPassword" : "帳號或密碼錯誤",
		"noSuchUser" : "無該使用者",
		"verificationCodeIsInvalidOrExpired" : "驗證碼已失效",
		"doYouWantToDeleteThisProject" : "是否要刪除此報價專案?",
		"doYouWantToDeleteThisItem" : "是否要刪除此客戶服務工項?",
		"nameAlreadyExists" : "名稱不可重複",
		"briefNameAlreadyExists" : "簡稱不可重複",
		"thereAreStillRequiredFieldsLeftUnfilled" : "尚有必填欄位未填",
		
		"accountUSER" : "使用者維護",
		"accountCUSTOMER" : "客戶維護",
		"USERCREATE" : "新增帳號",
		"USEREDIT" : "編輯帳號",
		"CUSTOMERCREATE" : "新增客戶",
		"CUSTOMEREDIT" : "編輯客戶",
		
		"engineering" : "工程類",
		"service" : "維護類",
		"other" : "其他類",
		"admin" : "管理者",
		"sales" : "業務",
		
		"duplicatedUSER" : "使用者帳號不能重複",	
		"duplicatedCUSTOMER" : "客戶名稱不能重複",
		"deleteAndSendEmailUSER" : "是否刪除此帳號? 刪除後將寄送通知給管理者",
		"deleteAndSendEmailCUSTOMER" : "是否刪除此客戶?",
		"accountSystem_deleteAccount_theAccountHasBeenDeleted" : "帳號已刪除，已寄送通知給管理者 ",
		"theNewPasswordHasBeenSetSuccessfully" : "新密碼設定成功，請重新登入"		
	}
}
const CONVERT = {
	"Y": true,
	"N": false,
	UpdateLog : {
		"1": "integer",
		"2": "float",
		"3": "string",
		"4": "datetime",
		"5": "date",
		"value": "attrValue" 
	},
}
const DTLocale = {
	"tw": {
		"format": 'YYYY/MM/DD HH:mm',
		"applyLabel": "確認",
		"cancelLabel": "取消",
		"fromLabel": "從",
		"toLabel": "到",
		"weekLabel": "周",
		"daysOfWeek": ["日", "一", "二", "三", "四", "五", "六"],
		"monthNames": ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
	},
	"en": {
		"format": 'YYYY/MM/DD HH:mm',
		"applyLabel": "Apply",
		"cancelLabel": "Cancel",
		"fromLabel": "from",
		"toLabel": "to",
        "weekLabel": "Week",
        "daysOfWeek": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        "monthNames": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    },
};
const DLocale = {
	"tw": {
		"format": 'YYYY/MM/DD',
		"applyLabel": "確認",
		"cancelLabel": "取消",
		"fromLabel": "從",
		"toLabel": "到",
		"weekLabel": "周",
		"daysOfWeek": ["日", "一", "二", "三", "四", "五", "六"],
		"monthNames": ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
	},
	"en": {
		"format": 'YYYY/MM/DD',
		"applyLabel": "Apply",
		"cancelLabel": "Cancel",
		"fromLabel": "from",
		"toLabel": "to",
		"weekLabel": "Week",
		"daysOfWeek": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
		"monthNames": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    },
};
