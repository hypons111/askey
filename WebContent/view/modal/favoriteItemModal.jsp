<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>

<link rel="stylesheet" href="assets/css/modalCommon.css">

<div id="favoriteItemModal" class="modal fade" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false" aria-labelledby="myModalLabel" aria-hidden="true">
	
	<div class="modal-dialog">
		<div class="modal-content">
		
			<div class="modal-header">
				<h5 id="modalTitle" i18n="favoriteItem_create_createCustomerServiceItem"></h5>
			</div>

			<div class="modal-body">
				<form id="body" class="form-group">
					<input id="updateItemId" class="form-control none" type="text">
					<input id="updateItemName" class="form-control none" type="text">

					<div class="formRow">
						<div class="item">
							<div class="lable">
								<p class="star">*</p>
								<p i18n="favoriteItem_create_Customer">客戶別</p>
							</div>
							<select id="modalCustomer" name="modalCustomer" class="form-select btn dropdown-toggle dim" onchange="showBlackFont(this)"></select>
						</div>
						<div class="errorMessage none" data-error-type="modalCustomer" i18n="favoriteItem_create_select">請選擇客戶別</div>
					</div>				

					<div class="formRow">
						<div class="item">
							<div class="lable">
								<p class="star">*</p>
								<p i18n="favoriteItem_create_itemType">工項類型</p>
							</div>
							<select id="modalCategory" name="modalCategory" class="form-select btn dropdown-toggle dim" onchange="showBlackFont(this)">
								<option value="0" i18n="pleaseChoose" selected>請選擇</option>
								<option value="1" i18n="engineering">工程類</option>
								<option value="2" i18n="maintenance">維護類</option>
								<option value="3" i18n="other">其它類</option>
							</select>
						</div>
						<div class="errorMessage none" data-error-type="modalCategory" i18n="favoriteItem_create_enterItemType">請選擇工項類型</div>
					</div>

					<div class="formRow">
						<div class="item">
							<div class="lable">
								<p class="star">*</p>
								<p i18n="favoriteItem_create_itemName">品項名稱</p>
							</div>
							<input type="text" id="modalitemName" name="modalitemName" class="form-control" maxlength="50" placeholder="請輸入品項名稱" i18n="favoriteItem_create_enterItemName">
						</div>
						<div class="errorMessage none" data-error-type="modalitemName" i18n="favoriteItem_create_enterItemName">請輸入品項名稱</div>
					</div>
					
					<div class="formRow">
						<div class="item">
							<div class="lable">
								<p class="star">*</p>
								<p i18n="favoriteItem_create_price">價格</p>
							</div>
							<input type="number" id="modalPrice" name="modalPrice" class="form-control" placeholder="請輸入價格" i18n="favoriteItem_create_enterPrice">
						</div>
						<div class="errorMessage none" data-error-type="modalPrice" i18n="favoriteItem_create_enterPrice">請輸入價格</div>
					</div>
					
					<div class="formRow">
						<div class="item">
							<div class="lable">
								<p class="star">*</p>
								<p i18n="favoriteItem_create_unit">單位</p>
							</div>
							<input type="text" id="modalUnit" name="modalUnit" class="form-control" maxlength="30" placeholder="請輸入單位" i18n="favoriteItem_create_enterUnit">
						</div>
						<div class="errorMessage none" data-error-type="modalUnit" i18n="favoriteItem_create_enterUnit">請輸入單位</div>
					</div>
				</form>
			</div>

			<div class="modal-footer">
				<span type="button" id="modalCloseButton" class="btn btn-secondary" data-dismiss="modal" onclick="closeQuotationModal()" i18n="cancel">取消</span>
				<span type="button" id="addFavoriteButton" class="btn redButton none" onclick="updateFavorite('create')" i18n="save">儲存</span>
				<span type="button" id="editFavoriteButton" class="btn redButton none" onclick="updateFavorite('edit')" i18n="save">儲存</span>
			</div>

		</div>
	</div>
</div>