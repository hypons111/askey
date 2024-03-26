<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>

<link rel="stylesheet" href="assets/css/modalCommon.css">

<div id="exportQuotationModal" class="modal fade" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false" aria-labelledby="myModalLabel" aria-hidden="true">
	<input class="form-control none" type="text" value="">

	<div class="modal-dialog">
		<div class="modal-content">

			<div class="modal-header">
				<h5 id="modalTitle" class="modalTitle" i18n="export">匯出</h5>
			</div>

			<div class="modal-body">
				<form id="form" class="form-group">
					<div id="exportType" class="formRow">
						<div class="item">
							<div class="lable">
								<p class="starBlock">*</p>
								<p i18n="selectFileType">選擇檔案類型</p>
							</div>
							<div class="btn-group">
								<div class="form-check">
									<input class="form-check-input" type="radio" id="EXCEL" name="exportType" value="1">
									<label class="form-check-label" for="EXCEL">Excel</label>
								</div>
								<div class="form-check">
									<input class="form-check-input" type="radio" id="PDF" name="exportType" value="0" checked>
									<label class="form-check-label" for="PDF">PDF</label>
								</div>
							</div>
						</div>
					</div>
					
					<div class="formRow">
						<div class="item">
							<div class="lable">
								<p class="starBlock">*</p>
								<p i18n="quotation_export_quotationRemarks">報價單附註(選填)</p>
							</div>
							<textarea type="text" maxlength="70" id="mark" name="updatePNote" rows="3" class="form-control" name="content"></textarea>
						</div>
						<div class="errorMessage none" data-error-type="updatePNote">請輸入敘述</div>
					</div>
					
				</form>
			</div>

			<div class="modal-footer">
				<button type="button" id="exportCloseButton" class="btn btn-secondary" data-dismiss="modal" i18n="cancel">取消</button>
				<button type="button" id="exportSubmitButton" class="btn redButton" onclick="exportReport()" i18n="save">儲存</button>
			</div>

		</div>
	</div>
</div>

<style>
#exportQuotationModal .item {
	padding: 0;
}
</style>
