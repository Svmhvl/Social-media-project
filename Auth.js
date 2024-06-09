    
    setupUI()
    showUserProfile()
    addPostBtn()
     //if the token is valid then the ui will change even after a refresh
    function login(){
        let username = document.getElementById("username").value
        let password = document.getElementById("password").value

        const baseUrl = "https://tarmeezacademy.com/api/v1"
        let params = {
            username : username,
            password : password
        }

        axios.post(`${baseUrl}/login`, params)

        .then(function(response){
            
                // token
                let token = response.data.token
                localStorage.setItem("token", token)
                // user
                let user = response.data.user
                localStorage.setItem("user", JSON.stringify(user))

                const modal = document.getElementById("loginModal")
                const modalInstance = bootstrap.Modal.getInstance(modal)
                modalInstance.hide()

                showLiveAlert("logged in successfuly successfuly" , "success")
                showUserProfile()
                addPostBtn()
                setupUI()
                location.reload()
        })

        .catch(function(error){
            if(error.response.data.message != ""){
                const modal = document.getElementById("registerModal")
                const modalInstance = bootstrap.Modal.getInstance(modal)
                modalInstance.hide()
                showLiveAlert(error.response.data.message, "danger")
            }
        })


    }

    function logout(){
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        showLiveAlert("logged out successufuly" , "success")
        addPostBtn()
        setupUI()
        window.location = "home.html"
    }

    function register(){
        // r meanes register
        const rName = document.getElementById("register-name").value
        const rUsername = document.getElementById("register-username").value
        const rEmail = document.getElementById("register-email").value 
        const rPassword = document.getElementById("register-password").value
        const rPicture = document.getElementById("profile-picture").files[0]

        const baseUrl = "https://tarmeezacademy.com/api/v1"

        let formData = new FormData()
        formData.append("name", rName)
        formData.append("username", rUsername)
        formData.append("email", rEmail)
        formData.append("password", rPassword)
        formData.append("image", rPicture)

        const headers = {
            "Content-Type" : "Multipart/form-data"
        }
        

        axios.post(`${baseUrl}/register`, formData, {
            headers : headers
        })

        .then(function(response){
            
                // token
                let token = response.data.token
                localStorage.setItem("token", token)
                // user
                let user = response.data.user
                localStorage.setItem("user", JSON.stringify(user))

                const modal = document.getElementById("registerModal")
                const modalInstance = bootstrap.Modal.getInstance(modal)
                modalInstance.hide()

                showLiveAlert("You have been registered successfuly", "success")
                showUserProfile()
                addPostBtn()
                setupUI()
                location.reload()
           
        })

        .catch(function(error){
            
            if(error.response.data.message != ""){
                const modal = document.getElementById("registerModal")
                const modalInstance = bootstrap.Modal.getInstance(modal)
                modalInstance.hide()
                showLiveAlert(error.response.data.message, "danger")
            }
            
        })


    }
 
    
    function showUserProfile(){
        
        let user = localStorage.getItem("user")
        let userJson = JSON.parse(user)
        if(userJson != null){
            const userNameProfile = document.getElementById("username-profile")
            userNameProfile.innerHTML = `<div class="card-header d-flex justify-content-center align-items-center">
                <img src="${userJson.profile_image}" alt="" width="35" height="35" class="rounded-circle border border-1" id="post-user-img">
                <b id="post-username" style="font-size: 18px;margin-left : 10px;">${userJson.username}</b>
            </div>`
        }
        

    }
               
    function showLiveAlert(customMessage, messageType) {
        
        const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
        const alert = (message, type) => {
            const wrapper = document.createElement('div')
                wrapper.innerHTML = [
                    `<div class="alert alert-${type} alert-dismissible fade show" role="alert" id="alert">`,
                    `   <div>${message}</div>`,
                    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
                    '</div>'
                ].join('')

            alertPlaceholder.append(wrapper)
        }

       
            alert(customMessage, messageType)

            todo:
            setTimeout(function(){
                const hideAlert = bootstrap.Alert.getOrCreateInstance('#alert')
                hideAlert.close()
            }, 3000)
        
            
                
            
            
   
    }

    function setupUI(){
        const token = localStorage.getItem("token")
        const loggedIn = document.getElementById("logged-in-div")
        const loggedOut = document.getElementById("logged-out-div")

        if (token == null){
            loggedOut.style.setProperty('display', 'flex', 'important')
            loggedIn.style.setProperty('display', 'none', 'important')
            
        }else{
            loggedIn.style.setProperty('display', 'flex', 'important')
            loggedOut.style.setProperty('display', 'none', 'important')
            
        }

    }

    function addPostBtn(){
        const token = localStorage.getItem("token")
        const addPost = document.getElementById("add-post")
        const addBtn = document.createElement("button")

        if(token != null) {    
            addBtn.className = "btn btn-primary rounded-circle btn-lg"
            addBtn.setAttribute("data-bs-toggle", "modal")
            addBtn.setAttribute("data-bs-target", "#createPost")
            addBtn.innerHTML = `<i class="fa-solid fa-plus"></i>`
            addPost.appendChild(addBtn)
        }else{
            addPost.innerHTML = ""
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