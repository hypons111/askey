<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>

<link rel="stylesheet" href="assets/css/modalCommon.css">

<div id="overDayModal" class="modal fade" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false" aria-labelledby="myModalLabel" aria-hidden="true">

	<div class="modal-dialog">
		<div class="modal-content">

			<div class="modal-header">
				<h5 id="modalTitle" i18n="overDay_alarmNotificationConfiguration">告警通知設定</h5>
			</div>

			<div class="modal-body">
				<div class="formRow">
					<div class="item">
						<div class="input-group">
							<p i18n="overDay_usersWhoHaveNotLoggedInForAPeriod">超過一段時間未登入的使用者將會透過系統通知寄送郵件給管理者</p>
						</div>
					</div>
				</div>
			
				<div class="formRow">
					<div class="item">
						<div class="row g-3 align-items-center">
						  <div class="col-auto">
						    <label for="inputPassword6" class="col-form-label" i18n="overDay_loginExpiryTimeConfiguration">登入逾期時間設定</label>
						  </div>
						  <div class="col-auto">
						    <input type="number" id="modalOverDay" class="form-control" aria-describedby="">
						  </div>
						  <div class="col-auto">
						  	<label for="inputPassword6" class="col-form-label" i18n="overDay_days">天</label>
						  </div>
						</div>
					</div>
				</div>

			</div>
			
			<div class="modal-footer">
				<button id="overDayCancelBtn" type="button" class="btn btn-secondary" data-dismiss="modal" i18n="cancel">取消</button>
				<button id="overDaySaveBtn" type="button" class="btn redButton" dataoverday="" onclick="editOverDay()" i18n="save">儲存</button>
			</div>

		</div>
	</div>
</div>

<style>
#modalOverDay {
	width: 100%;
}
.col-auto {
	margin: 0;
}
.align-items-center div:first-child {
	padding: 0;
}
.align-items-center div:last-child {
	padding: 0;
}
</style>
