<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>

<link rel="stylesheet" href="assets/css/login.css">

<div id="passwordContainer" class="subContainer shadow">
	
	<div id="header">
		<i class="fa-solid fa-chevron-left" onclick="loadLoginView()"></i>
		<p class="noM" i18n="resetPassword">重設密碼</p>
		<div class="block"></div>
	</div>

	<form id="body" class="form-group">
		<div class="form-group row">
			<label for="loginAccount" i18n="account">帳號</label>
			<div class="input-group">
				<input type="text" id="loginAccount" name="loginAccount" class="form-control" placeholder="請輸入帳號" i18n="enterYourAccount"><span class="input-group-text">@askey.com</span>
			</div>
			<div class="col-sm-5 errorMessage none" data-error-type="loginAccount"></div>
			<button type="button" class="btn btn-danger BGC_askeyRed mt-3" i18n="sendVerificationEmail" onclick="sendVerifyMail()">寄送驗證碼信函</button>
			<p class="FS_s mt-1" i18n="receiveVerificationEmail">點擊[寄送驗證碼信函]後，請至信箱查收驗證碼，並輸至底下[驗證碼]欄位</p>
		</div>

		<div class="LC_lightGray"></div>
		
		<div class="form-group row">
			<label i18n="verificationCode">驗證碼</label>
			<div class="input-group">
				<input type="text" id="verifyCode" name="verifyCode" class="form-control" placeholder="請輸入驗證碼信函中的驗證碼" i18n="enterVerificationCodeFromEmail">
			</div>
			<div class="col-sm-5 errorMessage none" data-error-type="verifyCode"></div>
		</div>
		
		<div class="form-group row">
			<label i18n="newpassword">新密碼</label>
			<div class="input-group">
				<input type="password" class="form-control" id="password1" name="password1" placeholder="請輸入新密碼" i18n="enterANewPassword">
			</div>
			<div class="col-sm-5 errorMessage none" data-error-type="password1"></div>
		</div>
		
		<div class="form-group row">
			<label i18n="newpassword">新密碼</label>
			<div class="input-group">
				<input type="password" class="form-control" id="password2" name="password2" placeholder="請再次輸入新密碼" i18n="enterNewPasswordAgain">
			</div>
			<div class="col-sm-5 errorMessage none" data-error-type="password2"></div>
		</div>
		
		<div class="form-group row footer">
			<span class="btn btn-danger BGC_askeyRed" onclick="submitPassword()" i18n="confirm">確認</span>
		</div>
	</form>
</div>


<script type="text/javascript" src="assets/js/password.js"></script>


