window.onload = function(){
	var snakeBodyArray = [],// 蛇的肢体列表
	parts = [],// 蛇分成的几段
	body = document.body;
	
	/**
	 * 操作食物模块
	 */
	var foodModule = (function(){
		var food = document.createElement("div");
		food.className = "food";
		
		// 添加到 body
		body.appendChild(food);
		
		var foodStyle = food.style;
		
		return {
			setFoodPosition: function(x, y){
				foodStyle.left = x;
				foodStyle.top = y;
			},
			showFood: function(show){
				if(show){
					foodStyle.display = "block";
				}else{
					foodStyle.display = "none";
				}
			},
			isShow: function(){
				return foodStyle.display === "block" ? true : false;
			}
		};
	})(document, body);
	
	// 初始化蛇身体
	for(var i=0;i<4;i++){
		// 默认 4 节
		var snakeBody = document.createElement("div");
		snakeBody.className = "snake";
		body.appendChild(snakeBody);
		snakeBodyArray.push(snakeBody);
		
		// 默认一段，往左走
		parts.push({
			direction: -1,
			length: 4
		});
	}

	snakeBodyArray.reduce(function(previous, current){
		if(current != snakeBodyArray[0]){
			current.style.left = (previous.offsetLeft + previous.offsetWidth) + "px";
		}else{
			current.style.left = current.offsetLeft + "px";
		}
		return current;
	}, snakeBodyArray[0]);
	
	// 走起
	setTimeout(function(){
		
		/**
		 * 把最后一段中的一节挪到第一段最前面
		 */
		var lastBody = snakeBodyArray.pop(),
			lastBodyStl = lastBody.style,
			direction = parts[0].direction,
			firstBody = snakeBodyArray[0];
			
		// 根据蛇前进方向设置肢体位置
		if(direction == -1){
			lastBodyStl.left = firstBody.offsetLeft - firstBody.offsetWidth + "px";
			lastBodyStl.top = firstBody.offsetTop + "px";
		}else if(direction == 1){
			lastBodyStl.left = firstBody.offsetLeft + firstBody.offsetWidth + "px";
			lastBodyStl.top = firstBody.offsetTop + "px";
		}else if(direction == -2){
			lastBodyStl.top = firstBody.offsetTop - firstBody.offsetHeight + "px";
			lastBodyStl.left = firstBody.offsetLeft + "px";
		}else if(direction == 2){
			lastBodyStl.top = firstBody.offsetTop + firstBody.offsetHeight + "px";
			lastBodyStl.left = firstBody.offsetLeft + "px";
		}
		
		// 把最后一段中的一节设置为蛇头
		snakeBodyArray.unshift(lastBody);
		
		parts[0].length = parts[0].length + 1;
		
		// 判断最后一段长度，若为 0，删除之
		if(parts[parts.length - 1].length == 0){
			parts.pop();
		}
		
		// 是否吃到食物
		if(foodModule.isShow()){			
			// todo
		}
		
		setTimeout(arguments.callee, 1000);
	}, 1000);
	
	/**
	 * 蛇拐弯，添加一段
	 * parts 蛇分成的几段
	 * direction 即将拐弯的方向 -1：左 1：右 -2：上 2：下
	 */
	function addPart(parts, direction){
		var dir = parts[0].direction;
		if(dir != direction && dir != -direction){
			parts.unshift({
				direction: direction,
				length: 0
			});
		}
	}
	
	// 控制方向变化
	document.onkeydown = function(event){
		var e = event || window.event || arguments.callee.caller.arguments[0];
		if(e && e.keyCode == 37){ 
			// 向左 
			addPart(parts, -1);
		}else if(e && e.keyCode == 38){ 
			// 向上
			addPart(parts, -2);
		}else if(e && e.keyCode == 39){ 
			// 向右
			addPart(parts, 1);
		}else if(e && e.keyCode == 40){ 
			// 向下 
			addPart(parts, 2);
		}
	}
	
	/**
	 * 获取蛇的肢体中 minLeft maxLeft minTop maxTop
	 */
	function getSnakeMinAndMaxLeftAndTop(snakeBodyArray){
		var minAndMaxLeftAndTop = {
			minLeft: "",
			maxLeft: "",
			minTop: "",
			maxTop: ""
		};
		snakeBodyArray.reduce(function(pre, cur){
			var offsetLeft = cur.offsetLeft,
				offsetTop = cur.offsetTop,
				minLeft = pre.minLeft || pre.offsetLeft,
				maxLeft = pre.maxLeft || pre.offsetLeft,
				minTop = pre.minTop || pre.offsetTop,
				maxTop = pre.maxTop || pre.offsetTop;
			if(minLeft >= offsetLeft){
				minAndMaxLeftAndTop.minLeft = offsetLeft;
			}
			if(maxLeft <= offsetLeft){
				minAndMaxLeftAndTop.maxLeft = offsetLeft;
			}
			if(minTop >= offsetTop){
				minAndMaxLeftAndTop.minTop = offsetTop;
			}
			if(maxTop <= offsetTop){
				minAndMaxLeftAndTop.maxTop = offsetTop;
			}
			return minAndMaxLeftAndTop;
		}, snakeBodyArray[0]);
		return minAndMaxLeftAndTop;
	}
	
	/**
	 * 生成食物的投放位置
	 * snakeBodyArray 蛇肢体列表
	 */
	function generateFoodPoint(snakeBodyArray){
		// 食物的横坐标
		var x = parseInt((Math.random() + "").substring(2, 5));
		// 食物的纵坐标
		var y = parseInt((Math.random() + "").substring(2, 5));
		var minAndMaxLeftAndTop = getSnakeMinAndMaxLeftAndTop(snakeBodyArray);
		if(x >= minAndMaxLeftAndTop.minLeft && x <= minAndMaxLeftAndTop.maxLeft + snakeBodyArray[0].offsetWidth &&
		   y >= minAndMaxLeftAndTop.minTop && y <= minAndMaxLeftAndTop.maxTop + snakeBodyArray[0].offsetHeight){
			arguments.callee.call(null, arguments);
		}
		return {
			x: x,
			y: y
		};
	}
	
	// 定时投放食物
	setTimeout(function(){
		var foodPoint = generateFoodPoint(snakeBodyArray);
		foodModule.setFoodPosition(foodPoint.x + "px", foodPoint.y + "px");
		foodModule.showFood(true);
	}, 2000);
};
