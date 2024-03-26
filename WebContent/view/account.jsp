<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>

<link rel="stylesheet" href="assets/css/login.css">

<div id="accountContainer" class="subContainer shadow">

	<div id="header">
		<i class="fa-solid fa-chevron-left" onclick="Utils.LoadPreviousPage()"></i>
		<p class="noM" i18n="accountMaintenance">個人資料維護</p>
		<div class="block"></div>
	</div>

	<form id="body" class="form-group">
		<div class="form-group row">
			<label for="loginAccount" i18n="account">帳號</label>
			<div class="input-group">
				<input id="account" type="text" class="form-control" disabled>
				<span class="input-group-text" id="">@askey.com</span>
			</div>
		</div>

		<div class="form-group row">
			<label for="" i18n="userName">使用者名稱</label>
			<div class="input-group">
				<input id="userName" name="userName" type="text" class="form-control">
			</div>
		</div>

		<div class="form-group row">
			<label i18n="phone">電話</label>
			<div class="input-group">
				<input id="userPhone" name="userPhone" type="number" class="form-control">
			</div>
		</div>

		<div class="form-group row">
			<label i18n="oldPassword">舊密碼</label>
			<div class="input-group">
				<input id="oldPassword" name="oldPassword" type="password" class="form-control" placeholder="請輸入舊密碼" i18n="enterYourOldPassword">
			</div>
		</div>

		<div class="form-group row">
			<label i18n="newPassword">新密碼</label>
			<div class="input-group">
				<input id="newPassword" name="newPassword" type="password" class="form-control" placeholder="請輸入新密碼" i18n="enterYourNewPassword">
			</div>
		</div>

		<div class="form-group row">
			<label i18n="newPassword">新密碼</label>
			<div class="input-group">
				<input id="checkPassword" name="" type="password" class="form-control" placeholder="請再次輸入新密碼" i18n="enterANewPasswordAgain">
			</div>
		</div>

		<div class="form-group row footer">
			<span type="submit" class="btn btn-danger BGC_askeyRed" onclick="accountSubmit()" i18n="confirm">確認</span>
		</div>
	</form>
	
</div>

<script type="text/javascript" src="assets/js/account.js"></script>
