<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>

<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" href="./assets/image/favicon.png">
    <title>ASKEY</title>
		<link rel="stylesheet" href="assets/css/global.css">
<!-- bootstrap -->
		<link rel="stylesheet" href="assets/css/plugin/bootstrap.min.css">
<!-- font awesome -->
    <link rel="stylesheet" href="assets/css/plugin/all.css" type="text/css"/>
<!-- data table -->
    <link rel="stylesheet" href="assets/js/plugin/DataTables/datatables.min.css">
<!-- daterangepicker -->
    <link rel='stylesheet' href='assets/css/plugin/daterangepicker.min.css'/>
<!-- login page -->
		<link rel="stylesheet" href="assets/css/login.css">
  </head>
  
  <body>
		<noscript>
			<strong>We're sorry. ASKEY doesn't work properly without JavaScript enabled. Please enable it to continue.</strong>
		</noscript>
		
		<div id="topImage">
			<img class="" src="./assets/image/banner_big.png" alt="">
		</div>
		
		<div id="badgeContainer">
			<div id="loginBadge">
				<img id="badgeLogo" src="./assets/image/Askey_logo.png" alt="">
			</div>
			
			<div id="modalBig" class="btn-group shadow">
				<div class="modalBigIcon">
					<i class="fa-solid fa-globe"></i>
				</div>
				<button type="button" class="btn btn-light dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" i18n="language">語系選擇</button>
				<div class="dropdown-menu dropdown-menu-right">
					<button class="dropdown-item" type="button" id="tw" onclick="Utils.ChangeLanguage('tw')">中文</button>
					<button class="dropdown-item" type="button" id="en" onclick="Utils.ChangeLanguage('en')">English</button>
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
		</div>
		
		<div id="mainContainer">
			<div id="loginContainer" class="subContainer shadow">
				<div id="header">
					<div class="block"></div>
					<p i18n="aesqs">亞旭工程服務報價系統</p>
					<div class="block"></div>
				</div>
			
				<form id="form" class="form-group">
				
					<div class="row">
						<label for="loginAccount" i18n="account">帳號</label>
						<div class="input-group">
							<input id="loginAccount" class="form-control" type="text" name="loginAccount" placeholder="請輸入帳號" i18n="enterYourAccount">
							<span class="input-group-text">@askey.com</span>
						</div>
						<div class="col-sm-5 errorMessage none" data-error-type="loginAccount" i18n="error_account">請輸入帳號</div>
					</div>
			
					<div class="row">
						<label for="loginPassword" i18n="password">密碼</label>
						<div class="input-group">
							<input id="loginPassword" type="password" class="form-control" name="loginPassword" placeholder="請輸入密碼" i18n="enterYourPassword">
						</div>
						<div class="col-sm-5 errorMessage none" data-error-type="loginPassword" i18n="error_password">請輸入密碼</div>
					</div>
			
					<div class="row">
						<label for="loginPasscode" i18n="verificationCode">驗證碼</label>
						<div class="input-group">
							<input id="loginPasscode" type="text" class="form-control" name="loginPasscode" placeholder="請輸入驗證碼" onkeyup="capitalize(this)" i18n="enterVerificationCode">
							<img id="checkcode" class="pointer" src="" onclick="getCheckcode()">
						</div>
						<div class="col-sm-5 errorMessage none" data-error-type="loginPasscode" i18n="error_passcode">請輸入驗證碼</div>
					</div>
			
					<div class="form-group row footer">
						<span class="btn btn-danger BGC_askeyRed" onclick="submit()" i18n="login">登入</span>
						<u id="forgetPasswordLink" class="FC_askeyRed pointer" onclick="loadPasswordView()" i18n="forgetPassword">忘記密碼</u>
					</div>
				</form>
			</div>
			
			<div id="bottomImage">
				<img class="" src="./assets/image/logo_white.svg" alt="">
				<p>Copy © Top Cloud Technology Inc. All rights reserved.</p>
				<p>雲鼎數位科技股份有限公司</p>
			</div>
		
		</div>

		<!-- bootstrap, jquery -->
		<script src="assets/js/plugin/popper.min.js"></script>
		<script src="assets/js/plugin/jquery-3.2.1.js"></script>
		<script src="assets/js/plugin/bootstrap.min.js"></script>
		<script src="assets/js/plugin/underscore-min.js"></script>
		<script src="assets/js/plugin/moment.min.js"></script>
		<script src="assets/js/plugin/validate.min.js"></script>
		<script src="assets/js/plugin/jquery.i18n.min.js"></script>
		
		<!-- utils -->
		<script src="assets/js/utils.js"></script>
		<!-- data table -->
		<script src="assets/js/plugin/DataTables/datatables.min.js"></script>
		<!-- daterangepicker -->
		<script src="assets/js/plugin/daterangepicker.min.1110.js"></script>
		<!-- axios -->
		<script src="assets/js/plugin/axios.min.js"></script>
		<!-- login page -->
		<script type="text/javascript" src="assets/js/login.js"></script>
		
  </body>
</html>

