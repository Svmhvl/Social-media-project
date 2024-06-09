const baseUrl = "https://tarmeezacademy.com/api/v1"
let Postid = 1
const searchParams = new URLSearchParams(window.location.search);
const userId = searchParams.get('userid')
const token = localStorage.getItem("token")
showUserPosts()
showProfileDetails()


function showProfileDetails(){

    
    axios.get(`${baseUrl}/users/${userId}`)

    .then((response) => {

        let userData = response.data.data
        console.log(userData)

        let profileName = `<h4 class="card-text my-4" id="username" >@${userData.username} All Posts</h4> `

        let profileContent  = `<div class="col-sm-6 mb-3 mb-sm-0">
                        <div class="card">
                            <div class="card-body  d-flex align-items-center" style="height: 120px;">
                                <img src="${userData.profile_image}" alt="" width="80" height="80" class="rounded-circle" id="profileImage">
                            <div class="mx-5">
                                <h5 class="card-text" id="email">${userData.email}</h5> 
                                <h5 class="card-text" id="username">${userData.username}</h5> 
                                <h5 class="card-text" id="name">${userData.name}</h5> 
                            </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-6">
                        <div class="card">
                            <div class="card-body d-flex  align-items-center" style="height: 120px;">
                                <div>
                                    <div class="d-flex align-items-center">
                                        <h5 class="card-title mx-2 fs-2" id="post-count" >${userData.posts_count}</h5>
                                        <p class="card-text mx-1">Posts</p> 
                                    </div>  
                                    <div class="d-flex align-items-center">
                                        <h5 class="card-title mx-2 fs-2" id="comment-count">${userData.comments_count}</h5>
                                        <p class="card-text mx-1" >Comments</p> 
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`

            document.getElementById("profile").innerHTML = profileContent        
            document.getElementById("profile-name").innerHTML = profileName
    })

    .catch((error) => {

    })
}

function showUserPosts(){

    let user = getCurrentUser()
    let idOfUser = user.id
    

    axios.get(`${baseUrl}/users/${userId}/posts`)

    .then((response) => {

        let postData = response.data.data

        console.log(postData)
        

        for(let post of postData){
   
            let editBtn = ""
            let deleteBtn = ""

            

            if(post.author.id == idOfUser){
                editBtn = `<button class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#editPost" onclick="getIdOfClickedPost2(${post.id})"><i class="fa-solid fa-pen-to-square"></i> Edit</button>`
                deleteBtn = `<button class="btn btn-danger mx-2" data-bs-toggle="modal" data-bs-target="#deletePost" onclick="getIdOfClickedPost2(${post.id})"><i class="fa-solid fa-trash-can"></i> Delete</button>`
            }


           
            let postContent = `<div class="card shadow-sm bg-body-tertiary rounded" id="card" >
            <div class="card-header d-flex align-items-center">
                <img src="${post.author.profile_image}" alt="" width="35" height="35" class="rounded-circle" id="post-user-img">
                <b id="post-username" style="font-size: 18px;margin-left : 10px;">@${post.author.username}</b>
                <div class="w-100 d-flex justify-content-end" >
                    ${editBtn}
                    ${deleteBtn}
                </div>
            </div>

            <div class="card-body" style="cursor: pointer;">
                <img src="${post.image}" class="card-img-top rounded img-fluid" alt="" id="post-img">
                <h6 style="color: gray;" id="time-of-post">${post.created_at}</h6>
                <h5 class="card-title my-3" id="title">${post.title}</h5>
                <p class="card-text" id="body">${post.body}</p>
                <hr>
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                        <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                    </svg>
                    <span id="number-of-comments">
                        (${post.comments_count}) Comments
                    </span>
                </div>
            </div>
        </div>`
            
            
             document.getElementById("profile-posts").innerHTML += postContent
            
      
        }

    })

    .catch((error) => {
       console.log(error)
        
    })

}

function editPost(){

    const title = document.getElementById("edited-post-title").value
    const body = document.getElementById("edited-post-body").value
    const picture = document.getElementById("edited-post-picture").files[0]
    const token = localStorage.getItem("token")
    console.log(Postid)

    let formData = new FormData()
    formData.append("title", title)
    formData.append("body", body)
    formData.append("image", picture)
    formData.append("_method", "put")

    const headers = {
        "authorization" : `Bearer ${token}`,
        "Content-Type" : "Multipart/form-data"
    }

    axios.post(`${baseUrl}/posts/${Postid}`, formData, {
        headers : headers
    })

    .then ((response) => {
        
        const modal = document.getElementById("editPost")
        const modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()   
        showUserPosts()
        showLiveAlert("post has been updated successfuly", "success")
       

    })

    .catch((error) => {
        let message = error.response.data.message
        showLiveAlert(message, "danger")
    })

}

function deletePost(){

    const token = localStorage.getItem("token")

    const headers = {
        "authorization" : `Bearer ${token}`
    }
    
    axios.delete(`${baseUrl}/posts/${Postid}`, {
        headers : headers
    })

    .then ((response) => {
        
        const modal = document.getElementById("deletePost")
        const modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide() 
        showUserPosts()  
        showLiveAlert("post has been deleted successfuly", "success")
 
    })

    .catch((error) => {
        let message = error.response.data.message
        showLiveAlert(message, "danger")
    })
}

function getIdOfClickedPost2(id){
    Postid = id 
    return Postid         
}


function profileClicked(){

    if(token != null){
        let user = getCurrentUser()
        window.location = `profile.html?userid=${user.id}`
        
    }else{
        showLiveAlert("please login first", "danger")
    }
    
}

function getCurrentUser(){
    let user = null
    storageUser = localStorage.getItem("user")

    if(storageUser != null) {
        
        user = JSON.parse(storageUser)
    }
    
    return user

}