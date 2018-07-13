$("#registerForm").submit(function(e) {
             
            e.preventDefault();
            var username = $(this).find('input[name="username"]').val();
            var password = $(this).find('input[name="password"]').val();
             
            $.ajax({
                type: "POST",
                url: "/users/register",
                data: JSON.stringify({username: username, password: password}),
                dataType: "json",
                contentType: "application/json",
                success: function(data){ 
                    if (data.error !== undefined){
						alert("Error: "+data.error);
					}else{
						window.location = "/tasks";
					}
                    },
                });
        });

$("#loginForm").submit(function(e) {
             
            e.preventDefault();
            var username = $(this).find('input[name="username"]').val();
            var password = $(this).find('input[name="password"]').val();
             
            $.ajax({
                type: "POST",
                url: "/users/login",
                data: JSON.stringify({username: username, password: password}),
                dataType: "json",
                contentType: "application/json",
                success: function(data){ 
						if (data.error){
							alert("Error: "+data.error);
						}else{
							window.location = "/tasks";
						}
                    }
                });
        });