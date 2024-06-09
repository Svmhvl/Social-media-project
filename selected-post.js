
document.getElementById("selected-posts").innerHTML = ""

const baseUrl = "https://tarmeezacademy.com/api/v1"
const searchParams = new URLSearchParams(window.location.search);
const postId = searchParams.get('postId')
const token = localStorage.getItem("token")
selectedPost(postId)

function selectedPost(id){
    axios.get(`${baseUrl}/posts/${id}`)

.then((response) => {
    //  console.log(response.data.data)
     let data = response.data.data

     document.getElementById("author-name").innerHTML = `@${data.author.username}`
     
     let  style = ""
        
        if(token == null){
            style = 'style =" display : none;"'
        }             

     let postContent = `<div class="card shadow-sm bg-body-tertiary rounded" id="card">
                        <div class="card-header">
                            <img src="${data.author.profile_image}" alt="" width="35" height="35" class="rounded-circle border border-2" id="post-user-img">
                            <b id="post-username">@${data.author.username}</b>
                        </div>
                        <div class="card-body">
                            <img src="${data.image}" class="card-img-top rounded img-fluid" alt="" id="post-img">
                            <h6 style="color: gray;" id="time-of-post">${data.created_at}</h6>
                            <h5 class="card-title my-3" id="title">${data.title}</h5>
                            <p class="card-text" id="body">${data.body}</p>
                            <hr>
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                                    <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                                </svg>
                                <span id="number-of-comments">
                                    (${data.comments_count}) Comments
                                </span>
                            </div>
                            <hr>
                            <div class="border border-1 bg-body-secondary rounded p-3" id="all-comments">
                         
                            </div>
                            <div class="input-group mb-3  my-3" ${style}>
                            <input type="text" class="form-control" placeholder="Add your comment.." aria-describedby="button-addon2" id="add-comment">
                            <button class="btn btn-outline-primary" type="button" id="button-addon2" onclick="addCommentToSelectedPost(${postId})"><i class="fa-regular fa-paper-plane"></i> send</button>
                        </div>
                        </div>
                    </div>
     `

        document.getElementById("selected-posts").innerHTML = postContent
        
        for(comment of data.comments){
            let comms = `       <div class="d-flex align-middle my-3">
                                    <img src="${comment.author.profile_image}" alt="" width="35" height="35" class="rounded-circle border border-2" id="post-user-img">
                                    <span id="post-username" style="font-size: 20px; text-decoration: underline;">@${comment.author.username}</span>
                                </div>
                                <p class="mx-2">${comment.body}</p>
                                <hr>
                                `

             document.getElementById("all-comments").innerHTML += comms
        }
})

.catch((err) => {
    
});
}


function addCommentToSelectedPost(id){

    const comment = document.getElementById("add-comment").value
    const token = localStorage.getItem("token")

    let params = {
        body : comment
    }

    const headers = {
        "authorization" : `Bearer ${token}`
    }

    axios.post(`${baseUrl}/posts/${id}/comments`, params , {
        headers : headers
    })

    .then((response) => {
        showLiveAlert("comment has been added successfuly", "success")
        setInterval(() => {
            location.reload(); 
        }, 1500)

    })

    .catch((error) => {
        let message = error.response.data.message
        showLiveAlert(message, "danger")
    })

}