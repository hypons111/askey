<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>

<div id="accountBadge">
	<img id="badgeLogo" src="./assets/image/Askey_logo.png" alt="">
</div>

<div id="modalBig" class="btn-group shadow">
	<div class="modalBigIcon">
		<i class="fa-solid fa-globe"></i>
	</div>
	<button type="button" class="btn btn-light dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" i18n="language">語系選擇</button>
	<div class="dropdown-menu dropdown-menu-right">
		<button class="dropdown-item" type="button" onclick="Utils.ChangeLanguage('tw')">中文</button>
		<button class="dropdown-item" type="button" onclick="Utils.ChangeLanguage('en')">English</button>
	</div>
</div>

<div id="modalSmall" class="btn-group shadow">
	<button type="button" class="btn btn-light dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
	<i class="fa-solid fa-globe"></i>
	</button>
	<div class="dropdown-menu dropdown-menu-right">
		<button class="dropdown-item" type="button" id="tw" onclick="Utils.ChangeLanguage('tw')">中文</button>
		<button class="dropdown-item" type="button" id="en" onclick="Utils.ChangeLanguage('en')">English</button>
	</div>
</div>

