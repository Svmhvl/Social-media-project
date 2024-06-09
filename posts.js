
const baseUrl = "https://tarmeezacademy.com/api/v1"
const token = localStorage.getItem("token")
let currentPage = 1
let lastPage = 1
let postId = 0
showPostsInHome()


window.addEventListener("scroll", function(){
    const endOfPage = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight;   
    
    if(endOfPage && currentPage < lastPage){
        showPostsInHome(false, currentPage + 1)  
        currentPage++ 
    }
})



function showPostsInHome(reload = true, page = 1){
    const token = localStorage.getItem("token")
    const user = localStorage.getItem("user")
    const userData = JSON.parse(user)
    toggleLoader(true)
    axios.get(`${baseUrl}/posts?limit=10&page=${page}`)

    .then(function (response){
        toggleLoader(false)
        let data = response.data.data
        
        lastPage = response.data.meta.last_page

        if(reload){
            document.getElementById("posts").innerHTML = ""
        }

        

            for(let post of data){ 

                let editBtn = ""
                let deleteBtn = ""

                if(token != null && post.author.id == userData.id){
                    editBtn = `<button class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#editPost" onclick="getIdOfClickedPost2(${post.id})"><i class="fa-solid fa-pen-to-square"></i> Edit</button>`
                    deleteBtn = `<button class="btn btn-danger mx-2" data-bs-toggle="modal" data-bs-target="#deletePost" onclick="getIdOfClickedPost2(${post.id})"><i class="fa-solid fa-trash-can"></i> Delete</button>`
                }
                
                let postTitle = ""
                if(post.title != null){
                    postTitle = post.title
             }

            let content = ` <div class="card shadow-sm bg-body-tertiary rounded" id="card" >
            <div class="card-header  d-flex justify-content-center align-items-center">
                <div class="d-flex align-items-center" onclick="getIdOfClickedUser(${post.author.id})" style="cursor : pointer">
                    <img src="${post.author.profile_image}" alt="" width="35" height="35" class="rounded-circle" id="post-user-img">
                    <b id="post-username" style="font-size: 18px;margin-left : 10px;">@${post.author.username}</b>
                </div>
                <div class=" w-100 d-flex justify-content-end">
                    ${editBtn}
                    ${deleteBtn}
                </div>
            </div>
            
            <div class="card-body" onclick="getIdOfClickedPost(${post.id})" style="cursor: pointer;">
                <img src="${post.image}" class="card-img-top rounded img-fluid" alt="" id="post-img">
                <h6 style="color: gray;" id="time-of-post">${post.created_at}</h6>
                <h5 class="card-title my-3" id="title">${postTitle}</h5>
                <p class="card-text" id="body">${post.body}</p>
                <hr>
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                        <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                    </svg>
                    <span id="number-of-comments">
                        (${post.comments_count}) Comments
                    </span>
                    <span id="post-tag-${post.id}">
                    <span/>
                </div>
            </div>
        </div>  
        `
           
            
            
            document.getElementById("posts").innerHTML += content 

            const currentPost = `post-tag-${post.id}`
            document.getElementById(currentPost).innerHTML = ""
            
            for(tags of post.tags){
                let tagsContent =  `<button class="rounded-pill btn btn-secondary mx-1" disabled>${tags.name}</button>`
                document.getElementById(currentPost).innerHTML += tagsContent
            }

            
             
        }

        

    })

    .catch(function (error){
        const message = error.response.data.message
        console.log(message)
    })
}

function createNewPost(){
    const title = document.getElementById("post-title").value
    const body = document.getElementById("post-body").value
    const picture = document.getElementById("post-picture").files[0]
    const token = localStorage.getItem("token")

    // parameters
        let formData = new FormData()
        formData.append("title", title)
        formData.append("body", body)
        formData.append("image", picture)

    // headers
        const headers = {
            "Content-Type": "multipart/form-data",
            "Authorization" : `Bearer ${token}`
        }
    // post request to upload a new post
    axios.post(`${baseUrl}/posts`, formData ,{
        headers : {
            "Content-Type": "multipart/form-data",
            "Authorization" : `Bearer ${token}`
        }
    })

    .then(function(response){
        
            const modal = document.getElementById("createPost")
            const modalInstance = bootstrap.Modal.getInstance(modal)
            modalInstance.hide()
            showPostsInHome()
            showLiveAlert("upload successful" , "success")
            
    })

    .catch(function(error){
            const message = error.response.data.message
            showLiveAlert(message , "danger")
    })
}

function getIdOfClickedPost(id){
    console.log(id)
    window.location.href = `post-details.html?postId=${id}`
           
}

function getIdOfClickedUser(id){

    if(token != null){
        window.location.href = `profile.html?userid=${id}`
        
    }else{
        showLiveAlert("please login first", "danger")
    }

    
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

function toggleLoader(show = true){
    if(show){
        document.getElementById("loader").style.visibility = "visible"
    }else{
        document.getElementById("loader").style.visibility = "hidden"
    }
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
        showPostsInHome()
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
        showPostsInHome()  
        showLiveAlert("post has been deleted successfuly", "success")
 
    })

    .catch((error) => {
        let message = error.response.data.message
        showLiveAlert(message, "danger")
    })
}


