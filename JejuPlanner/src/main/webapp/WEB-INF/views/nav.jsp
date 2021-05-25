<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
  <!-- 네비게이션 바-->
<nav class="navbar navbar-expand-lg navbar-dark bg-dark navbar-fixed-top">
  <div class="container-fluid">
    <a class="navbar-brand" href="/plan/write">GDJ32 G조</a>
    
      <ul class="nav navbar-nav ">
        <li class="nav-item">
          <a class="nav-link" href="/plan/write">일정 만들기</a>
        </li>
        <li class="nav-item  ">
          <a class="nav-link" href="#" onclick="javascript:document.planListForUser.submit();">내 일정 보관</a>
        </li>
        <li class="nav-item  ">
          <a class="nav-link" href="/plan/list">공유 일정</a>
        </li>
        <li class="nav-item ">
          <a class="nav-link" href="#">이용 안내</a>
        </li>
        <li class="nav-item logout" style="padding-right: 33px; padding-left: 33px;">
        	<!-- 로그인 체크 -->
        	<c:if test="${member.userId != null}">
          		<a class="nav-link" href="/member/logout">로그아웃</a>
          	</c:if>
          	<c:if test="${member.userId == null}">
          		<a Class="nav-link" href="/">로그인</a>
          	</c:if>
        </li>
      </ul>
 </div>
</nav>

<!-- 내 일정 보관 열람 POST처리를 위한 form -->
<form name="planListForUser" action="/plan/list/user" method="POST">
	<input type="hidden" name="userId" value="${member.userId}"></input>
</form>