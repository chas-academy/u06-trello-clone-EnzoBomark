//variables
let dropzones = document.querySelectorAll('.dropzone');
let dataColors = [
    {color:"red", title:"to do"},
    {color:"yellow", title:"in progress"},
    {color:"green", title:"testing"},
    {color:"blue", title:"done"},
];
let dataCards = {
    config:{
        maxid:0
    },
    cards:[]
};

//initialize
$(document).ready(()=>{
    // Create Kanban Board
    initializeKanbanBoards();
    // Display cards inside localStorage
    if(JSON.parse(localStorage.getItem('@data'))){
        dataCards = JSON.parse(localStorage.getItem('@data'));
        initializeComponents(dataCards);
    }
    
    initializeCards();
    $('#add').click(()=>{
        // Create Title if it isn't empty
        const title = $('#titleInput').val()!==''?$('#titleInput').val():null;
        // Create Description if it isn't empty
        const description = $('#descriptionInput').val()!==''?$('#descriptionInput').val():null;
        // Create Card if Title and Description isn't null
        if(title && description){
            let id = dataCards.config.maxid+1;
            const newCard = {
                id,
                title,
                description,
                position:"red",
                priority: false
            };
            dataCards.cards.push(newCard);
            dataCards.config.maxid = id;
            save();
            appendComponents(newCard);
            initializeCards();
        }
    });
    $("#deleteAll").click(()=>{
        dataCards.cards = [];
        save();
    });
});

//functions
const initializeKanbanBoards = () => {
    dataColors.forEach(item=>{
        const htmlElements = 
        `<div class="board">
            <h3>${item.title.toUpperCase()}</h3>
            <div class="kanbanZone" id="${item.color}"></div>
        </div>`
        $("#boardsContainer").append(htmlElements)
    });
    
    const dropzones = document.querySelectorAll('.kanbanZone');
    dropzones.forEach(zone=>{
        zone.addEventListener('dragenter', dragenter);
        zone.addEventListener('dragover', dragover);
        zone.addEventListener('dragleave', dragleave);
        zone.addEventListener('drop', drop);
    });
};

const initializeCards = () =>{
    cards = document.querySelectorAll('.kanbanCard');
    
    cards.forEach(card=>{
        card.addEventListener('dragstart', dragstart);
        card.addEventListener('drag', drag);
        card.addEventListener('dragend', dragend);
    });
};

const initializeComponents = (dataArray) =>{
    dataArray.cards.forEach(card=>{
        appendComponents(card); 
    });
};

const appendComponents = (card) =>{
    //creates new card inside of the todo area
    const htmlElements = `
        <div id=${card.id.toString()} class="kanbanCard ${card.position}" draggable="true">

            <span id="span-${card.id.toString()}" onclick="togglePriority(event)" class="material-icons priority ${card.priority? "is-priority": ""}">
            star
            </span>

            <h4 class="title">${card.title}</h4>
            <p class="description">${card.description}</p>

            <form>
                <button class="invisibleBtn">
                    <span onclick="deleteCard(${card.id.toString()})">
                        DELETE
                    </span>
                </button>
            </from>
        </div>
    `
    $(`#${card.position}`).append(htmlElements);
    priorities = document.querySelectorAll(".priority");
}

const togglePriority = (e) => {
    e.target.classList.toggle("is-priority");
    dataCards.cards.forEach(card=>{
        if(e.target.id.split('-')[1] === card.id.toString()){
            card.priority=card.priority?false:true;
        }
    })
    save();
}

const deleteCard = (id) =>{
    dataCards.cards.forEach(card=>{
        if(card.id === id){
            let index = dataCards.cards.indexOf(card);
            dataCards.cards.splice(index, 1);
            save();
        }
    })
}

const removeClasses = (cardBeignDragged, color) =>{
    cardBeignDragged.classList.remove('red', 'yellow', 'green', 'blue');
    cardBeignDragged.classList.add(color);
    position(cardBeignDragged, color);
}

const position = (cardBeignDragged, color) =>{
    const index = dataCards.cards.findIndex(card => card.id === parseInt(cardBeignDragged.id));
    dataCards.cards[index].position = color;
    save();
}

//cards
const dragover = function() {
    this.classList.add('over');
    cardBeignDragged = document.querySelector('.is-dragging');

    if(this.id ==="red")removeClasses(cardBeignDragged, "red");
    else if(this.id ==="yellow")removeClasses(cardBeignDragged, "yellow");
    else if(this.id ==="green")removeClasses(cardBeignDragged, "green");
    else if(this.id ==="blue")removeClasses(cardBeignDragged, "blue");
    
    this.appendChild(cardBeignDragged);
}

const dragstart = function() {this.classList.add('is-dragging')};

const dragend = function() {this.classList.remove('is-dragging')};

const save = () => localStorage.setItem('@data', JSON.stringify(dataCards));

const dragleave = () => this.classList?.remove('over');

const drop = () => this.classList?.remove('over');

const drag = ()=>{};

const dragenter = () =>{};

