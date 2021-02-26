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
                order: 0,
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

    $(function() {
        $(".kanbanZone")
          .sortable({
            connectWith: ".kanbanZone",
            opacity: 0.8, 
            receive: function( event, ui ) {
                ui.item[0].classList.remove('red', 'yellow', 'green', 'blue');
                ui.item[0].classList.add(this.id);

                const index = dataCards.cards.findIndex(card => card.id === parseInt(ui.item[0].id));
                dataCards.cards[index].position = this.id;
                save();
              },
            stop: function () {
                var strItems = "";

                $(".kanbanZone").children().each(function (i) {
                    var li = $(this);
                    strItems += li.attr("id") + ',' + i + ' ';
                });

                console.log(strItems);
            }
          })
        .disableSelection();
    });
});

//functions

const initializeCards = () => cards = document.querySelectorAll('.kanbanCard');

const initializeComponents = (dataArray) => dataArray.cards.forEach(card=>{ appendComponents(card) });

const save = () => localStorage.setItem('@data', JSON.stringify(dataCards));

const initializeKanbanBoards = () => {
    dataColors.forEach(item=>{
        const htmlElements = 
        `<div class="board">
            <h3>${item.title.toUpperCase()}</h3>
            <div class="kanbanZone" id="${item.color}"></div>
        </div>`
        $("#boardsContainer").append(htmlElements)
    });
};

const appendComponents = (card) =>{
    //creates new card inside of the todo area
    const htmlElements = `
        <div id=${card.id.toString()} class="kanbanCard ${card.position}">

            <span id="span-${card.id.toString()}" onclick="togglePriority(e)" class="material-icons priority ${card.priority? "is-priority": ""}">
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