<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>

<div id="systemBadge">
	<img id="badgeLogo" src="./assets/image/Askey_logo.png" alt="">
</div>

<div id="modalBig" class="btn-group shadow">
	<div class="modalBigIcon">
		<i class="fa-solid fa-user"></i>
	</div>
	<button id="greeting" type="button" class="btn btn-light dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
	<div class="dropdown-menu dropdown-menu-right">
		<button class="dropdown-item" type="button" onclick="loadAccountView()" i18n="accountMaintenance">個人資料維護</button>
		<button class="dropdown-item" type="button" onclick="Utils.Logout()" i18n="logout">登出</button>
	</div>
</div>

<div id="modalSmall" class="btn-group shadow">
	<button type="button" class="btn btn-light dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" onclick="loadPreviousPage()">
		<i class="fa-solid fa-user"></i>
	</button>
	<div class="dropdown-menu dropdown-menu-right">
		<button class="dropdown-item" type="button" onclick="loadAccountView()" i18n="accountMaintenance">個人資料維護</button>
		<button class="dropdown-item" type="button" onclick="Utils.Logout()" i18n="logout">登出</button>
	</div>
</div>

<script>
	Utils.SetGreeting();
	function loadAccountView() {
		Utils.SaveReturnPage(document.querySelector("#mainContainer div").id.replace("Container", ""), document.querySelector("#badgeContainer div").id)
		Utils.LoadPage("account", "accountBadge");
	}
</script>