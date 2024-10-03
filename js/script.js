function timeZone(time){
    const hour = parseInt(time/3600);
    let remainingSec = time % 3600;
    const min = parseInt(remainingSec / 60);
    remainingSec = remainingSec % 60;
    return `${hour} hour ${min} minutes ${remainingSec} second ago`
}

// Load all the Category Button From API and Show them in a centered position
const loadCategoryButtons = () => {
    fetch('https://openapi.programming-hero.com/api/phero-tube/categories')
    .then(response => response.json())
    .then(data => displayButtons(data.categories))
    .catch(err => console.log(err));
}

// Load all the videos from API
const loadAllVideos = (searchText = "") => {
    fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`)
    .then(res => res.json())
    .then(data => showVideosOnDisplay(data.videos))
    .catch(err => console.log(err))
}

//
document.getElementById('search-input').addEventListener('keyup', (e)=>{
    loadAllVideos(e.target.value);
})


const loadDetails = async(id) => {
    const url = `https://openapi.programming-hero.com/api/phero-tube/video/${id}`;
    const res = await fetch(url);
    const data = await res.json();
    displayDetails(data.video);
}

const sortTriggered = () => {
    fetch('https://openapi.programming-hero.com/api/phero-tube/videos')
    .then(res => res.json())
    .then(data => viewsAscending(data.videos))
    .catch(err => console.log(err))
}
const extractNumbs = (totalViews) => {
    const digits = totalViews.match(/\d+/)[0];
    const number = Number(digits);
    return(number);
}

const viewsAscending = (data) =>{
    console.log(data)
    data.sort((a, b) =>  extractNumbs(a.others.views) - extractNumbs(b.others.views));
    showVideosOnDisplay(data);
}
document.getElementById('sort-btn').addEventListener('click', sortTriggered);


const displayDetails = (vid) => {
    const modalContainer = document.getElementById('modal-container');
    modalContainer.innerHTML = 
    `
    <img class="w-full" src=${vid.thumbnail} alt="thumbnail"/>
    <p class="py-4">${vid.description}</p>
    `
    showModalData.showModal()
}

const showVideosOnDisplay = (videos) => {
    const cardsContainer = document.querySelector('#cards-container');
    cardsContainer.innerHTML = '';
    if(videos.length === 0){
        cardsContainer.classList.remove('grid');
        cardsContainer.innerHTML = 
        `
        <div class="flex flex-col justify-center gap-4 min-h-[60vh] items-center">
        <img class="w-28" src="../assets/Icon.png" />
        <p class="text-2xl font-bold">Oops Sorry..! There is no Content Here</p>
        </div>
        `;
        return; 
    }
    else{
        cardsContainer.classList.add('grid');
    }
    videos.forEach(vid => {
        const div = document.createElement('div');
    // console.log(vid)
    div.classList = 'card, border-2 p-3 rounded-lg';
    div.innerHTML =
    `
     <figure class="relative">
    <img class="h-48 w-full object-cover rounded-lg"
      src=${vid.thumbnail}
      alt="thumbnail" />
      ${
        vid.others. posted_date?.length === 0 ?
        '' :
       `<p class="absolute bottom-4 right-4 text-white text-xs bg-black p-2">
       ${timeZone(vid.others. posted_date)} </p>`
      }
  </figure>
  <div class="py-4 flex gap-4">
        <img class="h-10 w-10 rounded-full object-cover" 
        src=${vid.authors[0]?.profile_picture} alt="author-pic"/>
         <div class="">
            <h3 class="font-bold text-lg">${vid.title}</h3>
            <div  class="flex gap-2 items-center">
               <p class="font-medium">${vid.authors[0]?.profile_name}</p>
               ${vid.authors[0]?.verified === true
                ? `<img class="w-5" src="https://img.icons8.com/?size=96&id=D9RtvkuOe31p&format=png" alt="">` : ""}
               
            </div>
            <p>${vid.others.views}</p>
            </div>
            
    </div>
    <button onclick="loadDetails('${vid.video_id}')" class="btn btn-sm btn-neutral w-1/3">Details</button>
    `
    cardsContainer.appendChild(div);
})
}

// {category_id: '1001', category: 'Music'}

// Show All Display Buttons
const buttons = document.querySelector('#buttons');
const displayButtons = (categoryBtn) => {
    categoryBtn.forEach(item => {
        const div = document.createElement('div');
        div.innerHTML =
        `
        <button id="btn-${item.category_id}"
        onclick="loadCategoryVideos(${item.category_id})" 
        class="btn">${item.category}</button>
        `
        buttons.append(div);
    });
} 

let activeBtn = null;
    
const loadCategoryVideos = id => {
    fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${id}`)
    .then(response => response.json())
    .then(data => {
        if(activeBtn){
            activeBtn.classList.remove('active');
        }
        activeBtn = document.getElementById(`btn-${id}`);
        activeBtn.classList.add("active");
        showVideosOnDisplay(data.category)
    })
    .catch(err => console.log(err));
}


loadCategoryButtons();
loadAllVideos();