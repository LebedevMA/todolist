$("#taskCreateForm").submit(function(e) {
             
            e.preventDefault();
            var text = $(this).find('input[name="text"]').val();
            var priority = $(this).find('select[name="priority"]').val();
            var completed = $(this).find('select[name="completed"]').val();
             
            $.ajax({
                type: "POST",
                url: "/tasks",
                data: JSON.stringify({text: text, priority: priority}),
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

$(".taskUpdateForm").submit(function(e) {
             
            e.preventDefault();
            var formAction = $(this).attr('action');
            var text = $(this).find('input[name="text"]').val();
            var priority = $(this).find('select[name="priority"]').val();
            var completed = $(this).find('select[name="completed"]').val();
            
            $.ajax({
                type: "PUT",
                url: formAction,
                data: JSON.stringify({text: text, priority: priority, completed: completed}),
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

$(".taskDeleteForm").submit(function(e) {
             
            e.preventDefault();
            var theForm = $(this);
            var formAction = $(this).attr('action');
             
            $.ajax({
                type: "DELETE",
                url: formAction,
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