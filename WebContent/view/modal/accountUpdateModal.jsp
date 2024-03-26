<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>

<link rel="stylesheet" href="assets/css/modalCommon.css">

<div id="updateAccountModal" class="modal fade" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false" aria-labelledby="myModalLabel" aria-hidden="true">

	<div class="modal-dialog">
		<div class="modal-content">
		
			<div class="modal-header"></div>
			
			<div class="modal-body">
				<form id="form" class="form-group">
					<input id="accountId" class="form-control none" type="text">

					<div class="formRow userItem pageItem">
						<div class="item">
							<div class="lable">
								<p class="star">*</p>
								<p i18n="accountSystem_account">使用者帳號</p>
							</div>
							<div id="userAccountGroup" class="input-group">
								<input id="modalUserAccount" type="text" name="modalUserAccount" class="form-control setDisabled" placeholder="請輸入您目前使用的電子郵件（請勿包含@askey.com）" i18n="accountSystem_createAccount_enterYourCurrentEmailAddress">
								<span class="input-group-text">@askey.com</span>
							</div>
						</div>
						<div class="errorMessage none" data-error-type="modalUserAccount" i18n="accountSystem_createAccount_enterYourCurrentEmailAddress">請輸入您目前使用的電子郵件</div>
					</div>
					
					<div class="formRow userItem pageItem">
						<div class="item">
							<div class="lable">
								<p class="star">*</p>
								<p i18n="userName">使用者名稱</p>
							</div>
							<input id="modalUserName" type="text" name="modalUserName" class="form-control setDisabled" placeholder="請輸入使用者名稱" i18n="accountSystem_createAccount_enterUserName">
						</div>
						<div class="errorMessage none" data-error-type="modalUserName" i18n="accountSystem_createAccount_enterUserName">請輸入使用者名稱</div>
					</div>

					<div class="formRow customerItem pageItem none">
						<div class="item">
							<div class="lable">
								<p class="star">*</p>
								<p i18n="accountSystem_createCustomer_customer">客戶名稱</p>
							</div>
							<input id="modalCustomerId" type="text" name="" class="none" placeholder="">
							<input id="modalCustomerName" type="text" name="modalCustomerName" class="form-control setDisabled" placeholder="請輸入客戶名稱" i18n="accountSystem_createCustomer_enterCustomer">
						</div>
						<div class="errorMessage none" data-error-type="modalCustomerName" i18n="accountSystem_createCustomer_enterCustomer">請輸入客戶名稱</div>
					</div>
					
					<div class="formRow">
						<div class="item">
							<div class="lable">
								<p class="starBlock">*</p>
								<p i18n="accountSystem_createAccount_tel">電話</p>
							</div>
							<input id="modalPhone" name="phone" class="form-control setDisabled" placeholder="請輸入電話" i18n="accountSystem_createCustomer_enterTel">
						</div>
					</div>

					<div class="formRow customerItem pageItem none">
						<div class="item">
							<div class="lable">
								<p class="starBlock">*</p>
								<p i18n="address">地址</p>
							</div>
							<input id="modalAddress" type="text" name="address" class="form-control setDisabled" maxlength="100" placeholder="請輸入地址" i18n="accountSystem_createCustomer_enterAddress">
						</div>
					</div>

					<div class="formRow customerItem pageItem none">
						<div class="item">
							<div class="lable">
								<p class="starBlock">*</p>
								<p i18n="accountSystem_createCustomer_email">電郵地址</p>
							</div>
							<input id="modalEmail" type="text" name="address" class="form-control setDisabled" placeholder="請輸入電郵地址" i18n="accountSystem_createCustomer_email">
						</div>
					</div>

					<div class="formRow customerItem pageItem none">
						<div class="item">
							<div class="lable">
								<p class="star">*</p>
								<p i18n="currency">幣別</p>
							</div>
							<select id="modalCurrency" class="form-select btn dropdown-toggle setDisabled">
								<option value='TWD' i18n="">TWD</option>
								<option value='JPY' i18n="">JPY</option>
								<option value='USD' i18n="">USD</option>
							</select>
						</div>
					</div>

					<div class="formRow userItem pageItem">
						<div class="item">
							<div class="lable">
								<p class="star">*</p>
								<p i18n="role">角色</p>
							</div>
							<select id="modalRole" class="form-select btn dropdown-toggle setDisabled" onchange="onChangeRole(this)">
								<option value='admin' i18n="admin">管理者</option>
								<option value='sales' i18n="sales">業務</option>
							</select>
						</div>
					</div>

					<div id="handleCustomersGroup" class="formRow userItem pageItem">
						<div class="item">
							<div class="lable">
								<p class="star">*</p>
								<p i18n="accountSystem_handleCustomer">負責客戶</p>
							</div>
				  		<div class="btn-group">

								<!-- 顯示已勾選的客戶 -->
								<button id="checkedCustomerNameWrapper" type="button" name="checkedCustomerNameWrapper" class="btn dropdown-toggle setDisabled dropDownButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
									<p id="checkedCustomerName" class="" i18n="pleaseChoose">請選擇</p>
								</button>
								
								<div class="dropdown-menu">
									<button class='dropdown-item' type='button' onclick="customerCheckBoxHandler('0', '全選')">
										<input id="modalAllCustomer" name="modalAllCustomer" class='form-check-input' type='checkbox' value='0'>&ensp;
										<label i18n="all">全選</label>
									</button>
									
									<!-- 客戶選單 -->
									<div id="modalHandleCustomer"></div>	
								</div>
																	
							</div>
						</div>
						<div class="errorMessage none" data-error-type="checkedCustomerNameWrapper">請選擇客戶</div>
					</div>
					
					<div class="formRow">
						<div class="item">
							<div class="lable">
								<p class="star">*</p>
								<p i18n="status">狀態</p>
							</div>
							<div class="btn-group">
								<div class="form-check">
								  <input class="form-check-input" type="radio" id="modalStatus_1" name="status" value="1">
								  <label class="form-check-label" for="modalStatus_1" i18n="on">啟用</label>
								</div>
								<div class="form-check">
								  <input class="form-check-input" type="radio" id="modalStatus_0" name="status" value="0">
								  <label class="form-check-label" for="modalStatus_0" i18n="off">停用</label>
								</div>
								<div class="form-check none">
								  <input class="form-check-input" type="radio" id="modalStatus_2" name="" value="2">
								</div>
							</div>
						</div>
					</div>
				</form>
				
			</div>

			<div class="modal-footer">
				<span id="modalCanel" type="button" class="btn btn-secondary" data-dismiss="modal" i18n="cancel">取消</span>
				<span type="button" class="btn redButton" onclick="update()" i18n="save">儲存</span>
			</div>

		</div>
	</div>
</div>

<style>
#modalRole {
	--bs-btn-hover-border-color: var(--bs-border-color);
}
.input-group-text {
	max-width: fit-content;
	mix-width: fit-content;
}
.form-check-input {
	width: 1em !important;
}
</style>

