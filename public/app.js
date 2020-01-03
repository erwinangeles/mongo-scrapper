$('.modal').modal();

// Grab the articles as a json
$.getJSON("/articles", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#articles").append(`
      <div class="col s12"><div class="card">
      <div class="card-content">
    <h5 data-id="${data[i]._id}">${data[i].title}</h3></div> 
  <div class="card-action">
  <a class="waves-effect waves-light btn" href="${data[i].link}" target="_blank">View Article</a><a class="comment waves-effect waves-light btn modal-trigger" data-id="${data[i]._id}" href="#comment-modal">Comment</a>
  </div>
  </div>
  </div>
      `);
  
    }
  });
  
  $("#scrape").on("click", function() {
    $.ajax({
        method: "GET",
        url: "/scrape",
    }).done(function(data) {
        console.log(data)
        window.location = "/"
    })
  });
  
  
  // Whenever someone clicks a comment
  $(document).on("click", ".comment", function() {
    // Empty the comment from the note section
    $("#comment").empty();
    // Save the id from the comment
    var articleId = $(this).attr("data-id");
  
    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + articleId
    })
      // With that done, add the note information to the page
      .then(function(data) {
        console.log(data);
        // The title of the article
        $("#comment").append(`<h5 class="blue-text">${data.title}</h5>`);
        // An input to enter a new title
        $("#comment").append("<input id='titleinput' placeholder='Mindblowing!' name='title' >");
        // A textarea to add a new comment body
        $("#comment").append("<textarea id='bodyinput' placeholder='This article is the best ever.' name='body'></textarea>");
        // A button to submit a new comment, with the id of the article saved to it
        $("#comment").append("<button class='waves-effect waves-light btn blue lighten-1' data-id='" + data._id + "' id='savecomment'>Save comment</button>");
        $("#comment").append($("<div id='commentSection'>"))
        // If there's a comment in the article
        if (data.comment) {
          for (let item of data.comment) {
            console.log(item);
            console.log(item.body)
            let commentAll = $("<div class='card blue darken-3'>");
            let commentCard = $("<div class='card-content white-text'>")
            commentCard.html(`<a data-article-id='${articleId}' data-comment-id='${item._id}' class='right btn-floating btn-large waves-effect waves-light red deleteComment'><i class='material-icons'>clear</i></a><span class='card-title'>Title: ${item.title}</span><p>Comment: ${item.body}<p>`);
            commentAll.append(commentCard);
            $("#commentSection").append(commentAll);
          }
        }
      });
  });
  
  // When you click the savecomment button
  $(document).on("click", "#savecomment", function() {
    // Grab the id associated with the article from the submit button
    var articleId = $(this).attr("data-id");
  
    // Run a POST request to change the comment, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + articleId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from comment textarea
        body: $("#bodyinput").val() 
      }
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);
        $("#commentSection").empty();
  
        $.ajax({
          method: "GET",
          url: "/articles/" + thisId
        }).then(function(commentData) {
          if (commentData.comment) {
            for (let item of commentData.comment) {
              console.log(item.title);
              console.log(item.body)
              let commentAll = $("<div class='card blue darken-3'>");
              let commentCard = $("<div class='card-content white-text'>")
              commentCard.html(`<a data-article-id='${articleId}' data-comment-id='${item._id}' class='right btn-floating btn-large waves-effect waves-light red deleteComment'><i class='material-icons'>clear</i></a><span class='card-title'>Title: ${item.title}</span><p>Comment: ${item.body}<p>`);
              commentAll.append(commentCard);
              $("#commentSection").append(commentAll);
            }
          }
        })
      });
  
    // Also, remove the values entered in the input and textarea for comment entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });
  
  $(document).on("click", ".deleteComment", function() {
    console.log("made it!")
      var commentId = $(this).attr("data-comment-id");
      var articleId = $(this).attr("data-article-id");
      $.ajax({
          method: "DELETE",
          url: "/comment/delete/" + commentId + "/" + articleId
      }).done(function(data) {
          console.log(data)
          $("#commentSection").empty();
  
          $.ajax({
            method: "GET",
            url: "/articles/" + articleId
          }).then(function(commentData) {
            if (commentData.comment) {
              for (let item of commentData.comment) {
                console.log(item.title);
                console.log(item.body)
                let commentAll = $("<div class='card blue darken-3'>");
                let commentCard = $("<div class='card-content white-text'>")
                commentCard.html(`<a data-article-id='${articleId}' data-comment-id='${item._id}' class='right btn-floating btn-large waves-effect waves-light red deleteComment'><i class='material-icons'>clear</i></a><span class='card-title'>Title: ${item.title}</span><p>Comment: ${item.body}<p>`);
                commentAll.append(commentCard);
                $("#commentSection").append(commentAll);
              }
            }
          })
      })
  });