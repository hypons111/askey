<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>

<link rel="stylesheet" href="assets/css/modalCommon.css">

<div id="quotationUpdateModal" class="modal fade" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false" aria-labelledby="myModalLabel" aria-hidden="true">
	
	<div class="modal-dialog">
		<div class="modal-content">
		
			<div class="modal-header">
				<h5 id="modalTitle"></h5>
			</div>
		
			<div class="modal-body">
				<form id="body" class="form-group">
					<input id="updatePId" class="form-control none" type="text">
					
					<div class="formRow">
						<div class="item">
							<div class="lable">
								<p class="star">*</p>
								<p i18n="name">名稱</p>
							</div>
							<input type="text" maxlength="100" id="updatePName" name="updatePName" class="form-control" placeholder="請輸入名稱" i18n="enterProjectName">
						</div>
						<div class="errorMessage none" data-error-type="updatePName">請輸入名稱</div>
					</div>
					
					<div class="formRow">
						<div class="item">
							<div class="lable">
								<p class="star">*</p>
								<p i18n="abbreviation">簡稱</p>
							</div>
							<input type="text" maxlength="100" id="updatePShortName" name="updatePShortName" class="form-control" placeholder="請輸入簡稱" i18n="enterProjectAbbreviation">
						</div>
						<div class="errorMessage none" data-error-type="updatePShortName">請輸入簡稱</div>
					</div>
					
					<div id="customerMenuGroup" class="formRow">
						<div class="item">
							<div class="lable">
								<p class="star">*</p>
								<p i18n="quotationSystem_create_customer">客戶別</p>
							</div>
							<select id="customerMenu" class="form-select btn dropdown-toggle form-control dim" name="customerMenu" onchange="showBlackFont(this)"></select>
						</div>
						<div class="errorMessage none" data-error-type="customerMenu">請選擇客戶別</div>
					</div>
					
					<div id="ValidDateWrapper" class="formRow">
						<div class="item">
							<div class="lable">
								<p class="starBlock">*</p>
								<p i18n="quotationSystem_create_expiryDate">有效日期</p>
							</div>
							<input type="text" id="modalValidDate" name="ValidDate" class="form-control dr" placeholder="請選擇有效日期" onchange="Utils.ClearDate(this)">
						</div>
						<div class="errorMessage none" data-error-type="ValidDate">請選擇日期</div>
					</div>
					
					<div class="formRow">
						<div class="item">
							<div class="lable">
								<p class="starBlock">*</p>
								<p i18n="description">敘述</p>
							</div>
							<textarea type="text" maxlength="70" id="updatePNote" name="updatePNote" rows="3" class="form-control" name="content"></textarea>
						</div>
						<p class="inputNotice" i18n="max70Characters">最多70個字元</p>
						<div class="errorMessage none" data-error-type="updatePNote">請輸入敘述</div>
					</div>
				</form>
			</div>

			<div class="modal-footer">
				<span type="button" id="modalCloseButton" class="btn btn-secondary" data-dismiss="modal" onclick="closeQuotationModal()" i18n="cancel">取消</span>
				<span type="button" id="modalAddButton" class="btn redButton none" onclick="updateQuotation('add')" i18n="save">儲存</span>
				<span type="button" id="modalEditButton" class="btn redButton none" onclick="updateQuotation('edit')" i18n="save">儲存</span>
			</div>

		</div>
	</div>
</div>

<style>
.modal-dialog { 
	
}
</style>