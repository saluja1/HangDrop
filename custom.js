var viewportWidth = $(window).width();
var viewportHeight = $(window).height();
var protocolRef=0<=location.href.toLowerCase().indexOf("https")?"https:":"http:";

function createDialog(b, a) {
    var c = a ? $("#rootDiv" + a.primeKey) : $("#rootDiv");
    a || (a = {
        primeKey: 1
    });
    if (!$("#alertBox" + a.primeKey).length) {
        var d = $("<div>");
        d.prop({
            id: "alertBox" + a.primeKey
        });
        d.css({
            left: -1,
            top: -1,
            width: c.width() + 10,
            height: c.height() + 10,
            backgroundImage: "url(" + protocolRef + "//dcqhpema7gk9a.cloudfront.net/IND/HTML5/transparent.png)",
            position: "absolute",
            zIndex: 3E3
        });
        c.append(d);
        var e = $("<div>");
        e.prop({
            id: "alertBoxContent" + a.primeKey,
            align: "center"
        });
        e.css({
            width: 300,
            backgroundColor: "#eeeeee",
            borderTopWidth: 25,
            position: "absolute"
        });
        e.html("<br><b>" + b + "</b><br><br><br><input type='button' value='   OK   ' onclick='hideDialog(this)'/><br>&nbsp;");
        d.append(e);
        e.css({
            left: Math.round((c.width() - e.width()) / 2),
            top: Math.round((c.height() - e.height() - 25) / 2)
        });
        $(e).addClass("borderClass shadowClass")
    }
}

function hideDialog(b) {
    b.length ? b.remove() : $(b).parents("[id^=alertBox]").remove()
}

$.fn.HangDropPlugin = function(HDObj)
{	
	var _obj = 
	{
		nextBRef: ($("#forwardbutton").length)? "#forwardbutton" : ($("#nextButton").length)? "#nextButton" : "#btn_continue",
		primeKey: (isNaN(this.prop("id").charAt(this.prop("id").length - 1)))? "_" : this.prop("id").substr(3,4) + "_",
		okLabel: "   OK   ",
		errMsg1: "Please drag each card over the given scale.",
		errMsg2: "Please fill the other specify textbox.",
		loadingText : "Loading Images...",
		appFontSize : 14,

		headingText: ["Best Days Ahead","Best Days Behind"],
		cardArray: [1,2,3,4,5,6,8,9,10,11,12,13,14,15,16,17,18,19],
		cardText: ["Gran Turismo","Need for Speed","Grid","Forza","Mario Kart","DRIVECLUB","F1","Project Cars","The Crew","iRacing","Assetto Corsa Competizione","RaceRoom","rFactor ","Grand Theft Auto","Wipeout","Crash Team Racing","Team Sonic Racing","Burnout"], //Please pass the text in the same order of precodes passed to the cardArray parameter//
		scaleStart: 0,
		scaleEnd: 20,
		scaleInterval: 1,
		scaleNumVisibleInterval: 1,
		backImageWidth: 949,
		backImageHeight:277,
		yPosArray : [291,277,253,212,170,156,156,156,156,156,156,156,156,156,156,156,170,200,242,277,291],
		scaleWidth: 0,
		stageWidth: 0,
		imageWidth: 100,
		imageHeight: 60,
		cardWidth: 120,
		cardHeight: 80,
		cardDistance: 10,
		smallImagePath: "//media7.surveycenter.com/1634457/HTML5/Graph/demo1/images/",
		largeImagePath: "",
		imageExtension: ".jpg",
		calc: 0,
		gap: 0,
		posX: 0,
		posY: 1,
		oldPosX: 0,
		dataArray: new Array(),
		otherSpecify: [], //Leave it blank if you don't have other specify card//
		otherSpecifyMandatory: true, //Put false if rating other specify card(s) is not mandatory//
		oneCardPerScale: false,
		dep: 500,
		dropInFlag: false,
		dragFlag: false,
		zoomRef: null,
		timer: null,
		oldViewportSize: 0,
		isAndroid: (navigator.userAgent.toLowerCase().indexOf("android") > -1)? true : false,
		startPosX: 0,
		startPosY: 0,
		finishFlag: true
	}
	$.extend(_obj, HDObj);

	//_obj.cardWidth = _obj.imageWidth + 20;
	_obj.scaleWidth = 870;
	_obj.stageWidth = _obj.scaleWidth + _obj.cardWidth + 10;
	_obj.posX = Math.round(_obj.cardWidth/2 + 4);
	_obj.oldPosX = _obj.posX;

	if($("meta[name=viewport]").length && viewportWidth < _obj.stageWidth)
	{
		$("meta[name=viewport]").prop('content', 'width=' + (_obj.stageWidth + 20));
	}
	
	var rootDiv = $("<div>");
	rootDiv.prop({id: "rootDiv" + _obj.primeKey});
	rootDiv.css({width: _obj.stageWidth, position: "relative"});
	//rootDiv.addClass("borderClass");
	this.html("");
	this.append(rootDiv);

	document.body.ondragstart = function(){return true};
	$(document.body).on("selectstart", function(){return false});
	$(_obj.nextBRef).css({visibility: "visible", display: "inline"});
	$(_obj.nextBRef).on("click", submitHandler);
	
	createPiles();

	function createPiles()
	{
		var headerT;
		var scalePoint;
		var decimalFix;
		var textNode;
		var val;
		var leftText;

		


		backImage = $("<img>");
		backImage.prop({id: "backImage" + _obj.primeKey, src: protocolRef + "//media7.surveycenter.com/1634457/HTML5/Graph/demo1/images/background.jpg"});		
		backImage.css({width: _obj.backImageWidth, height: _obj.backImageHeight, position: "absolute", left: (_obj.stageWidth-_obj.backImageWidth)/2, top: 10});
		rootDiv.append(backImage);

		/*leftText = $("<div>");
		leftText.css({ width: 20,height: 22, position: "absolute", left: backImage.position().left,top:10});
		leftText.html("Best Days Ahead")
		rootDiv.append(leftText);*/


		var headerWidth = (Math.round((_obj.scaleWidth + 115)/_obj.headingText.length) > 115)? 155 : Math.round((_obj.scaleWidth + 115)/_obj.headingText.length);
		var max = _obj.posY;
		var headerPosX = Math.round(_obj.posX-10);
		for(var i = 0; i < _obj.headingText.length; i++)
		{
			headerT = $("<div>");
			headerT.prop({id: "headerT" + _obj.primeKey + i, align: "center"});
			headerT.html("" + _obj.headingText[i] + "");
			headerT.css({fontSize:17, cursor: "default", width: headerWidth - 5, position: "absolute", left: headerPosX, top: _obj.posY+20});
			headerPosX += headerWidth + Math.round((_obj.scaleWidth - headerWidth * (_obj.headingText.length))/(_obj.headingText.length - 1));
			$("#rootDiv" + _obj.primeKey).append(headerT);
			max = (headerT.height() > max)? headerT.height() : max;
			//headerT.addClass("borderClass");
		}
		_obj.posY = max + 30;

		var scaleNumTip = $("<div>");
		scaleNumTip.prop({id: "scaleNumTip" + _obj.primeKey});
		scaleNumTip.css({color: "#ff0000", fontSize: 11, textAlign: "center", position: "absolute", top: _obj.posY - 12});
		$("#rootDiv" + _obj.primeKey).append(scaleNumTip);

		var scale = $("<div>");
		scale.prop({id: "scale" + _obj.primeKey});
		scale.css({width: _obj.scaleWidth, height: 15, backgroundColor: "#ffffff", backgroundImage: "url(" + protocolRef + "//dcqhpema7gk9a.cloudfront.net/IND/HTML5/sliderBG.jpg)", position: "absolute", left: _obj.posX, top: _obj.posY,visibility:"hidden"});
		scale.addClass("shadowClass");
		$("#rootDiv" + _obj.primeKey).append(scale);
		
		var scaleCapLeft = $("<div>");
		scaleCapLeft.css({backgroundImage: "url(" + protocolRef + "//dcqhpema7gk9a.cloudfront.net/IND/HTML5/sliderCapLeft.png)", height: 22, width: 20, position: "absolute", left: -16});
		scale.append(scaleCapLeft);

		var scaleCapRight = $("<div>");
		scaleCapRight.prop({id: "scaleCapRight" + _obj.primeKey});
		scaleCapRight.css({backgroundImage: "url(" + protocolRef + "//dcqhpema7gk9a.cloudfront.net/IND/HTML5/sliderCap.png)", height: 22, width: 20, position: "absolute", left: _obj.scaleWidth});
		scale.append(scaleCapRight);

		if(!document.addEventListener && window.PIE)
		{
			PIE.attach(document.getElementById("scale" + _obj.primeKey));
		}

		_obj.calc = (_obj.scaleEnd > _obj.scaleStart)? _obj.scaleEnd/_obj.scaleInterval - _obj.scaleStart/_obj.scaleInterval + 1 : _obj.scaleStart/_obj.scaleInterval - _obj.scaleEnd/_obj.scaleInterval + 1;
		_obj.gap = _obj.scaleWidth/(_obj.calc - 1);
		_obj.posX = 0;
		var counter = (_obj.scaleStart == 0)? 0 : _obj.scaleStart;
		for(var i = 0; i < _obj.calc; i++)
		{
			scalePoint = $("<div>");
			scalePoint.prop({id: "scalePoint" + _obj.primeKey + counter.toFixed(1)});
			scalePoint.css({width: 1, height: 8, top: 4, backgroundColor: "#888888", position: "absolute", left: _obj.posX});
			scalePoint.data({hasTextNode: false});

			decimalFix = (String(_obj.scaleInterval).indexOf(".") == -1)? counter.toFixed(1) : i;
			if(decimalFix % _obj.scaleNumVisibleInterval == 0 || counter.toFixed(1) == _obj.scaleStart)
			{
				scalePoint.css({height: 14, top: 1});

				textNode = $("<div>");
				textNode.prop({id: "textNode" + _obj.primeKey + counter.toFixed(1)});
				textNode.css({cursor: "default", position: "absolute", top: -22});
				scalePoint.data({hasTextNode: true});
				val = (String(_obj.scaleInterval).indexOf(".") != -1)? counter.toFixed(1) : counter.toFixed(0)
				textNode.html("<b>" + val + "</b>");
				scale.append(textNode);
				textNode.css({left: _obj.posX - textNode.width()/2});
			}
			scalePoint.data({scalePosX: _obj.posX + scale.position().left, scalePosY: _obj.posY});
			scale.append(scalePoint);
			_obj.posX += _obj.gap;
			counter += (_obj.scaleEnd > _obj.scaleStart)? _obj.scaleInterval : -_obj.scaleInterval;
		 }
		 
		 _obj.posX = Math.round((_obj.stageWidth - (_obj.cardArray.length * _obj.cardWidth + (_obj.cardArray.length - 1) * _obj.cardDistance))/2);
		 
		 if(_obj.posX <= 0)
		 {
			_obj.posX = 0;
			while(_obj.posX + _obj.cardWidth <= _obj.stageWidth)
			{
				_obj.posX += _obj.cardWidth + _obj.cardDistance;
			}
			_obj.posX = Math.round((_obj.stageWidth - _obj.posX + _obj.cardDistance)/2);
		 }
		 _obj.oldPosX = _obj.posX;
		 _obj.posY += (_obj.cardHeight)*2 + 120;

		 var hLine = $("<div>");
		 hLine.prop({id: "hLine" + _obj.primeKey});
		 hLine.css({position: "absolute", left: _obj.cardWidth/2 + 4, top : scale.position().top + 17, width: _obj.stageWidth - _obj.cardWidth - 12, height: _obj.cardHeight + 138, border: "solid 1px #bbbbbb", borderLeft: "solid 2px #999999", backgroundColor: "#fafafa",visibility:"hidden"});
		 $("#rootDiv" + _obj.primeKey).append(hLine);

		 createCards();
	}


	function createCards()
	{
		var card;
		var cardContent;
		var pin;
		var openEndBox;
		var tooltip;
		var dragOpts;
		var zoomIcon;
		var zoomImage;

		var backgroundBox = $("<div>");
		backgroundBox.prop({id: "backgroundBox" + _obj.primeKey});
		backgroundBox.css({width: _obj.cardWidth + 18, height: _obj.cardHeight + 56, backgroundColor: "#cccccc", border: "ridge 4px #999999", position: "absolute", left: _obj.posX - 11, top: _obj.posY - 50, cursor: "default", paddingTop: 2, visibility: (_obj.cardWidth == Math.abs(_obj.cardDistance))? "visible" : "hidden", textAlign: "center"});
		backgroundBox.html("<b><u>Card Deck</u></b>");
		$("#rootDiv" + _obj.primeKey).append(backgroundBox);


		for(var i = 0; i < _obj.cardArray.length; i++)
		{
			card = $("<div>");
			card.prop({id: "card" + _obj.primeKey + _obj.cardArray[i], align: "center"});
			card.css({minWidth: _obj.cardWidth, maxWidth: _obj.cardWidth, height: _obj.cardHeight, position: "absolute", left: _obj.posX, top: _obj.posY, cursor: "pointer", zIndex: _obj.cardArray.length - i, borderRadius: 4, border: "solid 1px #206689", borderRight: "solid 2px #206689", borderBottom: "solid 2px #206689", background: "#2d87b4"});
			card.data({num: i, depth: card.css("zIndex"), droppedInside: false, cardPosX: _obj.posX, cardPosY: _obj.posY});
			$("#rootDiv" + _obj.primeKey).append(card);

			cardContent = $("<div>");
			cardContent.html(_obj.cardText[i]);
			cardContent.css({position: "relative", width: _obj.cardWidth - 4, top: _obj.imageHeight + 20, color:"#ffffff", fontWeight:"bold", fontSize : _obj.appFontSize + "px"});

			cardImage = $("<img>");
			cardImage.prop({id: "cImage" + _obj.primeKey + _obj.cardArray[i]});
			cardImage.css({width: _obj.imageWidth, height: _obj.imageHeight, background: "url(" + protocolRef + "//dcqhpema7gk9a.cloudfront.net/IND/HTML5/loader.gif)", backgroundRepeat: "no-repeat", backgroundPosition: "center center", position: "absolute", left: 10, top: 10});
			//card.append(cardImage);

			card.append(cardContent);
			cardContent.css({top: Math.round((_obj.cardHeight - cardContent.height())/2)});

			if(_obj.largeImagePath != "")
			{
				zoomIcon = $("<img>");
				zoomIcon.prop({id: "zoomIcon" + _obj.primeKey + _obj.cardArray[i], src: protocolRef + "//dcqhpema7gk9a.cloudfront.net/IND/HTML5/zoom.png"});
				zoomIcon.css({position: "absolute", left: _obj.cardWidth - 30, top: _obj.imageHeight - 10, cursor: "pointer"});
				card.append(zoomIcon);

				zoomImage = $("<img>");
				zoomImage.prop({id: "zImage" + _obj.primeKey + _obj.cardArray[i]});
				zoomImage.css({border: "solid 1px #ababab", boxShadow: "1px 1px 1px rgba(60,60,60,1)", position: "absolute", visibility: "hidden", width:220, height:220});
				$("#rootDiv" + _obj.primeKey).append(zoomImage);
			}

			if(document.addEventListener)
			{
				card.addClass("msTouchClass");
			}

			//cardImage.on("load", {_obj: _obj}, loadHandler);
			/*if(_obj.largeImagePath != "")
			{
				zoomImage.on("load", {_obj: _obj}, loadHandler);
				zoomIcon.on("mouseup", showZoomHandler);
				zoomImage.on("click", hideZoomHandler);
			}*/

			cardImage.prop({src: protocolRef + _obj.smallImagePath + _obj.cardArray[i] + _obj.imageExtension});

			if(_obj.largeImagePath != "")
			{
				zoomImage.prop({src: protocolRef + _obj.largeImagePath + _obj.cardArray[i] + _obj.imageExtension});
			}

			pin = $("<img>");
			pin.prop({id: "pin" + _obj.primeKey + _obj.cardArray[i], src: protocolRef + "//dcqhpema7gk9a.cloudfront.net/IND/HTML5/pin.png"});
			pin.css({width: 21, height: 26, position: "absolute"});
			card.append(pin);
			pin.css({left: _obj.cardWidth/2 - pin.width()/2, top: -pin.height() + 1});
			
			for(var j = 0; j < _obj.otherSpecify.length; j++)
			{
				if(_obj.otherSpecify[j] == _obj.cardArray[i])
				{
					//cardContent.css({top: Math.round((_obj.cardHeight - cardContent.height())/2) - 18});

					openEndBox = $("<input>");
					openEndBox.prop({id: "openEnd" + _obj.primeKey + _obj.cardArray[i], type: "text"});
					openEndBox.css({width: _obj.cardWidth - 20, position: "relative", top: cardContent.position().top + 5 + "px"});
					card.append(openEndBox);

					tooltip = $("<div>");
					tooltip.prop({id: "tooltip" + _obj.primeKey + _obj.cardArray[i]});
					tooltip.html("Please fill the textbox and then drag the card.");
					tooltip.css({backgroundColor: "#ffff00", border: "solid 1px #999999", position: "relative", width: _obj.cardWidth - 2, left: 0, visibility: "hidden"});
					card.append(tooltip);
					tooltip.css({top: cardContent.position().top - 22 - tooltip.height()});
					
					card.draggable({disabled: true});
					card.on("mousedown", otherSpecifyCardHandler);
					openEndBox.on("keyup", keysHandler);
					break;
				}
			}
			
			_obj.posX += _obj.cardWidth + _obj.cardDistance;
			if(_obj.posX + _obj.cardWidth > _obj.stageWidth)
			{
				_obj.posX = _obj.oldPosX;
				_obj.posY += _obj.cardHeight + 25;
			}
			_obj.dataArray.push(-999);
			dragOpts = {containment: "#rootDiv" + _obj.primeKey, start: dragStartHandler, drag: draggingHandler, stop: dragStopHandler};
			card.draggable(dragOpts);
		}

		var evalHeight = card.position().top + _obj.cardHeight;
		$("#rootDiv" + _obj.primeKey).css({height: evalHeight + 20});

	}

	function dragStartHandler(pEvent, pObj)
	{
		var ref = $(pEvent.target);
		var refId = ref.prop("id").substr(ref.prop("id").indexOf("_") + 1, 8);

		_obj.dragFlag = false;
		_obj.startPosX = ref.position().left;
		_obj.startPosY = ref.position().top;

		if($("#openEnd" + refId))
		{
			$("#openEnd" + refId).blur();
		}

		ref.css({zIndex: _obj.dep++});
	}

	function draggingHandler(pEvent, pObj)
	{
		var ref = $(pEvent.target);
		var refId = ref.prop("id").substr(ref.prop("id").indexOf("_") + 1, 8);

		if((Math.abs(ref.position().left - _obj.startPosX) > 5 || Math.abs(ref.position().top - _obj.startPosY) > 5) && _obj.dragFlag == false)
		{
			_obj.dragFlag = true;
		}

		ref.data({droppedInside: false});
		$("#pin" + _obj.primeKey + refId).prop({src: protocolRef + "//dcqhpema7gk9a.cloudfront.net/IND/HTML5/pin.png"});
		$("#scaleNumTip" + _obj.primeKey).css({visibility: "hidden"});

		var counter = (_obj.scaleStart == 0)? 0 : _obj.scaleStart;
		var refH = ref.position().left + _obj.cardWidth/2;
		var refV = ref.position().top;
		
		for(var i = 0; i < _obj.calc; i++)
		{
			var scalePointRef = $("#scalePoint" + _obj.primeKey + counter.toFixed(1).replace(".","\\."));
			if(refH >= scalePointRef.data("scalePosX") - _obj.gap/2 && refH < scalePointRef.data("scalePosX") + _obj.gap/2 && refV < $("#hLine" + _obj.primeKey).position().top + $("#hLine" + _obj.primeKey).height() + 25)
			{
				scalePointRef.css({backgroundColor: "#ff0000"});
				ref.data({droppedInside: scalePointRef});
				$("#pin" + _obj.primeKey + refId).prop({src: protocolRef + "//dcqhpema7gk9a.cloudfront.net/IND/HTML5/pinRed.png"});
				
				if(scalePointRef.data("hasTextNode") == false)
				{
					$("#scaleNumTip" + _obj.primeKey).css({visibility: "visible", left: scalePointRef.data("scalePosX") - $("#scaleNumTip" + _obj.primeKey).width()/2});
					$("#scaleNumTip" + _obj.primeKey).html((String(_obj.scaleInterval).indexOf(".") != -1)? ref.data("droppedInside").prop("id").substr(ref.data("droppedInside").prop("id").indexOf("_") + 1, 10) : ref.data("droppedInside").prop("id").substring(ref.data("droppedInside").prop("id").indexOf("_") + 1, ref.data("droppedInside").prop("id").indexOf(".")));
				}
				else
				{
					$("#textNode" + _obj.primeKey + counter.toFixed(1).replace(".","\\.")).css({color: "#ff0000"});
				}
			}
			else
			{
				scalePointRef.css({backgroundColor: "#888888"});
				if(scalePointRef.data("hasTextNode"))
				{
					$("#textNode" + _obj.primeKey + counter.toFixed(1).replace(".","\\.")).css({color: "#000000"});
				}
			}
			counter += (_obj.scaleEnd > _obj.scaleStart)? _obj.scaleInterval : -_obj.scaleInterval;
		}
	}

	function dragStopHandler(pEvent, pObj)
	{
		var ref = $(pEvent.target);
		var refId = ref.prop("id").substr(ref.prop("id").indexOf("_") + 1, 8);

		setTimeout(function(){_obj.dragFlag = false}, 200);
		
		$("#pin" + _obj.primeKey + refId).prop({src: protocolRef + "//dcqhpema7gk9a.cloudfront.net/IND/HTML5/pin.png"});
		$("#scaleNumTip" + _obj.primeKey).css({visibility: "hidden"});
		if(ref.data("droppedInside").length && ref.data("droppedInside").data("hasTextNode"))
		{
			$("#textNode" + _obj.primeKey + ref.data("droppedInside").prop("id").substr(ref.data("droppedInside").prop("id").indexOf("_") + 1, 10).replace(".","\\.")).css({color: "#000000"});
		}

		if(ref.data("droppedInside") != false)
		{
			var dataRef = (String(_obj.scaleInterval).indexOf(".") != -1)? ref.data("droppedInside").prop("id").substr(ref.data("droppedInside").prop("id").indexOf("_") + 1, 10) : ref.data("droppedInside").prop("id").substring(ref.data("droppedInside").prop("id").indexOf("_") + 1, ref.data("droppedInside").prop("id").indexOf("."));

			if(_obj.oneCardPerScale)
			{
				for(var i = 0; i < _obj.dataArray.length; i++)
				{
					if(_obj.dataArray[i] == dataRef && _obj.cardArray[i] != refId)
					{
						break;
					}
				}
			}
		}

		if(ref.data("droppedInside") == false || i < _obj.dataArray.length)
		{
			ref.data({droppedInside: false});
			if($("#openEnd" + refId))
			{
				$("#openEnd" + refId).prop({disabled: false});
			}
			$(ref).animate({left: ref.data("cardPosX"), top: ref.data("cardPosY")}, 400);
			_obj.dataArray[ref.data("num")] = -999;
			if(_obj.cardWidth != Math.abs(_obj.cardDistance) && _obj.cardDistance < 0)
			{
				ref.css({zIndex: ref.data("depth")});
			}
		}
		else
		{
			if($("#openEnd" + refId))
			{
				$("#openEnd" + refId).prop({disabled: true});
			}
			ref.data("droppedInside").css({backgroundColor: "#888888"});
			
			//$(ref).animate({left: ref.data("droppedInside").data("scalePosX") - _obj.cardWidth/2, top: ref.data("droppedInside").data("scalePosY")}, 500, 'easeOutBounce');
			$(ref).animate({left: ref.data("droppedInside").data("scalePosX") - _obj.cardWidth/2, top: _obj.yPosArray[dataRef]}, 500, 'easeOutBounce');
			//$("#" + pEvent.target.id).transition({rotate: "180deg"}, 5000, 'easeOutCubic')
			//console.log(_obj.yPosArray[dataRef]);

			dataRef =  dataRef > 9 ? "" + dataRef: "0" + dataRef;
	
			_obj.dataArray[ref.data("num")] = dataRef;

		}
		//alert(_obj.dataArray);
	}

	function otherSpecifyCardHandler(pEvent)
	{
		var ref = $(pEvent.currentTarget);
		var refId = ref.prop("id").substr(ref.prop("id").indexOf("_") + 1, 8);
	
		if($.trim($("#openEnd" + _obj.primeKey + refId).prop("value")) == "")
		{
			ref.draggable({disabled: true});
			$("#tooltip" + _obj.primeKey + refId).css({visibility: "visible"});
		}
		else
		{
			if(ref.prop("id").indexOf("openEnd") != -1 && $("#openEnd" + _obj.primeKey + refId).prop("disabled") == false && ("ontouchstart" in document.documentElement || (window.navigator.msPointerEnabled && viewportSize.getWidth() < 1200)))
			{
				ref.parent().draggable({disabled: true});
				clearTimeout(_obj.timer);
				_obj.timer = setTimeout(function(){ref.parent().draggable({disabled: false});}, 3000);
			}
		}
	}

	function keysHandler(pEvent)
	{
		var ref = $(pEvent.currentTarget);
		var refId = ref.prop("id").substr(ref.prop("id").indexOf("_") + 1, 8);

		clearTimeout(_obj.timer);
		var str = "";
		var flag = true;
		
		if(pEvent.keyCode == 32)
		{
			if(ref.prop("value").charAt(0) == " ")
			{
				ref.prop({value: ""});
			}
			for(var i = 0; i < ref.prop("value").length; i++)
			{
				if(ref.prop("value").charAt(i) == " ")
				{
					if(flag)
					{
						str += ref.prop("value").charAt(i);
					}
					flag = false;
				}
				else
				{
					flag = true;
				}
				if(flag)
				{
					str += ref.prop("value").charAt(i);
				}
			}
			ref.prop({value: str});
		}
		if($.trim(ref.prop("value")) == "")
		{
			ref.parent().draggable({disabled: true});
			$("#tooltip" + _obj.primeKey + refId).css({visibility: "visible"});
		}
		else
		{
			ref.parent().draggable({disabled: false});
			$("#tooltip" + _obj.primeKey + refId).css({visibility: "hidden"});
		}
	}

	function showZoomHandler(pEvent)
	{
		if(_obj.dragFlag == false && !$("#zoomCard" + _obj.primeKey).length)
		{
			var ref = $(pEvent.currentTarget);
			var refId = ref.prop("id").substr(ref.prop("id").indexOf("_") + 1, 8);
			_obj.zoomRef = $("#zImage" + _obj.primeKey + refId);
			
			var zoomCard = $("<div>");
			zoomCard.prop({id: "zoomCard" + _obj.primeKey});
			zoomCard.css({width: $("#rootDiv" + _obj.primeKey).width(), height: $("#rootDiv" + _obj.primeKey).height(), background: "url(" + protocolRef + "//dcqhpema7gk9a.cloudfront.net/IND/HTML5/transparent.png)", position: "absolute", left: 0, top: 0, zIndex: _obj.dep++});
			$("#rootDiv" + _obj.primeKey).append(zoomCard);

			_obj.zoomRef.css({visibility: "visible", display: "block", zIndex: _obj.dep++, left: Math.round(($("#rootDiv" + _obj.primeKey).width() - _obj.zoomRef.width())/2), top: Math.round(($("#rootDiv" + _obj.primeKey).height() - _obj.zoomRef.height())/2)});

			var closeB = $("<img>");
			closeB.prop({id: "closeB" + _obj.primeKey, src: protocolRef + "//dcqhpema7gk9a.cloudfront.net/IND/HTML5/close.png"});
			closeB.css({cursor: "pointer", position: "absolute", left: _obj.zoomRef.position().left + _obj.zoomRef.width() - 20, top: _obj.zoomRef.position().top - 10, zIndex: _obj.dep++});
			$("#rootDiv" + _obj.primeKey).append(closeB);

			zoomCard.on("click", hideZoomHandler);
			closeB.on("click", hideZoomHandler);
		}
	}

	function hideZoomHandler(pEvent)
	{
		if($("#zoomCard" + _obj.primeKey).length)
		{
			$("#zoomCard" + _obj.primeKey).remove();
			$("#closeB" + _obj.primeKey).remove();
			_obj.zoomRef.css({display: "none"});
		}
	}

	function submitHandler()
	{
		for(var i = 0; i < _obj.dataArray.length; i++)
		{
			if(_obj.dataArray[i] == -999)
			{
				if($("#openEnd" + _obj.primeKey + _obj.cardArray[i]).length && _obj.otherSpecifyMandatory == false)
				{
					continue;
				}
				else
				{
					createDialog(_obj.errMsg1, _obj);
					$("#alertBoxContent" + _obj.primeKey).children().eq(5).prop("value", _obj.okLabel);
					return false;
				}
			}
		}
		
		if(_obj.finishFlag)
		{
			_obj.finishFlag = false;
			var finalStr = "";
			if(_obj.otherSpecify.length > 0)
			{
				for(var h = 0; h < _obj.otherSpecify.length; h++)
				{
					if(_obj.dataArray[$("#card" + _obj.primeKey + _obj.otherSpecify[h]).data("num")] != -999)
					{
						if($.trim($("#openEnd" + _obj.primeKey + _obj.otherSpecify[h]).prop("value")) == "")
						{
							createDialog(_obj.errMsg2, _obj);
							$("#alertBoxContent" + _obj.primeKey).children().eq(5).prop("value", _obj.okLabel);
							_obj.finishFlag = true;
							return false;
						}
						else
						{
							finalStr += (h == 0)? $("#openEnd" + _obj.primeKey + _obj.otherSpecify[h]).prop("value") : ",~," + $("#openEnd" + _obj.primeKey + _obj.otherSpecify[h]).prop("value");
						}
					}
					else
					{
						finalStr += (h == 0)? "" : ",~,";
					}
				}
				window["setValue" + _obj.primeKey.slice(0,-1)](_obj.dataArray, finalStr);
			}
			else
			{
				window["setValue" + _obj.primeKey.slice(0,-1)](_obj.dataArray);
			}
		}
	}
}