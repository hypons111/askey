<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>

<link rel="stylesheet" href="assets/css/system.css">

<div id="systemContainer" class="subContainer">

	<div id="account" class="systemBadge shadow pointer none" onclick="loadAccountSystem()">
		<p class="FW_xb FS_xl" i18n="accountManagementSystem">帳號管理系統</p>
		<img class="" src="./assets/image/system_02.png" alt="">
	</div>
	
	<div id="quotation" class="systemBadge pointer shadow" onclick="loadQuotationSystem()">
		<p class="FW_xb FS_xl" i18n="quoteSystem">報價系統</p>
		<img class="" src="./assets/image/system_01.png" alt="">
	</div>
	
</div>

<script type="text/javascript" src="assets/js/system.js"></script>
