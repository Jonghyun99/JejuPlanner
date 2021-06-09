var idx=0;

//새로고침 감지 및 Controller 정적 계획 리스트 초기화
if(performance.navigation.type == 1){
	var param = window.location.pathname+window.location.search;
	$.ajax({
		url : "/plan/write/clear",
		type : "GET",
		data : {param: param},
		dataType : "text",
		success : function(data) {
			location.href=data;
		},
		error : function(){
			alert("refresh clear err");
		}
	});
	
}


$(function(){
	// 계획 수정 버튼 클릭 시 작동 함수
	$(document).on('click', '#planModifyStart', function(){
		$(".form-control").removeAttr("readonly");
		$("#planModifyStart").css('display','none');
		$("#planModifyEnd").css('display','block');
		$(".deleteSch").css('display','block');
		$("button[id^=schAddBtn]").css('display','block');
	});
	// 계획 수정 완료 버튼 클릭 시 작동 함수
	$(document).on('click', '#planModifyEnd', function(){
		$(".form-control").attr("readonly", 'true');
		$("#planModifyStart").css('display','block');
		$("#planModifyEnd").css('display','none');
		$(".deleteSch").css('display','none');
	});
	$(document).on('click', '.deleteSch', function(){
		// deleteMap 생성
		var deleteMap = {startTime :$(this).siblings('h3').html(),
				planNo : $(this).siblings('.planNo').html(),
				planDay : $(this).siblings('h4').html(), 
				descript :$(this).siblings('.descript').html(), 
				place :  $(this).siblings('h5').html(), 
				addr :  $(this).siblings('h6').html(), 
				longitude : $(this).siblings('.longitude').html(), 
				latitude : $(this).siblings('.latitude').html(), 
				markerNo : $(this).siblings('.markerNo').html()
				}
		console.log(deleteMap);
		//card 안보이게 하기
		$(this).parent().parent().css('display','none');
		$.ajax({
			url : "/plan/view/deleteSch",
			type : "POST",
			data : JSON.stringify(deleteMap),
			contentType : "application/json; charset=utf-8;",
			dataType : "text",
			success : function() {
				
			},
			error : function(){
				alert("delete err");
			}
		});
	});
	//PlanVO 필드 변수 선언
	var userId = $('#userIdCheck').val();
	var planTitle;
	var startDate;
	var planTotalDay = 0;
	var deleteCount = 0;
			
	//드롭다운 값변경 스크립트
    $(".dropdown-menu li a").click(function(){
    	$(".btn-day:first-child").text($(this).text());
    	$(".btn-day:first-child").val($(this).text());
    	//총 일수 변수 초기화
    	planTotalDay = $(this).attr('value');
   });
   // method="post" action="/plan/write/planAdd"
   // Plan 설정 유효성 검사 및 제출
    
   
	// planAdd 유효성 검사
	$(document).on('click', 'button[id=planAddBtn]', function(){
		for(var i=1; i<=planTotalDay; i++){
			//tr의 요소 길이 측정, 값이 없을 시 0
			if ($('#disp'+i+' .card').length == 0) {
				alert('DAY에 일정을 추가해 주세요!');
				return false;
			}
		}
		location.href='/plan/write/planAdd';
	});
	
	//일정 생성 버튼마다 day 순서 받아오기
	$(document).on("click", 'button[id^=schAddBtn]', function(){
		
		//startTime select에 사용될 변수 선언
		if(idx==0){
	        for(var i = 6; i<=24; i++){
				if(i<10){
				$(".startTime").append("<option value="+i+">0"+ i + ":00</option>"); //10시 이전에는 0 붙게 조건문 걸음 ex) 9:00 -> 09:00
			}
				else{
					$(".startTime").append("<option value="+i+">"+ i + ":00</option>");			
				}
				
				//기본값 09:00로 함
				$('select option[value="9"]').attr("selected",true);
			}
		}
		//버튼 tag만! index 값 변수로 받기
        idx = $('button[id^=schAddBtn]').index(this)+1;
        //다른게 열려 있는지 확인하는 로그
        console.log($('.collapse').hasClass('show'));
        console.log($('#userIdCheck').val());
        console.log(userId);
        //다른게 열려 있을 때
        if($('.collapse').hasClass('show')){
        	//modal schDay input에 값 추가
        	$("#schDay"+idx).attr({"value":idx});
        	//collapse 닫기
        	$('.collapse').removeClass('show');
        }
        //다른게 안 열려 있을 때
        else {
        	//modal schDay input에 값 추가
        	$("#schDay"+idx).attr({"value":idx});
        }
        //idx 값 확인 로그
        console.log("idx : " + idx);
    
	});
	
	//method="post" action="/plan/write/schAdd"
	$(document).on('click', 'input[id^=schFrmSubmit]', function(){
		// 장소 값 없이 일정 추가 방지 (장소 유효성 검사)
		if($('#placeInit'+idx).val()==''){
			alert('장소를 추가해 주세요!');
			return false;
		}
	    $.ajax({
	        url: "/plan/write/schAdd",
	        data: $('#schFrm'+idx).serialize(),
	        dataType:"json",
	        type: "POST",
	        success: function(data){
	        	markerCount += 1;
				var schOutput='';
				
				//일정 생성폼에 markNo값 부여
				$('.card .markerNo').val(markerCount + 1);
				$('.card .markerNo').attr("id","markerNo" + (markerCount + 1));
			
				//startTime 형태 바꾸기.
				var hour = data.startTime;
				if(hour < 10) hour = "0" + hour; //1자리 수 일시 0 포맷 추가
				var min = '00';
								
				//card형식으로 바꿈.
				schOutput+= '<div class="card card-count" style="width: 18rem;">';
				schOutput+= '<div class="card-body cardTable">';
				schOutput+= '<h5 class="card-title">' + data.place + '</h5>';
				schOutput+= '<h6 class="card-title">' + data.addr + '</h6>';
				schOutput+= '<h4 class="card-title" style="display:none;">' + data.planDay + '</h4>';
				schOutput+= '<h3 class="card-title" style="display:none;">' + data.startTime + '</h3>';
				schOutput+= '<p id="longitude" style="display:none;">' + data.longitude + '</p>';
				schOutput+= '<p id="latitude" style="display:none;">' + data.latitude + '</p>';
				schOutput+= '<p id="markerNo' +markerCount+ '" style="display:none;">' +markerCount+ '</p>';
				schOutput+= '<h6 id="vall" class="card-subtitle mb-2 text-muted" value='+data.startTime+'>' + hour + ':' + min + '' + '</h6>';
				schOutput+= '<p id="descript" class="card-text">' + data.descript + '</p>';
				schOutput+= '<button type="button" class="btn btn-primary btn-sm deleteSch">delete</button>';
				schOutput+= '</div></div>';
								
				$("#disp"+data.planDay).append(schOutput);
				
				console.log($('#vall').val());
				
				//지도에 마커 찍기 LatLng/위,경 '33.450701, 126.570667'
				scheduleAddMarker(data.latitude, data.longitude, data);
        			
        		
	        },
	        error: function(){
	            alert("일정 추가 실패! 장소를 선택해 주세요!");
	        },
	        /*addr' + i +'" name="addr" value="" readonly/>';
			createStringCollap += '<input type="hidden" id="longitude' + i +'" name="longitude" value="" readonly/>';
			createStringCollap += '<input type="hidden" id="latitude*/	        
	        complete: function(){
	        	$('#contentInit'+idx).val('');
        		$('#placeInit'+idx).val('');
        		$('#addr'+idx).val('');
        		$('#longitude'+idx).val('');
        		$('#latitude'+idx).val('');
	        }
	    });
	});
	
	//장바구니에서 일정 빼기 버튼 (-)
	$(document).on("click", 'button[id^=deletePlan]', function(){
	
		//버튼이 있는 행의 td들의 객체를 변수 선언
		
		var deleteMap = {startTime :$(this).siblings('h3').html() , planDay : idx, descript :$(this).siblings('p').html(), addr :  $(this).siblings('h5').html()}
		
		$.ajax({
			url : "/plan/write/planDel",
			type : "POST",
			data : JSON.stringify(deleteMap),
			contentType : "application/json; charset=utf-8;",
			dataType : "text",
			success : function(data){
				
			},
			error : function() {
				alert("simpleWithObject err");
			},
			complete : function() {
				console.log(deleteMap);
			}
		});
		$(this).parent().parent().remove();
		
	});
	
	//일정정렬 스크립트
	$(document).on("click", 'input[id^=schFrmSubmit]' , function sortTable() {
		setTimeout(function() { // 동시에 입력된 일정은 정렬 안되는 문제 있어서 delay를 0.1초 주었음
			var i, j;
			var dispNum = 1;
			
			//table loop
			while(dispNum<=planTotalDay){
				var card = $('#disp'+dispNum+' .cardTable');
				var timeTag = card.children('h3');
				//버블정렬
				for (i = 0; i<(timeTag.length - 1); i++) {
					for(j = 0; j<(timeTag.length - i); j++) {
						//$()는 객체를 리턴, Node를 출력하고 싶으면 $()[0] 으로 해야한다
						if(parseInt(timeTag.eq(j).html()) > parseInt(timeTag.eq(j+1).html())) {
							//A.insertBefore(B,C) A,B,C 모두 Node여야 한다. A안에서 B를 C의 앞으로 보낸다.
							$('#disp'+dispNum)[0].insertBefore(timeTag.eq(j+1)[0].parentNode.parentNode, timeTag.eq(j)[0].parentNode.parentNode);
						}
					}
				}
				dispNum++;
			}
		}, 100);
	});
	
	
});

